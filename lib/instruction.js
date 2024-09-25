const { TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const {
    PublicKey,
    SystemProgram,
    SYSVAR_SLOT_HASHES_PUBKEY,
    TransactionInstruction,
} = require("@solana/web3.js");
const { createHash } = require("crypto");

const {
    compto_extra_account_metas_account_pubkey,
    compto_program_id_pubkey,
    compto_transfer_hook_id_pubkey,
    comptoken_mint_pubkey,
    future_ubi_bank_account_pubkey,
    global_data_account_pubkey,
    interest_bank_account_pubkey,
    verified_human_ubi_bank_account_pubkey,
} = require("./constants.js");
const { bigintAsU64ToBytes } = require("./utils.js");

class ComptokenProof {
    pubkey;
    recentBlockHash;
    nonce;
    hash;

    static MIN_NUM_ZEROED_BITS = 12;

    constructor(pubkey, recentBlockHash, nonce) {
        this.pubkey = pubkey;
        this.recentBlockHash = recentBlockHash;
        this.nonce = Buffer.from(bigintAsU64ToBytes(BigInt(nonce)));
        this.hash = this.generateHash();
        if (ComptokenProof.leadingZeroes(this.hash) < ComptokenProof.MIN_NUM_ZEROED_BITS) {
            throw new Error("The provided proof does not have enough zeroes");
        }
    }

    generateHash() {
        let hasher = createHash("sha256");
        hasher.update(this.pubkey.toBuffer());
        hasher.update(this.recentBlockHash);
        hasher.update(this.nonce);
        return hasher.digest();
    }

    static leadingZeroes(hash) {
        let numZeroes = 0;
        for (let i = 0; i < hash.length; i++) {
            let byte = hash[i];
            if (byte == 0) {
                numZeroes += 8;
            } else {
                let mask = 0x80; // 10000000
                // mask > 0 is defensive, not technically necessary
                // because the above if case checks for all 0's
                while (mask > 0 && (byte & mask) == 0) {
                    numZeroes += 1;
                    mask >>= 1;
                }
                break;
            }
        }
        return numZeroes;
    }

    serializeData() {
        let buffer = Buffer.concat([
            this.recentBlockHash,
            this.nonce,
            this.hash,
        ]);
        if (buffer.length != 72) {
            throw new Error("Incorrect buffer length");
        }
        return buffer;
    }
}

var Instruction;
(function (Instruction) {
    Instruction[(Instruction["PROOF_SUBMISSION"] = 1)] = "PROOF_SUBMISSION";
    // INITIALIZE_COMPTOKEN_PROGRAM = 2, // not for users
    Instruction[(Instruction["CREATE_USER_DATA_ACCOUNT"] = 3)] = "CREATE_USER_DATA_ACCOUNT";
    Instruction[(Instruction["DAILY_DISTRIBUTION_EVENT"] = 4)] = "DAILY_DISTRIBUTION_EVENT";
    Instruction[(Instruction["GET_VALID_BLOCKHASHES"] = 5)] = "GET_VALID_BLOCKHASHES";
    Instruction[(Instruction["GET_OWED_COMPTOKENS"] = 6)] = "GET_OWED_COMPTOKENS";
    Instruction[(Instruction["GROW_USER_DATA_ACCOUNT"] = 7)] = "GROW_USER_DATA_ACCOUNT";
    Instruction[(Instruction["VERIFY_HUMAN"] = 8)] = "VERIFY_HUMAN";
    // TEST = 255,
})(Instruction || (Instruction = {}));

// Exported functions

async function createProofSubmissionInstruction(
    comptoken_proof,
    user_wallet_address,
    user_comptoken_token_account_address
) {
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_token_account_address.toBytes()],
        compto_program_id_pubkey
    );
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // will mint some comptokens
            {
                pubkey: comptoken_mint_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // stores the current valid blockhashes
            {
                pubkey: global_data_account_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // the owner of the comptoken wallet
            { pubkey: user_wallet_address, isSigner: true, isWritable: false },
            // will store minted comptoken
            {
                pubkey: user_comptoken_token_account_address,
                isSigner: false,
                isWritable: true,
            },
            // stores the proof to prevent duplicate submissions
            {
                pubkey: user_data_account_address,
                isSigner: false,
                isWritable: true,
            },
            // for the actual minting
            {
                pubkey: TOKEN_2022_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([
            Instruction.PROOF_SUBMISSION,
            ...comptoken_proof.serializeData(),
        ]),
    });
}

async function createCreateUserDataAccountInstruction(
    connection,
    num_proofs,
    payer_address,
    user_wallet_address,
    user_comptoken_token_account_address
) {
    const user_data_size = 88 + 32 * (num_proofs - 1);
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_token_account_address.toBytes()],
        compto_program_id_pubkey
    );
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // the payer of the rent for the account
            { pubkey: payer_address, isSigner: true, isWritable: true },
            // the owner of the comptoken wallet
            { pubkey: user_wallet_address, isSigner: true, isWritable: false },
            // the payers comptoken wallet (comptoken token acct)
            {
                pubkey: user_comptoken_token_account_address,
                isSigner: false,
                isWritable: false,
            },
            // the data account tied to the comptoken wallet
            {
                pubkey: user_data_account_address,
                isSigner: false,
                isWritable: true,
            },
            // system account is used to create the account
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([
            Instruction.CREATE_USER_DATA_ACCOUNT,
            ...bigintAsU64ToBytes(
                BigInt(await connection.getMinimumBalanceForRentExemption(user_data_size))
            ),
            ...bigintAsU64ToBytes(BigInt(user_data_size)),
        ]),
    });
}

async function createDailyDistributionEventInstruction() {
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // so the token program knows what kind of token
            {
                pubkey: comptoken_mint_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // stores information for/from the daily distribution
            {
                pubkey: global_data_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for unpaid interest
            {
                pubkey: interest_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for unpaid Universal Basic Income to verified humans
            {
                pubkey: verified_human_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for future ubi payouts
            {
                pubkey: future_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // the token program that will mint the tokens when instructed by the mint authority
            {
                pubkey: TOKEN_2022_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            // program will pull a recent hash from slothashes sysvar if a new valid blockhash is needed.
            {
                pubkey: SYSVAR_SLOT_HASHES_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
            // comptoken token account used as bank for future ubi payouts
            {
                pubkey: future_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
        ],
        data: Buffer.from([Instruction.DAILY_DISTRIBUTION_EVENT]),
    });
}

async function createGetValidBlockhashesInstruction() {
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // stores valid blockhashes, but may be out of date
            {
                pubkey: global_data_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // program will pull a recent hash from slothashes sysvar if a new valid blockhash is needed.
            {
                pubkey: SYSVAR_SLOT_HASHES_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([Instruction.GET_VALID_BLOCKHASHES]),
    });
}

async function createGetOwedComptokensInstruction(
    user_wallet_address,
    user_comptoken_token_account_address
) {
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_token_account_address.toBytes()],
        compto_program_id_pubkey
    );
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // needed by the transfer hook program
            {
                pubkey: compto_program_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Mint lets the token program know what kind of token to move
            {
                pubkey: comptoken_mint_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Global Data (also mint authority) stores interest data
            {
                pubkey: global_data_account_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Interest Bank stores comptokens owed for interest
            {
                pubkey: interest_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // Comptoken UBI Bank stores comptokens owed for UBI
            {
                pubkey: verified_human_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: PublicKey.findProgramAddressSync(
                    [interest_bank_account_pubkey.toBytes()],
                    compto_program_id_pubkey
                )[0],
                isSigner: false,
                isWritable: false,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: PublicKey.findProgramAddressSync(
                    [verified_human_ubi_bank_account_pubkey.toBytes()],
                    compto_program_id_pubkey
                )[0],
                isSigner: false,
                isWritable: false,
            },
            // the owner of the Comptoken Token Account
            { pubkey: user_wallet_address, isSigner: true, isWritable: false },
            // User's Comptoken Token Account is the account to send the comptokens to
            {
                pubkey: user_comptoken_token_account_address,
                isSigner: false,
                isWritable: true,
            },
            // User's Data Account stores how long it's been since they received owed comptokens
            {
                pubkey: user_data_account_address,
                isSigner: false,
                isWritable: true,  
            },
            // compto transfer hook program is called by the transfer that gives the owed comptokens
            {
                pubkey: compto_transfer_hook_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // stores account metas to add to transfer instructions
            {
                pubkey: compto_extra_account_metas_account_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Token 2022 Program moves the tokens
            {
                pubkey: TOKEN_2022_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([Instruction.GET_OWED_COMPTOKENS]),
    });
}

async function createGrowUserDataAccountInstruction(
    connection,
    new_user_data_size,
    payer_address,
    user_wallet_address,
    user_comptoken_wallet_address
) {
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_wallet_address.toBytes()],
        compto_program_id_pubkey
    );
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // the payer of the rent for the account
            { pubkey: payer_address, isSigner: true, isWritable: true },
            // the owner of the comptoken wallet
            { pubkey: user_wallet_address, isSigner: true, isWritable: false },
            // the payers comptoken wallet (comptoken token acct)
            {
                pubkey: user_comptoken_wallet_address,
                isSigner: false,
                isWritable: false,
            },
            // the data account tied to the comptoken wallet
            {
                pubkey: user_data_account_address,
                isSigner: false,
                isWritable: true,
            },
            // system account is used to create the account
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([
            Instruction.GROW_USER_DATA_ACCOUNT,
            ...bigintAsU64ToBytes(
                BigInt(await connection.getMinimumBalanceForRentExemption(new_user_data_size))
            ),
            ...bigintAsU64ToBytes(BigInt(new_user_data_size)),
        ]),
    });
}

async function createVerifyHumanInstruction(
    user_wallet_address,
    user_comptoken_token_account_address
) {
    const [user_data_account_address] = PublicKey.findProgramAddressSync(
        [user_comptoken_token_account_address.toBytes()],
        compto_program_id_pubkey
    );
    return new TransactionInstruction({
        programId: compto_program_id_pubkey,
        keys: [
            // needed by the transfer hook program
            {
                pubkey: compto_program_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Mint lets the token program know what kind of token to move
            {
                pubkey: comptoken_mint_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Global Data (also mint authority) stores interest data
            {
                pubkey: global_data_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // Comptoken Future UBI Bank stores comptokens owed to future verified humans
            {
                pubkey: future_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: PublicKey.findProgramAddressSync(
                    [future_ubi_bank_account_pubkey.toBytes()],
                    compto_program_id_pubkey
                )[0],
                isSigner: false,
                isWritable: false,
            },
            // the owner of the Comptoken Token Account
            { pubkey: user_wallet_address, isSigner: true, isWritable: false },
            // User's Comptoken Token Account is the account to send the comptokens to
            {
                pubkey: user_comptoken_token_account_address,
                isSigner: false,
                isWritable: true,
            },
            // User's Data Account stores how long it's been since they received owed comptokens
            {
                pubkey: user_data_account_address,
                isSigner: false,
                isWritable: true,
            },
            // compto transfer hook program is called by the transfer that gives the owed comptokens
            {
                pubkey: compto_transfer_hook_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // stores account metas to add to transfer instructions
            {
                pubkey: compto_extra_account_metas_account_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Token 2022 Program moves the tokens
            {
                pubkey: TOKEN_2022_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([Instruction.VERIFY_HUMAN]),
    });
}

// Exporting the classes and functions
module.exports = {
    ComptokenProof,
    Instruction,
    createProofSubmissionInstruction,
    createCreateUserDataAccountInstruction,
    createDailyDistributionEventInstruction,
    createGetValidBlockhashesInstruction,
    createGetOwedComptokensInstruction,
    createGrowUserDataAccountInstruction,
    createVerifyHumanInstruction,
};
