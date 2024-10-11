const { PublicKey, Keypair } = require("@solana/web3.js");
const fs = require('fs');
const path = require('path');
const bs58 = require("bs58");

const COMPTOKEN_DECIMALS = 2;
const COMPTOKEN_WALLET_SIZE = 171; // 165 (base account) + 1 (account type discriminator) + 5 (Transfer hook extension)
const GLOBAL_DATA_SIZE = 5960; // MAGIC NUMBER keep consistent with Compto program
const SEC_PER_DAY = 86400;
const DAILY_DISTRIBUTION_HISTORY_SIZE = 365;

// Determine whether to use the cache based on the environment variable
// const useCache = process.env.USE_CACHE === 'true';
const useCache = false;

// Specify the cache directory
const cacheDir = '/home/david/repos/comptoken-program/test/.cache'; // Adjust the path to your cache directory

// Declare variables for public keys and bump seeds
let compto_program_id_pubkey;
let comptoken_mint_pubkey;
let global_data_account_pubkey;
let interest_bank_account_pubkey;
let verified_human_ubi_bank_account_pubkey;
let future_ubi_bank_account_pubkey;
let compto_transfer_hook_id_pubkey;
let compto_extra_account_metas_account_pubkey;
let test_account;

if (!useCache) {
    compto_program_id_pubkey = new PublicKey(bs58.decode("6351sU4nPxMuxGNYNVK17DXC2fP2juh8YHfiMYCR7Zvh")); // devnet
    comptoken_mint_pubkey = new PublicKey(bs58.decode("76KRec9fujGWqdCuPzwiMgxFzQyYMSZa9HeySkbsyufV")); // devnet
    global_data_account_pubkey = new PublicKey(bs58.decode("2TchvJKnE3tsdr5RKyiu1jGofnL8rhLZ9XU5nFwKVLSP")); // devnet
    interest_bank_account_pubkey = new PublicKey(bs58.decode("EaZvWXqhb6kX1rdZkr9yCBRcCTpnYwubSyhxrZtzcfhf")); // devnet
    verified_human_ubi_bank_account_pubkey = new PublicKey(bs58.decode("GoAPpRxCpRgVU6VCW3RAVf9fg4Jysuxt4PqSUpG3H9Xd")); // devnet
    future_ubi_bank_account_pubkey = new PublicKey(bs58.decode("2DXVGENSY9vTdozeFL888yPffC7nrakQAzdxSHanTHmN")); // devnet
    compto_transfer_hook_id_pubkey = new PublicKey(bs58.decode("4GG3aGgaMXDKtrD9pMcmQ4P87pKKCKRxAxR4LGTKpmYt")); // devnet
    compto_extra_account_metas_account_pubkey = new PublicKey(bs58.decode("7oy4vA2rSTXkjKUQVERGRK2SkhNjTDL8xcMBQK6zB9zU")); // devnet

} else {

    const keyMappings = {
        compto_program_id_pubkey: {
            filename: 'compto_program_id.json',
            keyProperty: 'programId',
            type: 'publicKey',
        },
        comptoken_mint_pubkey: {
            filename: 'comptoken_mint.json',
            keyProperty: 'commandOutput.address',
            type: 'publicKey',
        },
        global_data_account_pubkey: {
            filename: 'compto_global_data_account.json',
            keyProperty: 'address',
            type: 'publicKey',
        },
        interest_bank_account_pubkey: {
            filename: 'compto_interest_bank_account.json',
            keyProperty: 'address',
            type: 'publicKey',
        },
        verified_human_ubi_bank_account_pubkey: {
            filename: 'compto_verified_human_ubi_bank_account.json',
            keyProperty: 'address',
            type: 'publicKey',
        },
        future_ubi_bank_account_pubkey: {
            filename: 'compto_future_ubi_bank_account.json',
            keyProperty: 'address',
            type: 'publicKey',
        },
        compto_transfer_hook_id_pubkey: {
            filename: 'compto_transfer_hook_id.json',
            keyProperty: 'programId',
            type: 'publicKey',
        },
        compto_extra_account_metas_account_pubkey: {
            filename: 'compto_extra_account_metas_account.json',
            keyProperty: 'address',
            type: 'publicKey',
        },
        test_account: {
            filename: 'test_user_account.json',
            keyProperty: null,
            type: 'keypair', // This is the only keypair
        },
    };

    // Load all public keys from the cache
    const cachedKeys = loadKeysFromCache(cacheDir, keyMappings);

    // Assign the keys from the cache
    compto_program_id_pubkey = cachedKeys.compto_program_id_pubkey;
    comptoken_mint_pubkey = cachedKeys.comptoken_mint_pubkey;
    global_data_account_pubkey = cachedKeys.global_data_account_pubkey;
    interest_bank_account_pubkey = cachedKeys.interest_bank_account_pubkey;
    verified_human_ubi_bank_account_pubkey = cachedKeys.verified_human_ubi_bank_account_pubkey;
    future_ubi_bank_account_pubkey = cachedKeys.future_ubi_bank_account_pubkey;
    compto_transfer_hook_id_pubkey = cachedKeys.compto_transfer_hook_id_pubkey;
    compto_extra_account_metas_account_pubkey = cachedKeys.compto_extra_account_metas_account_pubkey;
    test_account = cachedKeys.test_account;

    console.log('Loaded public keys from cache');
    console.log('compto_program_id_pubkey:', compto_program_id_pubkey.toBase58());
    console.log('comptoken_mint_pubkey:', comptoken_mint_pubkey.toBase58());
    console.log('global_data_account_pubkey:', global_data_account_pubkey.toBase58());
    console.log('interest_bank_account_pubkey:', interest_bank_account_pubkey.toBase58());
    console.log('verified_human_ubi_bank_account_pubkey:', verified_human_ubi_bank_account_pubkey.toBase58());
    console.log('future_ubi_bank_account_pubkey:', future_ubi_bank_account_pubkey.toBase58());
    console.log('compto_transfer_hook_id_pubkey:', compto_transfer_hook_id_pubkey.toBase58());
    console.log('compto_extra_account_metas_account_pubkey:', compto_extra_account_metas_account_pubkey.toBase58());
}

// Function to load public keys and bump seeds from the cache
function loadKeysFromCache(cacheDir, keyMappings) {
    const keys = {};

    if (!fs.existsSync(cacheDir)) {
        throw new Error(`Cache directory '${cacheDir}' does not exist`);
    }

    for (const [keyName, mapping] of Object.entries(keyMappings)) {
        const filePath = path.join(cacheDir, mapping.filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Missing file '${mapping.filename}' for key '${keyName}' in cache directory '${cacheDir}'`);
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);

        let keyData;

        if (mapping.keyProperty) {
            // Extract the key data using the specified property path
            keyData = getNestedProperty(json, mapping.keyProperty);
        } else {
            // The key data is at the root of the JSON
            keyData = json;
        }

        if (!keyData) {
            throw new Error(`Missing key data in file '${mapping.filename}' for key '${keyName}'`);
        }

        if (mapping.type === 'keypair') {
            // Handle keypair
            const secretKey = Uint8Array.from(keyData);
            const keypair = Keypair.fromSecretKey(secretKey);
            keys[keyName] = keypair;
        } else if (mapping.type === 'publicKey') {
            // Handle public key
            let publicKey;
            if (Array.isArray(keyData)) {
                publicKey = new PublicKey(new Uint8Array(keyData));
            } else if (typeof keyData === 'string') {
                publicKey = new PublicKey(keyData);
            } else {
                throw new Error(`Unsupported public key format in file '${mapping.filename}' for key '${keyName}'`);
            }
            keys[keyName] = publicKey;
        } else {
            throw new Error(`Unknown key type '${mapping.type}' for key '${keyName}'`);
        }
    }

    return keys;
}

function getNestedProperty(obj, propertyPath) {
    return propertyPath.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}

module.exports = {
    COMPTOKEN_DECIMALS,
    COMPTOKEN_WALLET_SIZE,
    GLOBAL_DATA_SIZE,
    SEC_PER_DAY,
    DAILY_DISTRIBUTION_HISTORY_SIZE,
    compto_program_id_pubkey,
    comptoken_mint_pubkey,
    global_data_account_pubkey,
    interest_bank_account_pubkey,
    verified_human_ubi_bank_account_pubkey,
    future_ubi_bank_account_pubkey,
    compto_transfer_hook_id_pubkey,
    compto_extra_account_metas_account_pubkey,
    test_account,
};