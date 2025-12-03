import { type Provider } from "@coral-xyz/anchor";
import type { ComptokenIdl, ComptokenProgram, SolanaWorldIdIdl, SolanaWorldIdProgram } from "./types.js";
export declare function getComptokenIdl(idlPath: string): ComptokenIdl;
export declare function getSolanaWorldIdIdl(idlPath: string): SolanaWorldIdIdl;
export declare function getDefaultComptokenIdl(): ComptokenIdl;
export declare function getDefaultSolanaWorldIdIdl(): SolanaWorldIdIdl;
export declare function createComptokenProgram(comptokenIdl: ComptokenIdl, provider: Provider): ComptokenProgram;
export declare function createSolanaWorldIdProgram(solanaWorldIdIdl: SolanaWorldIdIdl, provider: Provider): SolanaWorldIdProgram;
export declare function createDummyProvider(): Provider;
//# sourceMappingURL=factory.d.ts.map