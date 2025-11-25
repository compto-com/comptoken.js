import type { ComptokenProgram } from "./types.js";
export declare function getReturnLog(logs: string[]): {
    key: string;
    data: string;
    buffer: Buffer;
};
export declare function getValidBlockhashesRPC({ program }: {
    program: ComptokenProgram;
}): Promise<string>;
export declare function decodeValidBlockhashesReturn(program: ComptokenProgram, buffer: Buffer): {
    announced: number[];
    valid: number[];
};
export declare function normalizeTimestamp(timestamp: number): number;
export declare function daysSinceEpoch(timestamp: number): number;
export declare function ringBufferGetLastN<T>(ring: {
    buffer: T[];
    position: number;
}, capacity: number, n: number): Iterable<T>;
//# sourceMappingURL=utils.d.ts.map