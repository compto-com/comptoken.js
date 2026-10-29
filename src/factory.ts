import fs from "fs";

import { AnchorProvider, Wallet, web3, type Idl as anchorIdl, type Provider } from "@coral-xyz/anchor";

import comptokenIdlJson from "../idls/comptoken.json" with { type: "json" };
import solanaWorldIdIdlJson from "../idls/solana_world_id_program.json" with { type: "json" };
import { getConstants, ProgramWithConstants } from "./programWithConstants.js";
import type { BetterProgram, ComptokenIdl, ComptokenProgram, SolanaWorldIdIdl, SolanaWorldIdProgram } from "./types.js";

function _getIdl<IDL>(idlPath: string): IDL {
    const idl: IDL = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}

export function getComptokenIdl(idlPath: string): ComptokenIdl {
    return _getIdl(idlPath);
}

export function getSolanaWorldIdIdl(idlPath: string): SolanaWorldIdIdl {
    return _getIdl(idlPath);
}

export function getDefaultComptokenIdl(): ComptokenIdl {
    // this technically allows for mutation of the default IDL, but I don't see a reason to mutate it, and this is simpler and faster
    return comptokenIdlJson as ComptokenIdl;
}

export function getDefaultSolanaWorldIdIdl(): SolanaWorldIdIdl {
    // this technically allows for mutation of the default IDL, but I don't see a reason to mutate it, and this is simpler and faster
    return solanaWorldIdIdlJson as SolanaWorldIdIdl;
}

function _createBetterProgram<Idl extends anchorIdl>(idl: Idl, provider: Provider): BetterProgram<Idl> {
    // the unknown cast is needed b/c of an issue with instruction coder types not matching up
    // even though ComptokenProgram should be a subtype of ProgramWithConstants<ComptokenIdl>
    // (it has stricter typing for coder.accounts/types), I don't see a reason to manually invoke
    // the instruction coder, and the underlying type is unchanged, so this is safe
    return new ProgramWithConstants<Idl>(idl, provider) as unknown as BetterProgram<Idl>;
}

export function createComptokenProgram(comptokenIdl: ComptokenIdl, provider: Provider): ComptokenProgram {
    return _createBetterProgram(comptokenIdl, provider);
}

export function createSolanaWorldIdProgram(
    solanaWorldIdIdl: SolanaWorldIdIdl,
    provider: Provider,
): SolanaWorldIdProgram {
    return _createBetterProgram(solanaWorldIdIdl, provider);
}

export function createDummyProvider(): Provider {
    // dummy provider shouldn't be used to send txs, but if a mistake happens, devnet is safer than mainnet
    // I don't know if a random address would allow creating a Provider
    const { Connection, Keypair, clusterApiUrl } = web3;
    const connection = new Connection(clusterApiUrl("devnet"));
    const dummyWallet = new Wallet(Keypair.generate());
    return new AnchorProvider(connection, dummyWallet);
}

// defaults to the bundled IDL, pass an IDL to avoid using stale constants
export function getComptokenConstants(idl: ComptokenIdl = getDefaultComptokenIdl()) {
    return getConstants(idl);
}
