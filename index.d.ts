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
