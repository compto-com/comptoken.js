import type { Idl as anchorIdl } from "@anchor-lang/core";

import type { BetterBorshCoder } from "./coder.js";
import type { Comptoken as BundledComptokenIdl } from "./idls/comptoken.js";
import type { SolanaWorldIdProgram as BundledSolanaWorldIdIdl } from "./idls/solana_world_id_program.js";
import type { ProgramWithConstants } from "./programWithConstants.js";

/**
 * Augment this interface to replace the bundled IDL types with your own (e.g. a freshly built `target/types`).
 * All helpers typed with `ComptokenIdl`/`ComptokenProgram` (and the solana world id equivalents) will use them.
 *
 * ```ts
 * import type { Comptoken } from "../target/types/comptoken";
 *
 * declare module "@compto/comptoken.js" {
 *     interface Register {
 *         comptokenIdl: Comptoken;
 *     }
 * }
 * ```
 */
export interface Register {}

export type ComptokenIdl = Register extends { comptokenIdl: infer I extends anchorIdl } ? I : BundledComptokenIdl;
export type SolanaWorldIdIdl = Register extends { solanaWorldIdIdl: infer I extends anchorIdl }
    ? I
    : BundledSolanaWorldIdIdl;

export type BetterProgram<Idl extends anchorIdl> = Omit<ProgramWithConstants<Idl>, "coder"> & {
    coder: BetterBorshCoder<Idl>;
};

export type ComptokenProgram = BetterProgram<ComptokenIdl>;
export type SolanaWorldIdProgram = BetterProgram<SolanaWorldIdIdl>;
