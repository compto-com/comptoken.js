import type { Provider } from "@coral-xyz/anchor";
import { ProgramWithConstants } from "./programWithConstants.js";
import type { ComptokenIdl, SolanaWorldIdIDL } from "./types.js";
export declare function createComptokenProgram(idlPath: string, provider: Provider): ProgramWithConstants<ComptokenIdl>;
export declare function createSolanaWorldIdProgram(idlPath: string, provider: Provider): ProgramWithConstants<SolanaWorldIdIDL>;
//# sourceMappingURL=factory.d.ts.map