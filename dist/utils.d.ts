import BN from "bn.js";
import type { TransactionSignature } from "@solana/web3.js";
import type { ComptokenProgram } from "./types.js";
export declare function getReturnLog(logs: string[]): {
    key: string;
    data: string;
    buffer: Buffer;
};
export declare function getValidBlockhashesReturn({ program, sig, }: {
    program: ComptokenProgram;
    sig: TransactionSignature;
}): Promise<{
    announced: Buffer;
    valid: Buffer;
}>;
export declare function normalizeToBN(input: number | BN | BigInt): BN;
export declare function decodeValidBlockhashesReturn(program: ComptokenProgram, buffer: Buffer): {
    announced: Buffer;
    valid: Buffer;
};
export declare function normalizeTimestamp(timestamp: number): number;
export declare function daysSinceEpoch(timestamp: number): number;
export declare function ringBufferGetLastN<T>(ring: {
    buffer: T[];
    position: number;
}, capacity: number, n: number): Iterable<T>;
//# sourceMappingURL=utils.d.ts.map