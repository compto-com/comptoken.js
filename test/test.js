import { getAccount, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import { comptoken_mint_pubkey, getDistributionOwed } from "../index.js";

let connection = new Connection("https://api.devnet.solana.com");

let owner = new PublicKey("2UnTj2n1dYcB9nKmype5XAUebt9e9NswSTAGwFmHPaZA")

let ata = getAssociatedTokenAddressSync(comptoken_mint_pubkey, owner, undefined, TOKEN_2022_PROGRAM_ID);

console.log(ata.toBase58());

let distribution = await getDistributionOwed(connection, ata);
console.log(distribution);

let account = await getAccount(connection, ata, undefined, TOKEN_2022_PROGRAM_ID);
console.log(account);