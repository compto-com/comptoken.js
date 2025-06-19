const { blob, f64, greedy, seq, struct, Layout } = require("@solana/buffer-layout");
// @ts-ignore - bool and u64 are exported from @solana/buffer-layout-utils (not sure why ts is complaining)
const { bool, u64 } = require("@solana/buffer-layout-utils");
const { ACCOUNT_SIZE, AccountLayout } = require("@solana/spl-token");
const { PublicKey } = require("@solana/web3.js");

const { compto_public_keys: public_keys, ComptoPublicKeys } = require("./constants.js");
const { getOptionOr, numAsU16ToLEBytes, toOption } = require("./utils.js");

/**
 * @import { AccountInfo } from "@solana/web3.js"
 * @import { AccountState, RawAccount } from "@solana/spl-token"
 */

/**
 * helper type that improves the readability of intersection types
 * @template T
 * @typedef {{
 *      [Key in keyof T]: T[Key]
 * } & {}} Prettify
 */

/**
 * @template Type
 * @typedef {Type | undefined | null} Nullable
 */

/**
 * @template Type
 * @typedef {{ [Key in keyof Type as Type[Key] extends Nullable<(...args: any[]) => any>
 *      ? never
 *      : Key]: Type[Key];
 * }} RemoveMethods<Type> = ;
 */

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

/**
 * @template DataT
 * @interface
 * @typedef  {{
 *      new (t: DataT): DataType<DataT>,
 *      LAYOUT: Layout<DataT>,
 *      fromBytes: (bytes: Uint8Array) => DataType<DataT>,
 * }} DataTypeStatic
 */

/**
 * @template DataT
 * @typedef {Prettify<
 *      DataT
 *      & {
 *          data: DataT,
 *          getSize: () => number,
 *          toBytes: () => Uint8Array,
 *      }>
 * } DataType
 */

/**
 * @template DataT
 * @param {DataTypeStatic<DataT>} dataType
 * @param {Uint8Array} bytes
 */
function fromBytesDataType(dataType, bytes) {
    return new dataType(dataType.LAYOUT.decode(bytes));
}

/**
 * @template DataT
 * @this {DataType<DataT>}
 * @param {DataTypeStatic<DataT>} dataType
 */
function toBytesDataType(dataType) {
    let buffer = new Uint8Array(this.getSize());
    dataType.LAYOUT.encode(this.data, buffer);
    return buffer;
}

/**
 * @template DataT
 * @this {DataType<DataT>}
 * @param {DataTypeStatic<DataT>} dataType
 */
function getSizeDataType(dataType) {
    return dataType.LAYOUT.span;
}

/**
 * @template DataT
 * @typedef  {Prettify<
 *      DataTypeStatic<DataT> 
 *      & {
 *          EXTENSIONS_START_INDEX: 165, 
 *          SIZE: number,
 *          ACCOUNT_TYPE: number,
 *          decodeExtensions: (buffer: Uint8Array) => TLV[]
 *      }> & { new (t: DataT): DataTypeWithExtensions<DataT> }
 * } DataTypeWithExtensionsStatic
 */

/**
 * @template DataT
 * @typedef {Prettify<
 *      DataType<DataT>
 *      & {
 *          data: DataT,
 *          extensions: TLV[],
 *          encodeExtensions: (buffer: Uint8Array) => void,
 *          addExtensions: (...extensions: TLV[]) => DataTypeWithExtensions<DataT>,
 *        }>
 * } DataTypeWithExtensions
 */

/**
 * @template DataT
 * @this {DataTypeWithExtensions<DataT>}
 * @param {DataTypeWithExtensionsStatic<DataT>} dataType
 * @param {Uint8Array} buffer
 */
function encodeExtensionsDataTypeWithExtensions(dataType, buffer) {
    let index = dataType.EXTENSIONS_START_INDEX;
    buffer[index++] = dataType.ACCOUNT_TYPE;
    for (let extension of this.extensions) {
        let bytes = extension.toBytes();
        buffer.set(bytes, index);
        index += bytes.length;
    }
}

/**
 * @template DataT
 * @param {DataTypeWithExtensionsStatic<DataT>} dataType
 * @param {Uint8Array} buffer
 */
function decodeExtensionsDataTypeWithExtensions(dataType, buffer) {
    let index = dataType.EXTENSIONS_START_INDEX;
    if (buffer[index++] !== dataType.ACCOUNT_TYPE) {
        throw Error("Incorrect Account Type: type is " + buffer[index - 1] + " but should be " + dataType.ACCOUNT_TYPE);
    }
    let extensions = [];
    while (index + 4 < buffer.length) {
        let extension = TLV.fromBytes(buffer.subarray(index));
        extensions.push(extension);
        index += extension.length + 4;
    }
    return extensions;
}

/**
 * @template DataT
 * @this {DataTypeWithExtensions<DataT>}
 * @param {DataTypeWithExtensionsStatic<DataT>} _dataType - helps with type inference
 * @param {TLV[]} extensions
 */
function addExtensionsDataTypeWithExtensions(_dataType, ...extensions) {
    for (let ext of extensions) {
        this.extensions.push(ext);
    }
    return this;
}


/**
 * @template DataT
 * @this {DataTypeWithExtensions<DataT>}
 * @param {DataTypeWithExtensionsStatic<DataT>} dataType
 */
function getSizeDataTypeWithExtensions(dataType) {
    if (this.extensions.length === 0) {
        return dataType.SIZE;
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

/**
 * @template DataT
 * @param {DataTypeWithExtensionsStatic<DataT>} dataType 
 * @param {Uint8Array} bytes 
 * @returns 
 */
function fromBytesDataTypeWithExtensions(dataType, bytes) {
    let extensions = dataType.decodeExtensions(bytes);
    return new dataType(/** @type {typeof fromBytesDataType<DataT>} */(fromBytesDataType)(dataType, bytes).data)
        .addExtensions(...extensions);
}

/**
 * @template DataT
 * @this {DataTypeWithExtensions<DataT>}
 * @param {DataTypeWithExtensionsStatic<DataT>} dataType 
 */
function toBytesDataTypeWithExtensions(dataType) {
    let buffer = new Uint8Array(this.getSize());
    buffer.set(/** @type {typeof toBytesDataType<DataT>} */(toBytesDataType).call(this, dataType), 0);
    if (this.extensions.length > 0) {
        this.encodeExtensions(buffer);
    }
    return buffer;
}

/**
 * @template DataT
 * @typedef {{
 *      new (address: PublicKey, lamports: number, owner: PublicKey, data: DataType<DataT>): Account<DataT>,
 *      DATA_TYPE: DataTypeStatic<DataT>,
 *      fromAccountInfoBytes: (address: PublicKey, accountInfo: AccountInfo<Uint8Array>) => Account<DataT>,
 * }} AccountStatic
 */

/**
 * @template DataT
 * @typedef {{
 *      address: PublicKey,
 *      lamports: number,
 *      owner: PublicKey,
 *      _data: DataType<DataT>,
 *      data: DataT,
 *      toAddedAccount: () => { address: PublicKey, info: AccountInfo<Uint8Array> },
 *      toAccount: () => { address: PublicKey, info: AccountInfo<Uint8Array> },
 * }} Account
 */


/**
 * @template DataT
 * @this {Account<DataT>}
 * @returns {{
 *      address: PublicKey,
 *      info: AccountInfo<Uint8Array>,
 * }}
 */
function toAddedAccountAccount() {
    return {
        address: this.address,
        info: {
            lamports: this.lamports,
            data: this._data.toBytes(),
            owner: this.owner,
            executable: false,
        },
    };
}

/**
 * @template DataT
 * @param {AccountStatic<DataT>} accountType
 * @param {PublicKey} address
 * @param {AccountInfo<Uint8Array>} accountInfo
 */
function fromAccountInfoBytesAccount(accountType, address, accountInfo) {
    let data = accountType.DATA_TYPE.fromBytes(accountInfo.data);
    return new accountType(
        address,
        accountInfo.lamports,
        accountInfo.owner,
        data
    );
}

/**
 * @implements {DataTypeWithExtensions<RawAccount>}
 */
class Token {
    /** @readonly */
    static EXTENSIONS_START_INDEX = 165;

    static LAYOUT = AccountLayout;
    static SIZE = ACCOUNT_SIZE;
    static ACCOUNT_TYPE = 2;

    get data() { return this; }

    /**
     * @param {object}       params
     * @param {PublicKey}    params.mint
     * @param {PublicKey}    params.owner
     * @param {bigint}       params.amount
     * @param {0 | 1}        params.delegateOption
     * @param {PublicKey}    params.delegate
     * @param {0 | 1}        params.isNativeOption
     * @param {bigint}       params.isNative
     * @param {AccountState} params.state
     * @param {bigint}       params.delegatedAmount
     * @param {0 | 1}        params.closeAuthorityOption
     * @param {PublicKey}    params.closeAuthority
     */
    constructor({
        mint,
        owner,
        amount,
        delegateOption = 0,
        delegate = PublicKey.default,
        isNativeOption = 0,
        isNative = 0n,
        state,
        delegatedAmount,
        closeAuthorityOption = 0,
        closeAuthority = PublicKey.default,
    }) {
        this.mint = mint;
        this.nominalOwner = owner;
        this.owner = owner;
        this.amount = amount;
        this.delegateOption = delegateOption;
        this.delegate = delegate;
        this.isNativeOption = isNativeOption;
        this.isNative = isNative;
        this.state = state;
        this.delegatedAmount = delegatedAmount;
        this.closeAuthorityOption = closeAuthorityOption;
        this.closeAuthority = closeAuthority;
        this.extensions = /** @type {TLV[]} */([]);
    }

    /** 
     * @returns {number}
     */
    getSize() {
        /** @type {typeof getSizeDataTypeWithExtensions<RawAccount>} */
        const _getSize = getSizeDataTypeWithExtensions;
        return _getSize.call(this, Token)
    };

    toBytes() {
        /** @type {typeof toBytesDataTypeWithExtensions<RawAccount>} */
        const _toBytes = toBytesDataTypeWithExtensions;
        return _toBytes.call(this, Token);
    };

    /**
     * @param {Uint8Array} bytes
     */
    static fromBytes(bytes) {
        /** @type {typeof fromBytesDataTypeWithExtensions<RawAccount>} */
        const _fromBytes = fromBytesDataTypeWithExtensions;
        return _fromBytes(Token, bytes);
    }

    /**
     * @param {Uint8Array} buffer
     */
    encodeExtensions(buffer) {
        /** @type {typeof encodeExtensionsDataTypeWithExtensions<RawAccount>} */
        const _encodeExtensions = encodeExtensionsDataTypeWithExtensions;
        _encodeExtensions.call(this, Token, buffer);
    };
    /**
     * @param {Uint8Array} buffer
     */
    static decodeExtensions(buffer) {
        /** @type {typeof decodeExtensionsDataTypeWithExtensions<RawAccount>} */
        const _decodeExtensions = decodeExtensionsDataTypeWithExtensions;
        return _decodeExtensions(Token, buffer);
    }

    /**
     * @param {...TLV} extensions
     * @returns {DataTypeWithExtensions<RawAccount>}
     */
    addExtensions(...extensions) {
        /** @type {typeof addExtensionsDataTypeWithExtensions<RawAccount>} */
        const _addExtensions = addExtensionsDataTypeWithExtensions;
        return _addExtensions.call(this, Token, ...extensions);
    };
}
/** @type {DataTypeWithExtensionsStatic<RawAccount>} */ const _TokenStaticTest = Token;

/**
 * @implements {Account<RawAccount>}
 */
class TokenAccount {
    static DATA_TYPE = Token;

    get data() { return this._data.data; }

    /**
     * 
     * @param {PublicKey}                   address 
     * @param {number}                      lamports 
     * @param {PublicKey}                   owner 
     * @param {DataType<RawAccount>} data 
     */
    constructor(address, lamports, owner, data) {
        this.address = address;
        this.lamports = lamports;
        this.owner = owner;
        this._data = data;
    }

    toAddedAccount() {
        /** @type {typeof toAddedAccountAccount<RawAccount>} */
        const _toAddedAccount = toAddedAccountAccount;
        return _toAddedAccount.call(this);
    };
    toAccount = this.toAddedAccount;;

    /**
     * @param {PublicKey} address
     * @param {AccountInfo<Uint8Array>} accountInfo
     */
    static fromAccountInfoBytes(address, accountInfo) {
        /** @type {typeof fromAccountInfoBytesAccount<RawAccount>} */
        const _fromAccountInfoBytes = fromAccountInfoBytesAccount;
        return _fromAccountInfoBytes(TokenAccount, address, accountInfo);
    }

}
/** @type {AccountStatic<RawAccount>} */ let _TokenAccountStaticTest = TokenAccount;

const UserDataLayout = struct([
    u64("lastInterestPayoutDate"), // actually an i64 but will always be positive
    u64("verificationDate"), // actually an i64 but will always be positive
    blob(32, "nullifierHash"),
    u64("staleInterest"),
    u64("staleUbi"),
    u64("length"),
    blob(32, "recentBlockhash"),
    seq(blob(32), greedy(32), "proofs"),
]);

/**
 * @typedef {object} IUserData
 * @property {bigint}      lastInterestPayoutDate
 * @property {boolean}     isVerifiedHuman
 * @property {bigint}      length
 * @property {Uint8Array}   recentBlockhash
 * @property {Uint8Array[]} proofs
 */

/**
 * @implements {DataType<IUserData>}
 */
class UserData {
    static LAYOUT = UserDataLayout;

    static MIN_SIZE = 88; // MAGIC NUMBER: CHANGE NEEDS TO BE REFLECTED IN user_data.rs

    /**
     * @param {object}       params 
     * @param {bigint}       params.lastInterestPayoutDate
     * @param {boolean}      params.isVerifiedHuman
     * @param {bigint}       params.length
     * @param {Uint8Array}   params.recentBlockhash
     * @param {Uint8Array[]} params.proofs
     */
    constructor({
        lastInterestPayoutDate,
        isVerifiedHuman,
        length,
        recentBlockhash,
        proofs,
    }) {
        this.lastInterestPayoutDate = lastInterestPayoutDate;
        this.isVerifiedHuman = isVerifiedHuman;
        this.length = length;
        this.recentBlockhash = recentBlockhash;
        this.proofs = proofs;
    }
    get data() { return this; };

    toBytes() {
        /** @type {typeof toBytesDataType<IUserData>} */
        const _toBytes = toBytesDataType;
        return _toBytes.call(this, UserData);
    };

    getSize() {
        return UserData.MIN_SIZE + 32 * (this.proofs.length - 1);
    }

    /**
     * @param {Uint8Array} bytes
     */
    static fromBytes(bytes) {
        /** @type {typeof fromBytesDataType<IUserData>} */
        const _fromBytes = fromBytesDataType;
        return _fromBytes(UserData, bytes);
    }
}
/** @type {DataTypeStatic<IUserData>} */ const _UserDataStaticTest = UserData;

/**
 * @implements {Account<IUserData>}
 */
class UserDataAccount {
    static DATA_TYPE = UserData;

    get data() { return this._data.data; }

    /**
     * @param {PublicKey}           address
     * @param {number}              lamports
     * @param {PublicKey}           owner
     * @param {DataType<IUserData>} data
     */
    constructor(address, lamports, owner, data) {
        this.address = address;
        this.lamports = lamports;
        this.owner = owner;
        this._data = data;
    }

    toAddedAccount() {
        /** @type {typeof toAddedAccountAccount<IUserData>} */
        const _toAddedAccount = toAddedAccountAccount;
        return _toAddedAccount.call(this);
    };
    toAccount = this.toAddedAccount;

    /**
     * @param {PublicKey}               address
     * @param {AccountInfo<Uint8Array>} accountInfo
     */
    static fromAccountInfoBytes(address, accountInfo) {
        /** @type {typeof fromAccountInfoBytesAccount<IUserData>} */
        const _fromAccountInfoBytes = fromAccountInfoBytesAccount;
        return _fromAccountInfoBytes(UserDataAccount, address, accountInfo);
    }

    /**
     * @param {PublicKey}         comptokenAccountAddress
     * @param {ComptoPublicKeys} [compto_public_keys]
     * @returns {PublicKey}
     */
    static addressFromComptokenAccount(comptokenAccountAddress, compto_public_keys = public_keys) {
        return PublicKey.findProgramAddressSync([comptokenAccountAddress.toBytes()], compto_public_keys.compto_program_id_pubkey)[0];
    }
}
/** @type {AccountStatic<IUserData>} */ let _UserDataAccountStaticTest = UserDataAccount;

/**
 * @typedef {object} ValidBlockhashes
 * @property {Uint8Array} announcedBlockhash - 32 bytes
 * @property {bigint}     announcedBlockhashTime
 * @property {Uint8Array} validBlockhash - 32 bytes
 * @property {bigint}     validBlockhashTime
 */

/**
 * @typedef {object} Distribution
 * @property {number} interestRate
 * @property {bigint} ubiAmount
 */

/**
 * @typedef {object} DailyDistributionData
 * @property {bigint}         yesterdaySupply
 * @property {bigint}         highWaterMark
 * @property {bigint}         lastDailyDistributionTime
 * @property {bigint}         verifiedHumans
 * @property {bigint}         oldestHistoricValue
 * @property {Distribution[]} historicDistributions
 */

/**
 * @typedef {object} IGlobalData
 * @property {ValidBlockhashes}      validBlockhashes
 * @property {DailyDistributionData} dailyDistributionData
 */

/**
 * @implements {DataType<IGlobalData>}
 */
class GlobalData {
    static DAILY_DISTRIBUTION_HISTORY_SIZE = 365; // MAGIC NUMBER: remain consistent with rust

    /**
     * @param {object}                params 
     * @param {ValidBlockhashes}      params.validBlockhashes
     * @param {DailyDistributionData} params.dailyDistributionData
     */
    constructor({ validBlockhashes, dailyDistributionData }) {
        this.validBlockhashes = validBlockhashes;
        this.dailyDistributionData = dailyDistributionData;
    }
    get data() { return this; };

    getSize() {
        /** @type {typeof getSizeDataType<IGlobalData>} */
        const _getSize = getSizeDataType;
        return _getSize.call(this, GlobalData);
    };

    toBytes() {
        /** @type {typeof toBytesDataType<IGlobalData>} */
        const _toBytes = toBytesDataType;
        return _toBytes.call(this, GlobalData);
    };

    /**
     * @param {Uint8Array} bytes
     */
    static fromBytes(bytes) {
        /** @type {typeof fromBytesDataType<IGlobalData>} */
        const _fromBytes = fromBytesDataType;
        return _fromBytes(GlobalData, bytes);
    }
}
/** @type {DataTypeStatic<IGlobalData>} */ const _GlobalDataStaticTest = GlobalData;

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
    u64("staleVerifiedHumans"),
    u64("totalStaleComptokens"),
    u64("oldestHistoricValue"),
    seq(DistributionLayout, GlobalData.DAILY_DISTRIBUTION_HISTORY_SIZE, "historicDistributions"),
]);

const GlobalDataLayout = struct([
    ValidBlockhashesLayout.replicate("validBlockhashes"),
    DailyDistributionDataLayout.replicate("dailyDistributionData"),
]);

GlobalData.LAYOUT = GlobalDataLayout; // GlobalDataLayout uses DailyDistributionData, which uses GlobalData's DAILY_DISTRIBUTION_HISTORY_SIZE

/**
 * @implements {Account<IGlobalData>}
 */
class GlobalDataAccount {
    static DATA_TYPE = GlobalData;

    get data() { return this._data.data; }

    /**
     * @param {PublicKey}           address
     * @param {number}              lamports
     * @param {PublicKey}           owner
     * @param {DataType<IGlobalData>} data
     */
    constructor(address, lamports, owner, data) {
        this.address = address;
        this.lamports = lamports;
        this.owner = owner;
        this._data = data;
    }

    toAddedAccount() {
        /** @type {typeof toAddedAccountAccount<IGlobalData>} */
        const _toAddedAccount = toAddedAccountAccount;
        return _toAddedAccount.call(this);
    };
    toAccount = this.toAddedAccount;

    /**
     * @param {PublicKey}               address
     * @param {AccountInfo<Uint8Array>} accountInfo
     */
    static fromAccountInfoBytes(address, accountInfo) {
        /** @type {typeof fromAccountInfoBytesAccount<IGlobalData>} */
        const _fromAccountInfoBytes = fromAccountInfoBytesAccount;
        return _fromAccountInfoBytes(GlobalDataAccount, address, accountInfo);
    }
}
/** @type {AccountStatic<IGlobalData>} */ const _GlobalDataAccountStaticTest = GlobalDataAccount;

// Exporting the classes and functions
module.exports = {
    TLV,
    Token,
    TokenAccount,
    UserData,
    UserDataAccount,
    GlobalData,
    GlobalDataAccount,
};
