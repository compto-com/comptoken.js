import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AnchorProvider, Wallet, web3 } from "@coral-xyz/anchor";
import { ProgramWithConstants } from "./programWithConstants.js";
const dirPath = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirPath, "..");
export function getComptokenIdl(idlPath) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}
export function getSolanaWorldIdIdl(idlPath) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}
export function getDefaultComptokenIdl() {
    const idl = JSON.parse(fs.readFileSync(path.resolve(`${projectRoot}/idls/comptoken.json`), "utf8"));
    return idl;
}
export function getDefaultSolanaWorldIdIdl() {
    const idl = JSON.parse(fs.readFileSync(path.resolve(`${projectRoot}/idls/solana_world_id_program.json`), "utf8"));
    return idl;
}
export function createComptokenProgram(comptokenIdl, provider) {
    // the unknown cast is needed b/c of an issue with instruction coder types not matching up
    // even though ComptokenProgram should be a subtype of ProgramWithConstants<ComptokenIdl>
    // (it has stricter typing for coder.accounts/types), I don't see a reason to manually invoke
    // the instruction coder, and the underlying type is unchanged, so this is safe
    return new ProgramWithConstants(comptokenIdl, provider);
}
export function createSolanaWorldIdProgram(solanaWorldIdIdl, provider) {
    // see comment in createComptokenProgram for explanation of unknown cast
    return new ProgramWithConstants(solanaWorldIdIdl, provider);
}
export function createDummyProvider() {
    // dummy provider shouldn't be used to send txs, but if a mistake happens, devnet is safer than mainnet
    // I don't know if a random address would allow creating a Provider
    const { Connection, Keypair, clusterApiUrl } = web3;
    const connection = new Connection(clusterApiUrl("devnet"));
    const dummyWallet = new Wallet(Keypair.generate());
    return new AnchorProvider(connection, dummyWallet);
}
//# sourceMappingURL=factory.js.map