var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ComptokenProof_TARGET_DIFFICULTY_DEVNET, _ComptokenProof_TARGET_DIFFICULTY_MAINNET, _ComptokenProof_makeTargetBytes;
import { createHash } from "crypto";
import { PublicKey } from "@solana/web3.js";
export class ComptokenProof {
    constructor({ pubkey, recentBlockHash, extraData, nonce, version, timestamp, target = _a.TARGET_BYTES, }) {
        this.pubkey = pubkey;
        this.recentBlockHash = recentBlockHash;
        this.extraData = extraData;
        this.nonce = nonce;
        this.version = version;
        this.timestamp = timestamp;
        this.target = target;
        this.header = this.constructHeader();
        this.hash = this.generateHash();
        if (!_a.isLowerThanTarget(this.hash, this.target)) {
            throw new Error(`The provided proof does not have enough zeroes: ${Buffer.from(this.hash).toString("hex")}`);
        }
    }
    /**
     * @deprecated for testing only
     * @param {Object} params
     * @param {PublicKey}  params.pubkey
     * @param {Uint8Array} params.recentBlockHash
     * @param {Uint8Array} params.extraData
     * @param {number}     params.version
     * @param {number}     params.timestamp
     * @returns {ComptokenProof}
     */
    static mine({ pubkey, recentBlockHash, extraData, version, timestamp, }) {
        recentBlockHash = Uint8Array.from(Buffer.from(recentBlockHash).swap32());
        for (let nonce = 0; nonce < 2 ** 32; nonce++) {
            try {
                // there is no reason to *ever* mine a real proof in JS
                return new _a({
                    pubkey,
                    recentBlockHash,
                    extraData,
                    nonce,
                    version,
                    timestamp,
                    target: _a.TARGET_BYTES_DEVNET,
                });
            }
            catch (e) {
                continue;
            }
        }
        throw new Error("Failed to mine a valid proof after 2^32 attempts");
    }
    static doubleSHA256(data) {
        const firstHash = createHash("sha256").update(Uint8Array.from(data)).digest();
        const secondHash = createHash("sha256").update(Uint8Array.from(firstHash)).digest();
        return Uint8Array.from(secondHash);
    }
    static isLowerThanTarget(hash, target = _a.TARGET_BYTES) {
        for (let [byte, target_byte] of zip(hash, target)) {
            if (byte < target_byte) {
                return true;
            }
            else if (byte > target_byte) {
                return false;
            }
        }
        return false; // they are equal, so it is not lower
    }
    constructHeader() {
        const version = Buffer.allocUnsafe(4);
        version.writeUInt32LE(this.version);
        const prevHashLE = Uint8Array.from(this.recentBlockHash).reverse();
        const merkleRoot = _a.doubleSHA256(Uint8Array.from(Buffer.concat([this.extraData, this.pubkey.toBytes()])));
        const timestamp = Buffer.allocUnsafe(4);
        timestamp.writeUInt32LE(this.timestamp);
        const nbits = Buffer.from([0xd8, 0xad, 0x0e, 0x18]);
        const nonce = Buffer.allocUnsafe(4);
        nonce.writeUInt32LE(this.nonce);
        return Uint8Array.from(Buffer.concat([
            Uint8Array.from(version), // Version (4 bytes)
            Uint8Array.from(prevHashLE), // Previous Block Hash (32 bytes)
            Uint8Array.from(merkleRoot), // Merkle Root Hash (32 bytes)
            Uint8Array.from(timestamp), // Timestamp (4 bytes)
            Uint8Array.from(nbits), // Difficulty Target (4 bytes)
            Uint8Array.from(nonce), // Nonce (4 bytes)
        ]));
    }
    generateHash() {
        let hashed = _a.doubleSHA256(this.header);
        return Uint8Array.from(hashed).reverse();
    }
    serializeData() {
        let buffer = Buffer.concat([
            this.pubkey.toBytes(),
            this.extraData,
            numAsU32ToLEBytes(this.nonce),
            numAsU32ToLEBytes(this.version),
            numAsU32ToLEBytes(this.timestamp),
        ]);
        if (buffer.length != 76) {
            throw new Error(`Incorrect buffer length: ${buffer.length}`);
        }
        return buffer;
    }
}
_a = ComptokenProof, _ComptokenProof_makeTargetBytes = function _ComptokenProof_makeTargetBytes(difficulty) {
    let target_bytes = Array.from({ length: 32 }, () => 0);
    target_bytes[32 - (difficulty + 3)] = 0x0e;
    target_bytes[32 - (difficulty + 2)] = 0xad;
    target_bytes[32 - (difficulty + 1)] = 0xd8;
    return target_bytes;
};
// larger difficulty means fewer leading zeroes, so the target is easier
_ComptokenProof_TARGET_DIFFICULTY_DEVNET = { value: 29 };
_ComptokenProof_TARGET_DIFFICULTY_MAINNET = { value: 24 };
ComptokenProof.TARGET_BYTES = __classPrivateFieldGet(_a, _a, "m", _ComptokenProof_makeTargetBytes).call(_a, __classPrivateFieldGet(_a, _a, "f", _ComptokenProof_TARGET_DIFFICULTY_MAINNET));
ComptokenProof.TARGET_BYTES_DEVNET = __classPrivateFieldGet(_a, _a, "m", _ComptokenProof_makeTargetBytes).call(_a, __classPrivateFieldGet(_a, _a, "f", _ComptokenProof_TARGET_DIFFICULTY_DEVNET));
function numAsU32ToLEBytes(num) {
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(num);
    return Uint8Array.from(buf);
}
function* zip(...iterables) {
    let iterators = iterables.map((it) => it[Symbol.iterator]());
    while (true) {
        let result = [];
        for (let it of iterators) {
            let next = it.next();
            if (next.done) {
                return;
            }
            result.push(next.value);
        }
        yield result;
    }
}
//# sourceMappingURL=comptokenProof.js.map