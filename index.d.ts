import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
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
export declare class ComptokenProof {
    pubkey: PublicKey;
    recentBlockHash: Uint8Array;
    nonce: Buffer;
    hash: Buffer;
    static MIN_NUM_ZEROED_BITS: number;
    constructor(
        pubkey: PublicKey,
        recentBlockHash: Uint8Array,
        nonce: number | bigint
    );
    generateHash(): Buffer;
    static leadingZeroes(hash: Buffer): number;
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
    user_comptoken_token_account_address: PublicKey
): Promise<TransactionInstruction>;
export declare function createCreateUserDataAccountInstruction(
    connection: Connection,
    num_proofs: number,
    payer_address: PublicKey,
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey
): Promise<TransactionInstruction>;
export declare function createDailyDistributionEventInstruction(): Promise<TransactionInstruction>;
export declare function createGetValidBlockhashesInstruction(): Promise<TransactionInstruction>;
export declare function createGetOwedComptokensInstruction(
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey
): Promise<TransactionInstruction>;
export declare function createGrowUserDataAccountInstruction(
    connection: Connection,
    new_user_data_size: number,
    payer_address: PublicKey,
    user_wallet_address: PublicKey,
    user_comptoken_wallet_address: PublicKey
): Promise<TransactionInstruction>;
export declare function createVerifyHumanInstruction(
    user_wallet_address: PublicKey,
    user_comptoken_token_account_address: PublicKey
): Promise<TransactionInstruction>;

export declare function getDistributionOwed(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promise<number[]>;

import { AccountState } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

declare class TLV {
    type; // u16
    length; // u16
    value; // [u8; length]
}

declare interface DataType {
    getSize(): number;
    static fromBytes(bytes: Uint8Array): DataType;
    toBytes(): Uint8Array;
}

declare interface DataTypeWithExtensions extends DataType {
    extensions: TLV[];
    encodeExtensions(buffer);
    static decodeExtensions(buffer);
    addExtensions(...extensions);
    static fromBytes(bytes);
    toBytes();
}

declare class Account<T> {
    address: PublicKey;
    lamports: number;
    owner: PublicKey;
    data: T;

    constructor(address, lamports, owner, data);
}

declare interface FromAccountInfoBytes {
    static fromAccountInfoBytes(address, accountInfo): ThisType;
}

export declare class Token {
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
    ): ThisType;
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
    ): ThisType;
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
    ): ThisType;
}

interface DistributionOwed {
    interestOwed: number;
    ubiOwed: number;
}

export async function getDistributionOwed(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promise<DistributionOwed>;

export async function getDaysSinceLastPayout(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promise<number>;

export async function isVerifiedHuman(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promies<boolean>;

export async function getComptokenBalance(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promise<number>;

export async function getNominalOwner(
    connection: Connection,
    user_comptoken_token_account_address: PublicKey
): Promise<PublicKey>;

export async function getValidBlockhashes(
    connection: Connection
): Promise<Promise<ValidBlockhashes>> {
    const globalData = await getGlobalData(connection);
    return globalData.validBlockhashes;
}

export async function* getHistoricDistributions(
    connection: Connection
): Promise<Generator<{ interestRate: number; ubiAmount: bigint }, void, any>>;
