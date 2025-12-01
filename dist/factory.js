import fs from "fs";
import path from "path";
import { ProgramWithConstants } from "./programWithConstants.js";
export function getComptokenIdl(idlPath) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}
export function getSolanaWorldIdIdl(idlPath) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return idl;
}
export function getDefaultComptokenIdl() {
    const idl = JSON.parse(fs.readFileSync(path.resolve("../idls/comptoken.json"), "utf8"));
    return idl;
}
export function getDefaultSolanaWorldIdIdl() {
    const idl = JSON.parse(fs.readFileSync(path.resolve("../idls/solana_world_id.json"), "utf8"));
    return idl;
}
export function createComptokenProgram(comptokenIdl, provider) {
    return new ProgramWithConstants(comptokenIdl, provider);
}
export function createSolanaWorldIdProgram(solanaWorldIdIdl, provider) {
    return new ProgramWithConstants(solanaWorldIdIdl, provider);
}
//# sourceMappingURL=factory.js.map