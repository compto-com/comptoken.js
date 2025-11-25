import assert from "assert";
import { SYSVAR_SLOT_HASHES_PUBKEY } from "@solana/web3.js";
export function getReturnLog(logs) {
    const prefix = "Program return: ";
    let retLog = logs.find((msg) => msg.startsWith(prefix))?.slice(prefix.length);
    if (!retLog) {
        throw new Error("No program return log found");
    }
    const [key, data] = retLog.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return { key, data, buffer };
}
export async function getValidBlockhashesRPC({ program }) {
    return await program.methods
        .getValidBlockhashes()
        .accounts({
        slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
    })
        .rpc();
}
export function decodeValidBlockhashesReturn(program, buffer) {
    const decoded = program.coder.types.decode("comptoken::instructions::getValidBlockhashes::validBlockhashes", buffer);
    return {
        announced: decoded.announced[0],
        valid: decoded.valid[0],
    };
}
const SEC_PER_DAY = 86400;
export function normalizeTimestamp(timestamp) {
    return timestamp - (timestamp % SEC_PER_DAY);
}
export function* ringBufferGetLastN(ring, capacity, n) {
    assert(n <= capacity, "n must be less than or equal to capacity");
    const start = (ring.position - n + capacity) % capacity;
    for (let i = 0; i < n; i++) {
        yield ring.buffer[(start + i) % capacity];
    }
}
//# sourceMappingURL=utils.js.map