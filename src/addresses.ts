import { PublicKey, type Signer } from "@solana/web3.js";

import { getComptokenConstants } from "./factory.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";

const VERIFICATION_TYPE = getComptokenConstants().verificationType;

// importing spl-token takes ~10s (for some reason), so this is just a trimmed down version of an export from spl-token
function getAssociatedTokenAddressSync(mint: PublicKey, owner: PublicKey): PublicKey {
    const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
    const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

    const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
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

export function getComptokenLiquidityTokenAccountAddress(program: ComptokenProgram): PublicKey {
    return PublicKey.findProgramAddressSync(
        [program.constants.comptokenLiquidityTokenAccountSeed],
        program.programId,
    )[0];
}

export function getUsdcLiquidityTokenAccountAddress(program: ComptokenProgram): PublicKey {
    return PublicKey.findProgramAddressSync([program.constants.usdcLiquidityTokenAccountSeed], program.programId)[0];
}

export function getRaydiumCpSwapProgramId(program: ComptokenProgram): PublicKey {
    const address = program.rawIdl.instructions
        .find((ix) => ix.name === "add_liquidity")
        ?.accounts.find((account) => account.name === "raydium_cp_swap_program" && "address" in account);
    if (address === undefined || !("address" in address) || address.address === undefined) {
        throw new Error("raydium_cp_swap_program address not found in comptoken IDL");
    }
    return new PublicKey(address.address);
}

/**
 * derives the Raydium CP-swap accounts for the comptoken/usdc pool that `add_liquidity` needs.
 */
export function getCompUsdcPoolAddresses(program: ComptokenProgram) {
    const raydiumProgramId = getRaydiumCpSwapProgramId(program);
    const poolState = program.constants.compUsdcPoolAddress;

    const ammConfigIndex = Buffer.alloc(2);
    ammConfigIndex.writeUInt16BE(program.constants.raydiumAmmConfigIndex);

    const pda = (seeds: Buffer[]) => PublicKey.findProgramAddressSync(seeds, raydiumProgramId)[0];
    const vault = (mint: PublicKey) => pda([Buffer.from("pool_vault"), poolState.toBuffer(), mint.toBuffer()]);

    return {
        poolState,
        ammConfig: pda([Buffer.from("amm_config"), ammConfigIndex]),
        lpMint: pda([Buffer.from("pool_lp_mint"), poolState.toBuffer()]),
        poolComptokenVault: vault(getUnstakedMintAddress(program)),
        poolUsdcVault: vault(program.constants.usdcMintAddress),
        observationState: pda([Buffer.from("observation"), poolState.toBuffer()]),
    };
}

export type CompUsdcPoolAddresses = ReturnType<typeof getCompUsdcPoolAddresses>;
