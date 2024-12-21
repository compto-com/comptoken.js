import { AccountState } from "@solana/spl-token";
import {
    AccountInfo,
    Commitment,
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
} from "@solana/web3.js";

export declare const COMPTOKEN_DECIMALS = 2;
export declare const COMPTOKEN_WALLET_SIZE = 171;
export declare const compto_program_id_pubkey: PublicKey;
export declare const comptoken_mint_pubkey: PublicKey;
export declare const global_data_account_pubkey: PublicKey;
export declare const interest_bank_account_pubkey: PublicKey;
export declare const verified_human_ubi_bank_account_pubkey: PublicKey;
export declare const future_ubi_bank_account_pubkey: PublicKey;
export declare const compto_transfer_hook_id_pubkey: PublicKey;
export declare const compto_extra_account_metas_account_pubkey: PublicKey;

type _KeyMapping = {
    filename: string;
    keyProperty?: string;
    type: string;
};

type KeyMappings = {
    compto_program_id_pubkey: _KeyMapping;
    comptoken_mint_pubkey: _KeyMapping;
    global_data_account_pubkey: _KeyMapping;
    interest_bank_account_pubkey: _KeyMapping;
    verified_human_ubi_bank_account_pubkey: _KeyMapping;
    future_ubi_bank_account_pubkey: _KeyMapping;
    compto_transfer_hook_id_pubkey: _KeyMapping;
    compto_extra_account_metas_account_pubkey: _KeyMapping;
    test_account: _KeyMapping;
};

export class ComptoPublicKeys {
    compto_program_id_pubkey: PublicKey;
    comptoken_mint_pubkey: PublicKey;
    global_data_account_pubkey: PublicKey;
    interest_bank_account_pubkey: PublicKey;
    verified_human_ubi_bank_account_pubkey: PublicKey;
    future_ubi_bank_account_pubkey: PublicKey;
    compto_transfer_hook_id_pubkey: PublicKey;
    compto_extra_account_metas_account_pubkey: PublicKey;
    test_account?: Keypair;

    constructor({
        compto_program_id_pubkey,
        comptoken_mint_pubkey,
        global_data_account_pubkey,
        interest_bank_account_pubkey,
        verified_human_ubi_bank_account_pubkey,
        future_ubi_bank_account_pubkey,
        compto_transfer_hook_id_pubkey,
        compto_extra_account_metas_account_pubkey,
        test_account,
    }: {
        compto_program_id_pubkey: PublicKey;
        comptoken_mint_pubkey: PublicKey;
        global_data_account_pubkey?: PublicKey;
        interest_bank_account_pubkey?: PublicKey;
        verified_human_ubi_bank_account_pubkey?: PublicKey;
        future_ubi_bank_account_pubkey?: PublicKey;
        compto_transfer_hook_id_pubkey: PublicKey;
        compto_extra_account_metas_account_pubkey?: PublicKey;
        test_account?: Keypair;
    });

    static defaultKeymappings: KeyMappings;

    static loadFromCache(
        cacheDir: string,
        keyMappings?: ComptoPublicKeys
    ): ComptoPublicKeys;
}

export declare class ComptokenProof {
    pubkey: PublicKey;
    recentBlockHash: Uint8Array;
    extraData: Uint8Array;
    nonce: number;
    version: number;
    timestamp: number;

    header: Buffer;
    hash: Buffer;

    constructor({
        pubkey,
        recentBlockHash,
        extraData,
        nonce,
        version,
        timestamp,
        target,
    }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        nonce: number;
        version: number;
        timestamp: number;
        target: number[];
    });

    static isLowerThanTarget(hash: Buffer, target: number[]?): boolean;
    serializeData(): Buffer;
}

export declare enum Instruction {
    PROOF_SUBMISSION = 1,
    CREATE_USER_DATA_ACCOUNT = 3,
    DAILY_DISTRIBUTION_EVENT = 4,
    GET_VALID_BLOCKHASHES = 5,
    GET_OWED_COMPTOKENS = 6,
    GROW_USER_DATA_ACCOUNT = 7,
    VERIFY_HUMAN = 8,
}

export declare function createProofSubmissionInstruction(
    comptoken_proof: ComptokenProof,
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

export declare function createCreateUserDataAccountInstruction(
    connection: Connection,
    num_proofs: number,
    payer_address: PublicKey,
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

export declare function createDailyDistributionEventInstruction(
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

export declare function createGetValidBlockhashesInstruction(
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

export declare function createGetOwedComptokensInstruction(
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

export declare function createGrowUserDataAccountInstruction(
    connection: Connection,
    new_user_data_size: number,
    payer_address: PublicKey,
    user_wallet_address: PublicKey,
    user_comptoken_wallet_address: PublicKey,
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

/** @beta */
export declare function createVerifyHumanInstruction(
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys
): Promise<TransactionInstruction>;

declare class TLV {
    type; // u16
    length; // u16
    value; // [u8; length]

    static Uninitialized(): TLV;
    static TransferHook(
        programId: PublicKey,
        authority: PublicKey | null = null
    ): TLV;
    static TransferHookAccount(): TLV;

    static fromBytes(bytes: Uint8Array): TLV;
    toBytes(): Uint8Array;
}

declare class DataType {
    getSize(): number;
    static fromBytes(bytes: Uint8Array): DataType;
    toBytes(): Uint8Array;
}

declare class DataTypeWithExtensions extends DataType {
    extensions: TLV[];
    encodeExtensions(buffer: Buffer);
    static decodeExtensions(buffer: Buffer): TLV[];
    addExtensions(...extensions: TLV): void;
    static fromBytes(bytes: Uint8Array): DataTypeWithExtensions;
    toBytes(): Uint8Array;
}

declare class Account<T> {
    address: PublicKey;
    lamports: number;
    owner: PublicKey;
    data: T;

    constructor(
        address: PublicKey,
        lamports: number,
        owner: PublicKey,
        data: T
    );
}

export declare class Token extends DataTypeWithExtensions {
    mint: PublicKey; //  PublicKey
    nominalOwner: PublicKey; //  PublicKey
    amount: bigint; //  u64
    delegate: PublicKey | null; //  optional PublicKey
    isNative: bigint | null; //  optional u64
    state: AccountState; //  AccountState
    delegatedAmount: bigint; //  u64
    closeAuthority: PublicKey | null; //  optional PublicKey
}

export class TokenAccount extends Account<Token> {
    static fromAccountInfoBytes(
        address: PublicKey,
        accountInfo: AccountInfo<Uint8Array>
    ): TokenAccount;
}

type Hash = Uint8Array;

export class UserData extends DataType {
    static MIN_SIZE: number; // MAGIC NUMBER: CHANGE NEEDS TO BE REFLECTED IN user_data.rs

    lastInterestPayoutDate: bigint; // i64
    isVerifiedHuman: boolean; // bool
    length: bigint; // usize
    recentBlockhash: Hash; // Hash
    proofs: Hash[]; // [Hash]
}

export class UserDataAccount extends Account<UserData> {
    static fromAccountInfoBytes(
        address: PublicKey,
        accountInfo: AccountInfo<Uint8Array>
    ): UserDataAccount;

    static addressFromComptokenAccount(
        comptokenAccountAddress: PublicKey,
        compto_public_keys: ComptoPublicKeys | null
    ): PublicKey;
}

type ValidBlockhashes = {
    announcedBlockhash: Hash;
    announcedBlockhashTime: bigint; // i64
    validBlockhash: Hash;
    validBlockhashTime: bigint; // i64
};

type DailyDistributionData = {
    yesterdaySupply: bigint; // u64
    highWaterMark: bigint; // u64
    lastDailyDistributionTime: bigint; // i64
    verifiedHumans: bigint; // u64
    oldestHistoricValue: bigint; // u64
    historicDistributions: {
        interestRate: number; // f64
        ubiAmount: bigint; // u64
    }[];
};

declare class GlobalData extends DataType {
    static DAILY_DISTRIBUTION_HISTORY_SIZE: number; // MAGIC NUMBER: remain consistent with rust

    validBlockhashes: ValidBlockhashes;
    dailyDistributionData: DailyDistributionData;
}

export class GlobalDataAccount extends Account<GlobalData> {
    static fromAccountInfoBytes(
        address: PublicKey,
        accountInfo: AccountInfo<Uint8Array>
    ): GlobalDataAccount;
}

interface DistributionOwed {
    interestOwed: number;
    ubiOwed: number;
}

export declare function getDistributionOwed(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<DistributionOwed>;

export declare function getDaysSinceLastPayout(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<number>;

export declare function isVerifiedHuman(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<boolean>;

export declare function getComptokenBalance(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    commitment?: Commitment
): Promise<number>;

export declare function getNominalOwner(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    commitment?: Commitment
): Promise<PublicKey>;

export declare function getValidBlockhashes(
    connection: Connection,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<Promise<ValidBlockhashes>>;

export declare function getHistoricDistributions(
    connection: Connection,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<Generator<{ interestRate: number; ubiAmount: bigint }, void, any>>;

export declare function getLastPayoutDate(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey,
    compto_public_keys: ComptoPublicKeys,
    commitment?: Commitment
): Promise<Date>;
