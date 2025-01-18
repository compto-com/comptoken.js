const { PublicKey, Keypair } = require("@solana/web3.js");
const fs = require('fs');
const path = require('path');
const bs58 = require("bs58");

const COMPTOKEN_DECIMALS = 2;
const COMPTOKEN_WALLET_SIZE = 171; // 165 (base account) + 1 (account type discriminator) + 5 (Transfer hook extension)
const GLOBAL_DATA_SIZE = 5960; // MAGIC NUMBER keep consistent with Compto program
const SEC_PER_DAY = 86400;
const DAILY_DISTRIBUTION_HISTORY_SIZE = 365;

class ComptoPublicKeys {
    /** @type {PublicKey} */ compto_program_id_pubkey;
    /** @type {PublicKey} */ comptoken_mint_pubkey;
    /** @type {PublicKey} */ global_data_account_pubkey;
    /** @type {PublicKey} */ interest_bank_account_pubkey;
    /** @type {PublicKey} */ verified_human_ubi_bank_account_pubkey;
    /** @type {PublicKey} */ future_ubi_bank_account_pubkey;
    /** @type {PublicKey} */ compto_transfer_hook_id_pubkey;
    /** @type {PublicKey} */ compto_extra_account_metas_account_pubkey;
    /** @type {Keypair?}  */ test_account;

    /**
     * @param {ComptoPublicKeys} params
     * @param {PublicKey}  params.compto_program_id_pubkey
     * @param {PublicKey}  params.comptoken_mint_pubkey
     * @param {PublicKey?} params.global_data_account_pubkey
     * @param {PublicKey?} params.interest_bank_account_pubkey
     * @param {PublicKey?} params.verified_human_ubi_bank_account_pubkey
     * @param {PublicKey?} params.future_ubi_bank_account_pubkey
     * @param {PublicKey}  params.compto_transfer_hook_id_pubkey
     * @param {PublicKey?} params.compto_extra_account_metas_account_pubkey
     * @param {Keypair?}   params.test_account
     */
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
    }) {
        if (!compto_program_id_pubkey) {
            throw new Error('compto_program_id_pubkey is required');
        }
        if (!comptoken_mint_pubkey) {
            throw new Error('comptoken_mint_pubkey is required');
        }
        if (!compto_transfer_hook_id_pubkey) {
            throw new Error('compto_transfer_hook_id_pubkey is required');
        }

        this.compto_program_id_pubkey = compto_program_id_pubkey;
        this.comptoken_mint_pubkey = comptoken_mint_pubkey;
        this.global_data_account_pubkey = global_data_account_pubkey ?? PublicKey.findProgramAddressSync([Buffer.from("Global Data")], compto_program_id_pubkey)[0];
        this.interest_bank_account_pubkey = interest_bank_account_pubkey ?? PublicKey.findProgramAddressSync([Buffer.from("Interest Bank")], compto_program_id_pubkey)[0];
        this.verified_human_ubi_bank_account_pubkey = verified_human_ubi_bank_account_pubkey ?? PublicKey.findProgramAddressSync([Buffer.from("Verified Human UBI Bank")], compto_program_id_pubkey)[0];
        this.future_ubi_bank_account_pubkey = future_ubi_bank_account_pubkey ?? PublicKey.findProgramAddressSync([Buffer.from("Future UBI Bank")], compto_program_id_pubkey)[0];
        this.compto_transfer_hook_id_pubkey = compto_transfer_hook_id_pubkey;
        this.compto_extra_account_metas_account_pubkey = compto_extra_account_metas_account_pubkey ?? PublicKey.findProgramAddressSync([Buffer.from("extra-account-metas"), comptoken_mint_pubkey.toBuffer()], compto_transfer_hook_id_pubkey)[0];
        this.test_account = test_account;
    }

    /**
     * @typedef {{
     *      filename: string,
     *      keyProperty: string | null,
     *      type: string,
     * }} _KeyMapping
     * 
     * @typedef {{
     *      compto_program_id_pubkey: _KeyMapping,
     *      comptoken_mint_pubkey: _KeyMapping,
     *      global_data_account_pubkey: _KeyMapping,
     *      interest_bank_account_pubkey: _KeyMapping,
     *      verified_human_ubi_bank_account_pubkey: _KeyMapping,
     *      future_ubi_bank_account_pubkey: _KeyMapping,
     *      compto_transfer_hook_id_pubkey: _KeyMapping,
     *      compto_extra_account_metas_account_pubkey: _KeyMapping,
     *      test_account: _KeyMapping,
     * }} KeyMappings
     */

    static defaultKeymappings = {
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

    /**
     * Load the public keys from the cache directory
     * @param {string} cacheDir - The directory containing the cached key files
     * @param {KeyMappings} keyMappings - The key mappings to load from the cache
     * @returns {ComptoPublicKeys}
     */
    static loadFromCache(cacheDir, keyMappings = ComptoPublicKeys.defaultKeymappings) {
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
                keyData = ComptoPublicKeys.#getNestedProperty(json, mapping.keyProperty);
            } else {
                // The key data is at the root of the JSON
                keyData = json;
            }

            if (!keyData) {
                throw new Error(`Missing key data in file '${mapping.filename}' for key '${keyName}'`);
            }

            switch (mapping.type) {
                case 'keypair':
                    // Handle keypair
                    const secretKey = Uint8Array.from(keyData);
                    const keypair = Keypair.fromSecretKey(secretKey);
                    keys[keyName] = keypair;
                    break;
                case 'publicKey':
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
                    break;
                default:
                    throw new Error(`Unknown key type '${mapping.type}' for key '${keyName}'`);
            }
        }

        return new ComptoPublicKeys(keys);
    }

    static #getNestedProperty(obj, propertyPath) {
        return propertyPath.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
    }
}

let compto_public_keys = new ComptoPublicKeys({
    compto_program_id_pubkey: new PublicKey(bs58.decode("")),
    comptoken_mint_pubkey: new PublicKey(bs58.decode("")),
    global_data_account_pubkey: new PublicKey(bs58.decode("")),
    interest_bank_account_pubkey: new PublicKey(bs58.decode("")),
    verified_human_ubi_bank_account_pubkey: new PublicKey(bs58.decode("")),
    future_ubi_bank_account_pubkey: new PublicKey(bs58.decode("")),
    compto_transfer_hook_id_pubkey: new PublicKey(bs58.decode("")),
    compto_extra_account_metas_account_pubkey: new PublicKey(bs58.decode("")),
    test_account: null,
});

let devnet_compto_public_keys = new ComptoPublicKeys({
    compto_program_id_pubkey: new PublicKey(bs58.decode("6351sU4nPxMuxGNYNVK17DXC2fP2juh8YHfiMYCR7Zvh")),
    comptoken_mint_pubkey: new PublicKey(bs58.decode("76KRec9fujGWqdCuPzwiMgxFzQyYMSZa9HeySkbsyufV")),
    global_data_account_pubkey: new PublicKey(bs58.decode("2TchvJKnE3tsdr5RKyiu1jGofnL8rhLZ9XU5nFwKVLSP")),
    interest_bank_account_pubkey: new PublicKey(bs58.decode("EaZvWXqhb6kX1rdZkr9yCBRcCTpnYwubSyhxrZtzcfhf")),
    verified_human_ubi_bank_account_pubkey: new PublicKey(bs58.decode("GoAPpRxCpRgVU6VCW3RAVf9fg4Jysuxt4PqSUpG3H9Xd")),
    future_ubi_bank_account_pubkey: new PublicKey(bs58.decode("2DXVGENSY9vTdozeFL888yPffC7nrakQAzdxSHanTHmN")),
    compto_transfer_hook_id_pubkey: new PublicKey(bs58.decode("4GG3aGgaMXDKtrD9pMcmQ4P87pKKCKRxAxR4LGTKpmYt")),
    compto_extra_account_metas_account_pubkey: new PublicKey(bs58.decode("7oy4vA2rSTXkjKUQVERGRK2SkhNjTDL8xcMBQK6zB9zU")),
    test_account: null,
});

module.exports = {
    COMPTOKEN_DECIMALS,
    COMPTOKEN_WALLET_SIZE,
    GLOBAL_DATA_SIZE,
    SEC_PER_DAY,
    DAILY_DISTRIBUTION_HISTORY_SIZE,
    devnet_compto_public_keys,
    compto_public_keys,
    ComptoPublicKeys,
};