const { TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const {
    PublicKey,
    SystemProgram,
    SYSVAR_SLOT_HASHES_PUBKEY,
    TransactionInstruction,
} = require("@solana/web3.js");
const { createHash } = require("crypto");

const {
    compto_public_keys: public_keys,
} = require("./constants.js");
const { bigintAsU64ToBytes, isLittleEndian, numAsU32ToLEBytes, zip } = require("./utils.js");
const { UserDataAccount } = require("./accounts.js")

/**
 * The target is 0x0e_ad_d8 followed by <difficulty> zero bytes 
 * @param {number} difficulty 
 * @returns {number[32]}
 */
function makeTargetBytes(difficulty) {
    let target_bytes = Array.from({ length: 32 }, () => 0);
    target_bytes[32 - (difficulty + 3)] = 0x0e;
    target_bytes[32 - (difficulty + 2)] = 0xad;
    target_bytes[32 - (difficulty + 1)] = 0xd8;
    return target_bytes;
}

/**
 * @param {Uint8Array} buffer 
 * @returns {Buffer}
 */
function reverseAndConvertToLE(buffer) {
    const reversedBuffer = Buffer.from(buffer).reverse();
    if (isLittleEndian()) {
        return reversedBuffer;
    } else {
        return reversedBuffer.swap32();
    }
}

class ComptokenProof {
    /** @type {PublicKey}  */ pubkey; // PublicKey
    /** @type {Uint8Array} */ recentBlockHash; // [u8; 32]
    /** @type {Uint8Array} */ extraData; // [u8; 32]
    /** @type {number}     */ nonce; // u32
    /** @type {number}     */ version; // u32
    /** @type {number}     */ timestamp; // u32

    /** @type {number[32]} */ target; // [u8; 32]

    /** @type {Buffer}     */ header; // [u8; 80]
    /** @type {Buffer}     */ hash; // [u8; 32]

    // larger difficulty means fewer leading zeroes, so the target is easier
    static #TARGET_DIFFICULTY_DEVNET = 29;
    static #TARGET_DIFFICULTY_MAINNET = 24;

    static TARGET_BYTES = makeTargetBytes(ComptokenProof.#TARGET_DIFFICULTY_MAINNET);
    static TARGET_BYTES_DEVNET = makeTargetBytes(ComptokenProof.#TARGET_DIFFICULTY_DEVNET);

    /** 
     * @param {Object} params
     * @param {PublicKey}  params.pubkey
     * @param {Uint8Array} params.recentBlockHash
     * @param {Uint8Array} params.extraData
     * @param {number}     params.nonce
     * @param {number}     params.version
     * @param {number}     params.timestamp
     * @param {number[]}   params.target
     */
    constructor({ pubkey, recentBlockHash, extraData, nonce, version, timestamp, target = ComptokenProof.TARGET_BYTES }) {
        this.pubkey = pubkey;
        this.recentBlockHash = recentBlockHash;
        this.extraData = extraData;
        this.nonce = nonce;
        this.version = version;
        this.timestamp = timestamp;

        this.target = target;

        this.header = this.constructHeader();
        this.hash = this.generateHash();

        if (!ComptokenProof.isLowerThanTarget(this.hash, this.target)) {
            throw new Error("The provided proof does not have enough zeroes");
        }
    }

    /**
     * @param {Object} params
     * @param {PublicKey}  params.pubkey 
     * @param {Uint8Array} params.recentBlockHash 
     * @param {Uint8Array} params.extraData 
     * @param {number}     params.version 
     * @param {number}     params.timestamp 
     * @returns {ComptokenProof}
     */
    static mine({ pubkey, recentBlockHash, extraData, version, timestamp }) {
        for (let nonce = 0; nonce < 2 ** 32; nonce++) {
            try {
                // there is no reason to *ever* mine a real proof in JS
                return new ComptokenProof({ pubkey, recentBlockHash, extraData, nonce, version, timestamp, target: ComptokenProof.TARGET_BYTES_DEVNET });
            }
            catch (e) {
                continue;
            }
        }
    }

    /**
     * Method to double SHA-256 hash data
     * @param {Buffer} data 
     * @returns {Buffer}
     */
    static doubleSHA256(data) {
        const firstHash = createHash('sha256').update(data).digest();
        const secondHash = createHash('sha256').update(firstHash).digest();
        return secondHash;
    }

    /**
     * @param {Buffer} hash
     * @param {number[]} target 
     * @returns {boolean}
     */
    static isLowerThanTarget(hash, target = ComptokenProof.TARGET_BYTES) {
        for (let [byte, target_byte] of zip(hash, target)) {
            if (byte < target_byte) {
                return true;
            } else if (byte > target_byte) {
                return false;
            }
        }
    }

    /**
     * Construct the block header buffer
     * @returns {Buffer}
     */
    constructHeader() {
        const version = Buffer.allocUnsafe(4);
        version.writeUInt32LE(this.version);

        const prevHashLE = reverseAndConvertToLE(this.recentBlockHash);

        const merkleRoot = ComptokenProof.doubleSHA256(Buffer.concat([this.extraData, this.pubkey.toBuffer()]));

        const timestamp = Buffer.allocUnsafe(4);
        timestamp.writeUInt32LE(this.timestamp);

        const nbits = Buffer.from([0xd8, 0xad, 0x0e, 0x18]);

        const nonce = Buffer.allocUnsafe(4);
        nonce.writeUInt32LE(this.nonce);

        return Buffer.concat([
            version,        // Version (4 bytes)
            prevHashLE,     // Previous Block Hash (32 bytes)
            merkleRoot,     // Merkle Root Hash (32 bytes)
            timestamp,      // Timestamp (4 bytes)
            nbits,          // Difficulty Target (4 bytes)
            nonce           // Nonce (4 bytes)
        ]);
    }

    /**
     * @returns {Buffer}
     */
    generateHash() {
        let hashed = ComptokenProof.doubleSHA256(this.header);
        return hashed.reverse();
    }

    /** @returns {Buffer} */
    serializeData() {
        let buffer = Buffer.concat([
            this.pubkey.toBytes(),
            this.extraData,
            numAsU32ToLEBytes(this.nonce),
            numAsU32ToLEBytes(this.version),
            numAsU32ToLEBytes(this.timestamp)
        ]);
        if (buffer.length != 76) {
            throw new Error(`Incorrect buffer length: ${buffer.length}`);
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
    user_comptoken_token_account_address,
    compto_public_keys = public_keys,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_token_account_address, compto_public_keys);
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
        keys: [
            // will mint some comptokens
            {
                pubkey: compto_public_keys.comptoken_mint_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // stores the current valid blockhashes
            {
                pubkey: compto_public_keys.global_data_account_pubkey,
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
    user_comptoken_token_account_address,
    compto_public_keys = public_keys,
) {
    const user_data_size = 88 + 32 * (num_proofs - 1);
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_token_account_address, compto_public_keys);
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
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

async function createDailyDistributionEventInstruction(compto_public_keys = public_keys) {
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
        keys: [
            // so the token program knows what kind of token
            {
                pubkey: compto_public_keys.comptoken_mint_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // stores information for/from the daily distribution
            {
                pubkey: compto_public_keys.global_data_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for unpaid interest
            {
                pubkey: compto_public_keys.interest_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for unpaid Universal Basic Income to verified humans
            {
                pubkey: compto_public_keys.verified_human_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // comptoken token account used as bank for future ubi payouts
            {
                pubkey: compto_public_keys.future_ubi_bank_account_pubkey,
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
                pubkey: compto_public_keys.future_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
        ],
        data: Buffer.from([Instruction.DAILY_DISTRIBUTION_EVENT]),
    });
}

async function createGetValidBlockhashesInstruction(compto_public_keys = public_keys) {
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
        keys: [
            // stores valid blockhashes, but may be out of date
            {
                pubkey: compto_public_keys.global_data_account_pubkey,
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
    user_comptoken_token_account_address,
    compto_public_keys = public_keys,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_token_account_address, compto_public_keys);
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
        keys: [
            // needed by the transfer hook program
            {
                pubkey: compto_public_keys.compto_program_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Mint lets the token program know what kind of token to move
            {
                pubkey: compto_public_keys.comptoken_mint_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Global Data (also mint authority) stores interest data
            {
                pubkey: compto_public_keys.global_data_account_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Interest Bank stores comptokens owed for interest
            {
                pubkey: compto_public_keys.interest_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // Comptoken UBI Bank stores comptokens owed for UBI
            {
                pubkey: compto_public_keys.verified_human_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: UserDataAccount.addressFromComptokenAccount(compto_public_keys.interest_bank_account_pubkey, compto_public_keys),
                isSigner: false,
                isWritable: false,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: UserDataAccount.addressFromComptokenAccount(compto_public_keys.verified_human_ubi_bank_account_pubkey, compto_public_keys),
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
                pubkey: compto_public_keys.compto_transfer_hook_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // stores account metas to add to transfer instructions
            {
                pubkey: compto_public_keys.compto_extra_account_metas_account_pubkey,
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
    user_comptoken_wallet_address,
    compto_public_keys = public_keys,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_wallet_address, compto_public_keys);
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
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
    user_comptoken_token_account_address,
    compto_public_keys = public_keys,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_wallet_address, compto_public_keys);
    return new TransactionInstruction({
        programId: compto_public_keys.compto_program_id_pubkey,
        keys: [
            // needed by the transfer hook program
            {
                pubkey: compto_public_keys.compto_program_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Mint lets the token program know what kind of token to move
            {
                pubkey: compto_public_keys.comptoken_mint_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // Comptoken Global Data (also mint authority) stores interest data
            {
                pubkey: compto_public_keys.global_data_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // Comptoken Future UBI Bank stores comptokens owed to future verified humans
            {
                pubkey: compto_public_keys.future_ubi_bank_account_pubkey,
                isSigner: false,
                isWritable: true,
            },
            // needed by the transfer hook program (doesn't really exist)
            {
                pubkey: UserDataAccount.addressFromComptokenAccount(compto_public_keys.future_ubi_bank_account_pubkey, compto_public_keys),
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
                pubkey: compto_public_keys.compto_transfer_hook_id_pubkey,
                isSigner: false,
                isWritable: false,
            },
            // stores account metas to add to transfer instructions
            {
                pubkey: compto_public_keys.compto_extra_account_metas_account_pubkey,
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
