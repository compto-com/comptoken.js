var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ComptokenProof_TARGET_DIFFICULTY_DEVNET, _ComptokenProof_TARGET_DIFFICULTY_MAINNET, _ComptokenProof_makeTargetBytes;
import { createHash } from "crypto";
import { PublicKey } from "@solana/web3.js";
import { getComptokenConstants } from "./factory.js";
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
    }
    /**
     * @deprecated for testing only
     * @param {Object} params
     * @param {PublicKey}  params.pubkey
     * @param {Uint8Array} params.recentBlockHash
     * @param {Uint8Array} params.extraData
     * @param {number}     params.version
     * @param {number}     params.timestamp
     * @param {number}     [params.startNonce=0]
     * @returns {ComptokenProof}
     */
    static mine({ pubkey, recentBlockHash, extraData, version, timestamp, startNonce = 0, }) {
        for (let nonce = startNonce; nonce < 2 ** 32; nonce++) {
            // there is no reason to *ever* mine a real proof in JS
            const proof = new _a({
                pubkey,
                recentBlockHash,
                extraData,
                nonce,
                version,
                timestamp,
                target: _a.TARGET_BYTES_DEVNET,
            });
            if (_a.isLowerThanTarget(proof.hash, proof.target)) {
                return proof;
            }
        }
        throw new Error(`Failed to mine a valid proof under 2^32 starting from nonce ${startNonce}`);
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
        const prevHashLE = Buffer.from(this.recentBlockHash).reverse();
        const merkleRoot = _a.doubleSHA256(Uint8Array.from(Buffer.concat([this.extraData, this.pubkey.toBytes()])));
        const timestamp = Buffer.allocUnsafe(4);
        timestamp.writeUInt32LE(this.timestamp);
        const n = 0x180eadd8;
        const nbits = Buffer.allocUnsafe(4);
        nbits.writeUInt32LE(n);
        const nonce = Buffer.allocUnsafe(4);
        nonce.writeUInt32LE(this.nonce);
        const header = Uint8Array.from(Buffer.concat([
            version, // Version (4 bytes)
            prevHashLE, // Previous Block Hash (32 bytes)
            merkleRoot, // Merkle Root Hash (32 bytes)
            timestamp, // Timestamp (4 bytes)
            nbits, // Difficulty Target (4 bytes)
            nonce, // Nonce (4 bytes)
        ]));
        return header;
    }
    generateHash() {
        let hashed = _a.doubleSHA256(this.header);
        return hashed.reverse();
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
_a = ComptokenProof, _ComptokenProof_makeTargetBytes = function _ComptokenProof_makeTargetBytes(nbits) {
    const difficulty = (nbits >> 24) & 0xff;
    let target_bytes = Array.from({ length: 32 }, () => 0);
    target_bytes[32 - (difficulty + 3)] = (nbits >> 16) & 0xff;
    target_bytes[32 - (difficulty + 2)] = (nbits >> 8) & 0xff;
    target_bytes[32 - (difficulty + 1)] = nbits & 0xff;
    return target_bytes;
};
// larger difficulty means fewer leading zeroes, so the target is easier
_ComptokenProof_TARGET_DIFFICULTY_DEVNET = { value: getComptokenConstants().proofDifficultyNbitsDevnet };
_ComptokenProof_TARGET_DIFFICULTY_MAINNET = { value: getComptokenConstants().proofDifficultyNbits };
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