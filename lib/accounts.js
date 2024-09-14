import { blob, f64, greedy, seq, struct } from "@solana/buffer-layout";
import { bool, u64 } from "@solana/buffer-layout-utils";
import { ACCOUNT_SIZE, AccountLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { getOptionOr, numAsU16ToLEBytes, toOption } from "./utils.js";


class ExtensionType {
    // u16 discriminated type for an extension
    // https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L1042-L1115
    static Uninitialized = 0;
    static TransferFeeConfig = 1;
    static TransferFeeAmount = 2;
    static MintCloseAuthority = 3
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
    address;
    lamports;
    owner;
    data;

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

export class Token extends DataTypeWithExtensions {
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

export class TokenAccount extends Account {
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

export class UserData extends DataType {
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

export class UserDataAccount extends Account {
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
])

GlobalData.LAYOUT = GlobalDataLayout; // GlobalDataLayout uses DailyDistributionData, which uses GlobalData's DAILY_DISTRIBUTION_HISTORY_SIZE

export class GlobalDataAccount extends Account {
    static DATA_TYPE = GlobalData;
}