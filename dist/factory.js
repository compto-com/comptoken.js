import fs from "fs";
import { ProgramWithConstants } from "./programWithConstants.js";
export function createComptokenProgram(idlPath, provider) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return new ProgramWithConstants(idl, provider);
}
export function createSolanaWorldIdProgram(idlPath, provider) {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    return new ProgramWithConstants(idl, provider);
}
//# sourceMappingURL=factory.js.map