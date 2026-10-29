import type { Idl as anchorIdl } from "@coral-xyz/anchor";

import type { BetterBorshCoder } from "./coder.js";
import type { Comptoken as ComptokenIdl } from "./idls/comptoken.js";
import type { SolanaWorldIdProgram as SolanaWorldIdIdl } from "./idls/solana_world_id_program.js";
import type { ProgramWithConstants } from "./programWithConstants.js";

export type { ComptokenIdl, SolanaWorldIdIdl };

export type BetterProgram<Idl extends anchorIdl> = Omit<ProgramWithConstants<Idl>, "coder"> & {
    coder: BetterBorshCoder<Idl>;
};

export type ComptokenProgram = BetterProgram<ComptokenIdl>;
export type SolanaWorldIdProgram = BetterProgram<SolanaWorldIdIdl>;
