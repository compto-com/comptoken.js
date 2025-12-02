import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { Provider } from "@coral-xyz/anchor";

import { ProgramWithConstants } from "./programWithConstants.js";
import type { ComptokenIdl, SolanaWorldIdIDL } from "./types.js";

const dirPath = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirPath, "..");

export function getComptokenIdl(idlPath: string): ComptokenIdl {
    const idl: ComptokenIdl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}

export function getSolanaWorldIdIdl(idlPath: string): SolanaWorldIdIDL {
    const idl: SolanaWorldIdIDL = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}

export function getDefaultComptokenIdl(): ComptokenIdl {
    const idl: ComptokenIdl = JSON.parse(fs.readFileSync(path.resolve(`${projectRoot}/idls/comptoken.json`), "utf8"));
    return idl;
}

export function getDefaultSolanaWorldIdIdl(): SolanaWorldIdIDL {
    const idl: SolanaWorldIdIDL = JSON.parse(
        fs.readFileSync(path.resolve(`${projectRoot}/idls/solana_world_id_program.json`), "utf8"),
    );
    return idl;
}

export function createComptokenProgram(
    comptokenIdl: ComptokenIdl,
    provider: Provider,
): ProgramWithConstants<ComptokenIdl> {
    return new ProgramWithConstants<ComptokenIdl>(comptokenIdl, provider);
}

export function createSolanaWorldIdProgram(
    solanaWorldIdIdl: SolanaWorldIdIDL,
    provider: Provider,
): ProgramWithConstants<SolanaWorldIdIDL> {
    return new ProgramWithConstants<SolanaWorldIdIDL>(solanaWorldIdIdl, provider);
}
