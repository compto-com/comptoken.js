import type { BetterBorshCoder } from "./coder.js";
import type { Comptoken as ComptokenIdl } from "./idls/comptoken.js";
import type { SolanaWorldIdProgram as SolanaWorldIdIdl } from "./idls/solana_world_id_program.js";
import type { ProgramWithConstants } from "./programWithConstants.js";

export type { ComptokenIdl, SolanaWorldIdIdl };

type ComptokenCoder = BetterBorshCoder<ComptokenIdl>;
type SolanaWorldIdCoder = BetterBorshCoder<SolanaWorldIdIdl>;

export type ComptokenProgram = Omit<ProgramWithConstants<ComptokenIdl>, "coder"> & { coder: ComptokenCoder };
export type SolanaWorldIdProgram = Omit<ProgramWithConstants<SolanaWorldIdIdl>, "coder"> & {
    coder: SolanaWorldIdCoder;
};
