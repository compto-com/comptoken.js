const { blob, f64, greedy, seq, struct } = require("@solana/buffer-layout");
const { bool, u64 } = require("@solana/buffer-layout-utils");
const { ACCOUNT_SIZE, AccountLayout, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } = require("@solana/spl-token");
const { Connection, PublicKey } = require("@solana/web3.js");

const { compto_program_id_pubkey, DAILY_DISTRIBUTION_HISTORY_SIZE, global_data_account_pubkey, SEC_PER_DAY } = require("./constants.js");
const { getOptionOr, normalizeTime, numAsU16ToLEBytes, ringBuffer, toOption } = require("./utils.js");

class ExtensionType {
    // u16 discriminated type for an extension
    // https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L1042-L1115
    static Uninitialized = 0;
    static TransferFeeConfig = 1;
    static TransferFeeAmount = 2;
    static MintCloseAuthority = 3;
    static ConfidentialTransferMint = 4;
    static ConfidentialTransferAccount = 5;
    static DefaultAccountState = 6;
    static ImmutableOwner = 7;
    static MemoTransfer = 8;
    static NonTransferable = 9;
    static InterestBearingConfig = 10;
    static CpiGuard = 11;
    static PermanentDelegate = 12;
    static NonTransferableAccount = 13;
    static TransferHook = 14;
    static TransferHookAccount = 15;
    static MetadataPointer = 18;
    static TokenMetadata = 19;
    static GroupPointer = 20;
    static TokenGroup = 21;
    static GroupMemberPointer = 22;
    static TokenGroupMember = 23;
}

class TLV {
    // structure derived from
    // https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L106-L114
    type; // u16
    length; // u16
    value; // [u8; length]

    /**
     * @param {number} type
     * @param {number} length
     * @param {Uint8Array} value
     */
    constructor(type, length, value) {
        this.type = type;
        this.length = length;
        this.value = value;
    }

    static Uninitialized() {
        return new TLV(ExtensionType.Uninitialized, 0, new Uint8Array(0));
    }

    /**
     * @param {PublicKey} programId
     * @param {PublicKey | null} authority
     * @returns {TLV}
     */
    static TransferHook(programId, authority = null) {
        authority = getOptionOr(toOption(authority), () => PublicKey.default);
        let value = Uint8Array.from([...authority.toBytes(), ...programId.toBytes()]);
        return new TLV(ExtensionType.TransferHook, 64, value);
    }

    /**
     * @returns {TLV}
     */
    static TransferHookAccount() {
        let value = new Uint8Array(1);
        return new TLV(ExtensionType.TransferHookAccount, 1, value);
    }

    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        let bytes = Uint8Array.from([...numAsU16ToLEBytes(this.type), ...numAsU16ToLEBytes(this.length), ...this.value]);
        return bytes;
    }

    /**
     * @param {Uint8Array} bytes 
     * @returns {TLV}
     */
    static fromBytes(bytes) {
        let buffer = new DataView(bytes.buffer.slice(bytes.byteOffset));
        return new TLV(buffer.getUint16(0, true), buffer.getUint16(2, true), bytes.subarray(4, 4 + buffer.getUint16(2, true)));
    }
}

class DataType {
    constructor(rawType) {
        // copy the properties from rawType to this
        for (const field in rawType) {
            this[field] = rawType[field];
        }
    }

    getSize() {
        return this.constructor.LAYOUT.span;
    }

    static fromBytes(bytes) {
        return new DataType(this.LAYOUT.decode(bytes));
    }

    toBytes() {
        let bytes = new Uint8Array(this.getSize());
        this.constructor.LAYOUT.encode(this, bytes);
        return bytes;
    }
}

class DataTypeWithExtensions extends DataType {
    extensions;

    static EXTENSIONS_START_INDEX = 165; // comes from https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L273-L291

    constructor(rawType) {
        super(rawType);
        this.extensions = [];
    }

    encodeExtensions(buffer) {
        let index = DataTypeWithExtensions.EXTENSIONS_START_INDEX;
        buffer[index++] = this.constructor.ACCOUNT_TYPE;
        for (let extension of this.extensions) {
            let bytes = extension.toBytes();
            buffer.set(bytes, index);
            index += bytes.length;
        }
    }

    static decodeExtensions(buffer) {
        let index = DataTypeWithExtensions.EXTENSIONS_START_INDEX;
        if (buffer[index++] !== this.ACCOUNT_TYPE) {
            throw Error("Incorrect Account Type: type is " + buffer[index - 1] + " but should be " + this.ACCOUNT_TYPE);
        }
        let extensions = [];
        while (index + 4 < buffer.length) {
            let extension = TLV.fromBytes(buffer.subarray(index));
            extensions.push(extension);
            index += extension.length + 4;
        }
        return extensions;
    }

    addExtensions(...extensions) {
        for (let ext of extensions) {
            this.extensions.push(ext);
        }
        return this;
    }

    getSize() {
        if (this.extensions.length === 0) {
            return this.constructor.SIZE;
        }
        let size = this.extensions.reduce(
            (sum, extension, i) => sum + extension.length + 4,
            166
        );
        if (size == 355) {
            // solana code says they pad with uninitialized ExtensionType if size is 355
            // https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L1047-L1049
            return size + 4;
        }
        return size;
    }

    static fromBytes(bytes) {
        let extensions = this.decodeExtensions(bytes);
        return new DataTypeWithExtensions(super.fromBytes(bytes)).addExtensions(
            ...extensions
        );
    }

    toBytes() {
        let buffer = new Uint8Array(this.getSize());
        buffer.set(super.toBytes(), 0);
        if (this.extensions.length > 0) {
            this.encodeExtensions(buffer);
        }
        return buffer;
    }
}

class Account {
    /** @type {PublicKey} */ address;
    /** @type {bigint}    */ lamports;
    /** @type {PublicKey} */ owner;
    /** @type {DataType}  */ data;

    constructor(address, lamports, owner, data) {
        this.address = address;
        this.lamports = lamports;
        this.owner = owner;
        this.data = data;
    }

    toAddedAccount() {
        return {
            address: this.address,
            info: {
                lamports: this.lamports,
                data: this.data.toBytes(),
                owner: this.owner,
                executable: false,
            },
        };
    }

    toAccount = this.toAddedAccount;

    static fromAccountInfoBytes(address, accountInfo) {
        let data = this.DATA_TYPE.fromBytes(accountInfo.data);
        return new Account(
            address,
            accountInfo.lamports,
            accountInfo.owner,
            data
        );
    }
}

class Token extends DataTypeWithExtensions {
    static LAYOUT = AccountLayout;
    static SIZE = ACCOUNT_SIZE;
    static ACCOUNT_TYPE = 2;

    mint_; //  PublicKey
    nominalOwner_; //  PublicKey
    amount_; //  u64
    delegate_; //  optional PublicKey
    isNative_; //  optional u64
    state_; //  AccountState
    delegatedAmount_; //  u64
    closeAuthority_; //  optional PublicKey
}

class TokenAccount extends Account {
    static DATA_TYPE = Token;
}

const UserDataLayout = struct([
    u64("lastInterestPayoutDate"), // actually an i64 but will always be positive
    bool("isVerifiedHuman"),
    blob(7), // padding
    u64("length"),
    blob(32, "recentBlockhash"),
    seq(blob(32), greedy(32), "proofs"),
]);

class UserData extends DataType {
    static LAYOUT = UserDataLayout;

    static MIN_SIZE = 88; // MAGIC NUMBER: CHANGE NEEDS TO BE REFLECTED IN user_data.rs

    lastInterestPayoutDate_; // i64
    isVerifiedHuman_; // bool
    length_; // usize
    recentBlockhash_; // Hash
    proofs_; // [Hash]

    getSize() {
        return this.constructor.MIN_SIZE + 32 * (this.proofs.length - 1);
    }
}

class UserDataAccount extends Account {
    static DATA_TYPE = UserData;
}

class GlobalData extends DataType {
    // LAYOUT defined later to avoid circular dependency

    validBlockhashes_;
    dailyDistributionData_;

    static DAILY_DISTRIBUTION_HISTORY_SIZE = 365; // MAGIC NUMBER: remain consistent with rust
}

const ValidBlockhashesLayout = struct([
    blob(32, "announcedBlockhash"),
    u64("announcedBlockhashTime"), // actually i64, but will always be positive
    blob(32, "validBlockhash"),
    u64("validBlockhashTime"), // actually i64, but will always be positive
]);

const DistributionLayout = struct([
    f64("interestRate"),
    u64("ubiAmount"),
]);

const DailyDistributionDataLayout = struct([
    u64("yesterdaySupply"),
    u64("highWaterMark"),
    u64("lastDailyDistributionTime"), // actually i64, but will always be positive
    u64("verifiedHumans"),
    u64("oldestHistoricValue"),
    seq(DistributionLayout.replicate(), GlobalData.DAILY_DISTRIBUTION_HISTORY_SIZE, "historicDistributions"),
]);

const GlobalDataLayout = struct([
    ValidBlockhashesLayout.replicate("validBlockhashes"),
    DailyDistributionDataLayout.replicate("dailyDistributionData"),
]);

GlobalData.LAYOUT = GlobalDataLayout; // GlobalDataLayout uses DailyDistributionData, which uses GlobalData's DAILY_DISTRIBUTION_HISTORY_SIZE

class GlobalDataAccount extends Account {
    static DATA_TYPE = GlobalData;
}

/**
 * @template {Account} T
 * @template {typeof T} U
 * @param {Connection} connection
 * @param {PublicKey} address
 * @param {U} type
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<T>}
 */
async function getAccount(connection, address, type, commitment = null) {
    if (commitment === null) {
        commitment = "confirmed";
    }
    const accountInfo = await connection.getAccountInfo(address, commitment);
    if (accountInfo === null) {
        throw new TokenAccountNotFoundError("User comptoken token account does not exist");
    }
    return type.fromAccountInfoBytes(address, accountInfo);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<TokenAccount>}
 */
async function getComptokenAccount(connection, user_comptoken_token_account_address, commitment = null) {
    return getAccount(connection, user_comptoken_token_account_address, TokenAccount, commitment);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<number>}
 */
async function getComptokenBalance(connection, user_comptoken_token_account_address, commitment = null) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<PublicKey>}
 */
async function getNominalOwner(connection, user_comptoken_token_account_address, commitment = null) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data.nominalOwner;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<UserData>}
 * @throws {TokenError}
 */
async function getUserData(connection, user_comptoken_token_account_address, commitment = null) {
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_token_account_address.toBytes()],
        compto_program_id_pubkey
    );
    /** @type {UserDataAccount} */
    const user_data_account = await getAccount(connection, user_data_account_address, UserDataAccount, commitment);
    if (!user_data_account.owner.equals(compto_program_id_pubkey)) {
        console.error(user_data_account.owner.toBase58());
        console.error(compto_program_id_pubkey);
        throw new TokenInvalidAccountOwnerError(`${user_data_account_address} is not owned by the compto program`);
    }
    return user_data_account.data;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<[number, bigint]>}
 */
async function getDistributionOwed(connection, user_comptoken_token_account_address, commitment = null) {
    const daysSinceLastPayout = await getDaysSinceLastPayout(connection, user_comptoken_token_account_address, commitment);
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);

    let interestOwed = Number(userComptokenAccount.data.amount);
    let ubiOwed = 0n;
    let i = 0;
    for (let historicDistribution of await getHistoricDistributions(connection, commitment)) {
        if (i++ < (GlobalData.DAILY_DISTRIBUTION_HISTORY_SIZE - daysSinceLastPayout)) {
            continue;
        }
        interestOwed *= 1 + historicDistribution.interestRate;
        ubiOwed += historicDistribution.ubiAmount;
    }

    if (!(await isVerifiedHuman(connection, user_comptoken_token_account_address, commitment))) {
        ubiOwed = 0n;
    }
    return [interestOwed - Number(userComptokenAccount.data.amount), ubiOwed];
}

/**
 * @param {Connection} connection 
 * @param {PublicKey} user_comptoken_token_account_address 
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<Date>}
 */
async function getLastPayoutDate(connection, user_comptoken_token_account_address, commitment = null) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, commitment);
    return new Date(Number(user_data.lastInterestPayoutDate) * 1000);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<number>}
 * @throws {TokenError}
 */
async function getDaysSinceLastPayout(connection, user_comptoken_token_account_address, commitment = null) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, commitment);

    const daysSinceLastPayout = Math.min(
        DAILY_DISTRIBUTION_HISTORY_SIZE,
        (normalizeTime(new Date()).getTime() * 1000 - user_data.last_interest_payout_date) / SEC_PER_DAY
    );
    return daysSinceLastPayout;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<boolean>}
 * @throws {TokenError}
 */
async function isVerifiedHuman(connection, user_comptoken_token_account_address, commitment = null) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address);
    return user_data.isVerifiedHuman;
}

/**
 * @param {Connection} connection 
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<GlobalData>}
 */
async function getGlobalData(connection, commitment = null) {
    const global_data_account = await getAccount(connection, global_data_account_pubkey, GlobalDataAccount, commitment);
    return global_data_account.data;
}

/**
 * @param {Connection} connection 
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<ValidBlockhashes>}
 */
async function getValidBlockhashes(connection, commitment = null) {
    const globalData = await getGlobalData(connection);
    return globalData.validBlockhashes;
}

/**
 * @param {Connection} connection 
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<Generator<{interestRate: number, ubiAmount: bigint}, void, any>>}
 */
async function getHistoricDistributions(connection, commitment = null) {
    const globalData = await getGlobalData(connection);
    return function* () {
        const oldestHistoricValue = globalData.dailyDistributionData.oldestHistoricValue;
        for (const historicValue of ringBuffer(
            globalData.dailyDistributionData.historicDistributions,
            oldestHistoricValue,
            oldestHistoricValue + BigInt(DAILY_DISTRIBUTION_HISTORY_SIZE))
        ) {
            yield historicValue;
        }
    }();
}

// Exporting the classes and functions
module.exports = {
    Token,
    TokenAccount,
    UserData,
    UserDataAccount,
    getComptokenBalance,
    getNominalOwner,
    getDistributionOwed,
    getLastPayoutDate,
    getDaysSinceLastPayout,
    isVerifiedHuman,
    getValidBlockhashes,
    getHistoricDistributions,
    GlobalData,
    GlobalDataAccount,
};
