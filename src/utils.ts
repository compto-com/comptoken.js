import assert from "assert";

import type { IdlTypes } from "@coral-xyz/anchor";
import BN from "bn.js";

import type { TransactionSignature } from "@solana/web3.js";
import type { ComptokenIdl, ComptokenProgram } from "./types.js";

export function getReturnLog(logs: string[]) {
    const prefix = "Program return: ";
    let retLog = logs.find((msg) => msg.startsWith(prefix))?.slice(prefix.length);
    if (!retLog) {
        throw new Error("No program return log found");
    }
    const [key, data] = retLog.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return { key, data, buffer };
}

export async function getValidBlockhashesReturn({
    program,
    sig,
}: {
    program: ComptokenProgram;
    sig: TransactionSignature;
}): Promise<{ announced: Buffer; valid: Buffer }> {
    const tx = await program.provider.connection.getTransaction(sig, {
        maxSupportedTransactionVersion: 0,
    });
    if (tx?.meta?.logMessages === undefined || tx?.meta?.logMessages === null) {
        throw new Error("Failed to get transaction logs for valid blockhashes");
    }
    const { buffer } = getReturnLog(tx.meta.logMessages);
    return decodeValidBlockhashesReturn(program, buffer);
}

export function normalizeToBN(input: number | BN | BigInt): BN {
    if (typeof input === "bigint") {
        return new BN(input.toString());
    } else if (typeof input === "number") {
        return new BN(input);
    }
    assert(input instanceof BN);
    return input;
}

export function decodeValidBlockhashesReturn(program: ComptokenProgram, buffer: Buffer) {
    const decoded = program.coder.types.decode(
        "comptoken::instructions::getValidBlockhashes::validBlockhashes",
        buffer,
    ) as IdlTypes<ComptokenIdl>["comptoken::instructions::get_valid_blockhashes::ValidBlockhashes"];
    return {
        announced: Buffer.from(decoded.announced[0]),
        valid: Buffer.from(decoded.valid[0]),
    };
}

const SEC_PER_DAY = 86400;
export function normalizeTimestamp(timestamp: number): number {
    return timestamp - (timestamp % SEC_PER_DAY);
}

export function daysSinceEpoch(timestamp: number): number {
    return Math.floor(timestamp / SEC_PER_DAY);
}

export function* ringBufferGetLastN<T>(
    ring: { buffer: T[]; position: number },
    capacity: number,
    n: number,
): Iterable<T> {
    assert(n <= capacity, "n must be less than or equal to capacity");

    const start = (ring.position - n + capacity) % capacity;
    for (let i = 0; i < n; i++) {
        yield ring.buffer[(start + i) % capacity];
    }
}
