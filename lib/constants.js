import { PublicKey } from "@solana/web3.js";

import * as bs58_ from "bs58";
const bs58 = bs58_.default;

export const COMPTOKEN_DECIMALS = 2;
export const COMPTOKEN_WALLET_SIZE = 171; // 165 (base account) + 1 (account type discriminator) + 5 (Transfer hook extension)
export const GLOBAL_DATA_SIZE = 5960; // MAGIC NUMBER keep consistent with Compto program
export const SEC_PER_DAY = 86400;
export const DAILY_DISTRIBUTION_HISTORY_SIZE = 365;

export const compto_program_id_pubkey = new PublicKey(bs58.decode("6351sU4nPxMuxGNYNVK17DXC2fP2juh8YHfiMYCR7Zvh")); // devnet
export const comptoken_mint_pubkey = new PublicKey(bs58.decode("76KRec9fujGWqdCuPzwiMgxFzQyYMSZa9HeySkbsyufV")); // devnet
export const global_data_account_pubkey = new PublicKey(bs58.decode("2TchvJKnE3tsdr5RKyiu1jGofnL8rhLZ9XU5nFwKVLSP")); // devnet
export const interest_bank_account_pubkey = new PublicKey(bs58.decode("EaZvWXqhb6kX1rdZkr9yCBRcCTpnYwubSyhxrZtzcfhf")); // devnet
export const verified_human_ubi_bank_account_pubkey = new PublicKey(bs58.decode("GoAPpRxCpRgVU6VCW3RAVf9fg4Jysuxt4PqSUpG3H9Xd")); // devnet
export const future_ubi_bank_account_pubkey = new PublicKey(bs58.decode("2DXVGENSY9vTdozeFL888yPffC7nrakQAzdxSHanTHmN")); // devnet
export const compto_transfer_hook_id_pubkey = new PublicKey(bs58.decode("4GG3aGgaMXDKtrD9pMcmQ4P87pKKCKRxAxR4LGTKpmYt")); // devnet
export const compto_extra_account_metas_account_pubkey = new PublicKey(bs58.decode("7oy4vA2rSTXkjKUQVERGRK2SkhNjTDL8xcMBQK6zB9zU")); // devnet