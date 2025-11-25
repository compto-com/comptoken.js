import type { Comptoken as ComptokenIdl } from "./idls/comptoken.js";
import type { SolanaWorldIdProgram as SolanaWorldIdIdl } from "./idls/solana_world_id_program.js";
import type { ProgramWithConstants } from "./programWithConstants.js";
export type { ComptokenIdl, SolanaWorldIdIdl as SolanaWorldIdIDL };
export type ComptokenProgram = ProgramWithConstants<ComptokenIdl>;
export type SolanaWorldIdProgram = ProgramWithConstants<SolanaWorldIdIdl>;
//# sourceMappingURL=types.d.ts.map