const { PublicKey } = require("@solana/web3.js");

const bs58 = require("bs58");

const COMPTOKEN_DECIMALS = 2;
const COMPTOKEN_WALLET_SIZE = 171; // 165 (base account) + 1 (account type discriminator) + 5 (Transfer hook extension)
const GLOBAL_DATA_SIZE = 5960; // MAGIC NUMBER keep consistent with Compto program
const SEC_PER_DAY = 86400;
const DAILY_DISTRIBUTION_HISTORY_SIZE = 365;

const compto_program_id_pubkey = new PublicKey(bs58.decode("6351sU4nPxMuxGNYNVK17DXC2fP2juh8YHfiMYCR7Zvh")); // devnet
const comptoken_mint_pubkey = new PublicKey(bs58.decode("76KRec9fujGWqdCuPzwiMgxFzQyYMSZa9HeySkbsyufV")); // devnet
const global_data_account_pubkey = new PublicKey(bs58.decode("2TchvJKnE3tsdr5RKyiu1jGofnL8rhLZ9XU5nFwKVLSP")); // devnet
const interest_bank_account_pubkey = new PublicKey(bs58.decode("EaZvWXqhb6kX1rdZkr9yCBRcCTpnYwubSyhxrZtzcfhf")); // devnet
const verified_human_ubi_bank_account_pubkey = new PublicKey(bs58.decode("GoAPpRxCpRgVU6VCW3RAVf9fg4Jysuxt4PqSUpG3H9Xd")); // devnet
const future_ubi_bank_account_pubkey = new PublicKey(bs58.decode("2DXVGENSY9vTdozeFL888yPffC7nrakQAzdxSHanTHmN")); // devnet
const compto_transfer_hook_id_pubkey = new PublicKey(bs58.decode("4GG3aGgaMXDKtrD9pMcmQ4P87pKKCKRxAxR4LGTKpmYt")); // devnet
const compto_extra_account_metas_account_pubkey = new PublicKey(bs58.decode("7oy4vA2rSTXkjKUQVERGRK2SkhNjTDL8xcMBQK6zB9zU")); // devnet

modules.exports = {
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
    };