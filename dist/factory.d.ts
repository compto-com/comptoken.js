import type { Provider } from "@coral-xyz/anchor";
import { ProgramWithConstants } from "./programWithConstants.js";
import type { ComptokenIdl, SolanaWorldIdIDL } from "./types.js";
export declare function getComptokenIdl(idlPath: string): ComptokenIdl;
export declare function getSolanaWorldIdIdl(idlPath: string): SolanaWorldIdIDL;
export declare function getDefaultComptokenIdl(): ComptokenIdl;
export declare function getDefaultSolanaWorldIdIdl(): SolanaWorldIdIDL;
export declare function createComptokenProgram(comptokenIdl: ComptokenIdl, provider: Provider): ProgramWithConstants<ComptokenIdl>;
export declare function createSolanaWorldIdProgram(solanaWorldIdIdl: SolanaWorldIdIDL, provider: Provider): ProgramWithConstants<SolanaWorldIdIDL>;
//# sourceMappingURL=factory.d.ts.map