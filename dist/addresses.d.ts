import { PublicKey, type Signer } from "@solana/web3.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
export declare function getGlobalDataAddress(program: ComptokenProgram): PublicKey;
export declare function getUserDataAddress(program: ComptokenProgram, user: PublicKey): PublicKey;
export declare function getWorldIdNullifierAddress(program: ComptokenProgram, nullifier: Buffer): PublicKey;
export declare function getWorldIdRootAddress(program: SolanaWorldIdProgram, root: Buffer): PublicKey;
export declare function getWorldIdLatestRootAddress(program: SolanaWorldIdProgram): PublicKey;
export declare function getWorldIdConfigAddress(program: SolanaWorldIdProgram): PublicKey;
export declare function getStakedMintAddress(program: ComptokenProgram): PublicKey;
export declare function getUnstakedMintAddress(program: ComptokenProgram): PublicKey;
/**
 * the only valid address for a user's staked token account is the associated token account.
 */
export declare function getUserStakedTokensAddress(program: ComptokenProgram, user: PublicKey): PublicKey;
/**
 * any valid address for a user's unstaked token account is allowed, but this helper gets the associated token account.
 */
export declare function getUserUnstakedAssociatedTokenAddress(program: ComptokenProgram, user: PublicKey): PublicKey;
export declare function createUserStakedTokenAccount(program: ComptokenProgram, user: PublicKey, payer: Signer): Promise<PublicKey>;
export declare function createUserUnstakedTokenAccount(program: ComptokenProgram, user: PublicKey, payer: Signer): Promise<PublicKey>;
//# sourceMappingURL=addresses.d.ts.map