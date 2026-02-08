import {
    createAssociatedTokenAccountIdempotent,
    getAssociatedTokenAddressSync,
    TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, type Signer } from "@solana/web3.js";

import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";

const WorldVerificationType = 0;

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
        [Buffer.from("Root"), root, Buffer.from([WorldVerificationType])],
        program.programId,
    )[0];
}

export function getWorldIdLatestRootAddress(program: SolanaWorldIdProgram): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("LatestRoot"), Buffer.from([WorldVerificationType])],
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
    return getAssociatedTokenAddressSync(getStakedMintAddress(program), user, false, TOKEN_2022_PROGRAM_ID);
}

/**
 * any valid address for a user's unstaked token account is allowed, but this helper gets the associated token account.
 */
export function getUserUnstakedAssociatedTokenAddress(program: ComptokenProgram, user: PublicKey): PublicKey {
    return getAssociatedTokenAddressSync(getUnstakedMintAddress(program), user, false, TOKEN_2022_PROGRAM_ID);
}

export async function createUserStakedTokenAccount(
    program: ComptokenProgram,
    user: PublicKey,
    payer: Signer,
): Promise<PublicKey> {
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
    return createAssociatedTokenAccountIdempotent(
        program.provider.connection,
        payer,
        getUnstakedMintAddress(program),
        user,
        undefined,
        TOKEN_2022_PROGRAM_ID,
    );
}
