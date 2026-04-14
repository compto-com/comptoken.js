import { PublicKey, type Signer } from "@solana/web3.js";

import { getComptokenConstants } from "./factory.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";

const VERIFICATION_TYPE = getComptokenConstants().verificationType;

// importing spl-token takes ~10s (for some reason), so this is just a trimmed down version of an export from spl-token
function getAssociatedTokenAddressSync(mint: PublicKey, owner: PublicKey): PublicKey {
    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    return address;
}

export function getGlobalDataAddress(program: ComptokenProgram): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.globalDataSeed], program.programId)[0];
}

export function getUserDataAddress(program: ComptokenProgram, user: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.userDataSeed, user.toBuffer()], program.programId)[0];
}

export function getWorldIdNullifierAddress(program: ComptokenProgram, nullifier: Buffer): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.nullifierSeed, nullifier], program.programId)[0];
}

export function getWorldIdRootAddress(program: SolanaWorldIdProgram, root: Buffer): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("Root"), root, Buffer.from(VERIFICATION_TYPE)],
        program.programId,
    )[0];
}

export function getWorldIdLatestRootAddress(program: SolanaWorldIdProgram): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("LatestRoot"), Buffer.from(VERIFICATION_TYPE)],
        program.programId,
    )[0];
}

export function getWorldIdConfigAddress(program: SolanaWorldIdProgram): PublicKey {
    return PublicKey.findProgramAddressSync([Buffer.from("Config")], program.programId)[0];
}

export function getStakedMintAddress(program: ComptokenProgram): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.stakedMintSeed], program.programId)[0];
}

export function getUnstakedMintAddress(program: ComptokenProgram): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.unstakedMintSeed], program.programId)[0];
}

/**
 * the only valid address for a user's staked token account is the associated token account.
 */
export function getUserStakedTokensAddress(program: ComptokenProgram, user: PublicKey): PublicKey {
    return getAssociatedTokenAddressSync(getStakedMintAddress(program), user);
}

/**
 * any valid address for a user's unstaked token account is allowed, but this helper gets the associated token account.
 */
export function getUserUnstakedAssociatedTokenAddress(program: ComptokenProgram, user: PublicKey): PublicKey {
    return getAssociatedTokenAddressSync(getUnstakedMintAddress(program), user);
}

export async function createUserStakedTokenAccount(
    program: ComptokenProgram,
    user: PublicKey,
    payer: Signer,
): Promise<PublicKey> {
    // importing locally to avoid the long import time of spl-token for users who don't need it
    const { createAssociatedTokenAccountIdempotent, TOKEN_2022_PROGRAM_ID } = await import("@solana/spl-token");
    return createAssociatedTokenAccountIdempotent(
        program.provider.connection,
        payer,
        getStakedMintAddress(program),
        user,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );
}

export async function createUserUnstakedTokenAccount(
    program: ComptokenProgram,
    user: PublicKey,
    payer: Signer,
): Promise<PublicKey> {
    // importing locally to avoid the long import time of spl-token for users who don't need it
    const { createAssociatedTokenAccountIdempotent, TOKEN_2022_PROGRAM_ID } = await import("@solana/spl-token");
    return createAssociatedTokenAccountIdempotent(
        program.provider.connection,
        payer,
        getUnstakedMintAddress(program),
        user,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );
}
