import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { AnchorProvider, Wallet, web3, type Provider } from "@coral-xyz/anchor";

import { getConstants, ProgramWithConstants } from "./programWithConstants.js";
import type { ComptokenIdl, ComptokenProgram, SolanaWorldIdIdl, SolanaWorldIdProgram } from "./types.js";

const dirPath = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirPath, "..");

export function getComptokenIdl(idlPath: string): ComptokenIdl {
    const idl: ComptokenIdl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}

export function getSolanaWorldIdIdl(idlPath: string): SolanaWorldIdIdl {
    const idl: SolanaWorldIdIdl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}

export function getDefaultComptokenIdl(): ComptokenIdl {
    const idl: ComptokenIdl = JSON.parse(fs.readFileSync(path.resolve(`${projectRoot}/idls/comptoken.json`), "utf8"));
    return idl;
}

export function getDefaultSolanaWorldIdIdl(): SolanaWorldIdIdl {
    const idl: SolanaWorldIdIdl = JSON.parse(
        fs.readFileSync(path.resolve(`${projectRoot}/idls/solana_world_id_program.json`), "utf8"),
    );
    return idl;
}

export function createComptokenProgram(comptokenIdl: ComptokenIdl, provider: Provider): ComptokenProgram {
    // the unknown cast is needed b/c of an issue with instruction coder types not matching up
    // even though ComptokenProgram should be a subtype of ProgramWithConstants<ComptokenIdl>
    // (it has stricter typing for coder.accounts/types), I don't see a reason to manually invoke
    // the instruction coder, and the underlying type is unchanged, so this is safe
    return new ProgramWithConstants<ComptokenIdl>(comptokenIdl, provider) as unknown as ComptokenProgram;
}

export function createSolanaWorldIdProgram(
    solanaWorldIdIdl: SolanaWorldIdIdl,
    provider: Provider,
): SolanaWorldIdProgram {
    // see comment in createComptokenProgram for explanation of unknown cast
    return new ProgramWithConstants<SolanaWorldIdIdl>(solanaWorldIdIdl, provider) as unknown as SolanaWorldIdProgram;
}

export function createDummyProvider(): Provider {
    // dummy provider shouldn't be used to send txs, but if a mistake happens, devnet is safer than mainnet
    // I don't know if a random address would allow creating a Provider
    const { Connection, Keypair, clusterApiUrl } = web3;
    const connection = new Connection(clusterApiUrl("devnet"));
    const dummyWallet = new Wallet(Keypair.generate());
    return new AnchorProvider(connection, dummyWallet);
}

export function getComptokenConstants() {
    return getConstants(getDefaultComptokenIdl());
}
