import { createHash } from "crypto";

import { PublicKey } from "@solana/web3.js";

export class ComptokenProof {
    pubkey: PublicKey; // PublicKey
    recentBlockHash: Uint8Array; // [u8; 32]
    extraData: Uint8Array; // [u8; 32]
    nonce: number; // u32
    version: number; // u32
    timestamp: number; // u32

    target: number[]; // [u8; 32]

    header: Uint8Array; // [u8; 80]
    hash: Uint8Array; // [u8; 32]

    // larger difficulty means fewer leading zeroes, so the target is easier
    static readonly #TARGET_DIFFICULTY_DEVNET = 29;
    static readonly #TARGET_DIFFICULTY_MAINNET = 24;

    static readonly TARGET_BYTES = ComptokenProof.#makeTargetBytes(ComptokenProof.#TARGET_DIFFICULTY_MAINNET);
    static readonly TARGET_BYTES_DEVNET = ComptokenProof.#makeTargetBytes(ComptokenProof.#TARGET_DIFFICULTY_DEVNET);

    static #makeTargetBytes(difficulty: number): number[] {
        let target_bytes = Array.from({ length: 32 }, () => 0);
        target_bytes[32 - (difficulty + 3)] = 0x0e;
        target_bytes[32 - (difficulty + 2)] = 0xad;
        target_bytes[32 - (difficulty + 1)] = 0xd8;
        return target_bytes;
    }

    constructor({
        pubkey,
        recentBlockHash,
        extraData,
        nonce,
        version,
        timestamp,
        target = ComptokenProof.TARGET_BYTES,
    }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        nonce: number;
        version: number;
        timestamp: number;
        target?: number[];
    }) {
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
    static mine({
        pubkey,
        recentBlockHash,
        extraData,
        version,
        timestamp,
        startNonce = 0,
    }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        version: number;
        timestamp: number;
        startNonce?: number;
    }): ComptokenProof {
        for (let nonce = startNonce; nonce < 2 ** 32; nonce++) {
            // there is no reason to *ever* mine a real proof in JS
            const proof = new ComptokenProof({
                pubkey,
                recentBlockHash,
                extraData,
                nonce,
                version,
                timestamp,
                target: ComptokenProof.TARGET_BYTES_DEVNET,
            });
            if (ComptokenProof.isLowerThanTarget(proof.hash, proof.target)) {
                return proof;
            }
        }
        throw new Error(`Failed to mine a valid proof under 2^32 starting from nonce ${startNonce}`);
    }

    static doubleSHA256(data: Uint8Array): Uint8Array {
        const firstHash = createHash("sha256").update(Uint8Array.from(data)).digest();
        const secondHash = createHash("sha256").update(Uint8Array.from(firstHash)).digest();
        return Uint8Array.from(secondHash);
    }

    static isLowerThanTarget(hash: Uint8Array, target: number[] = ComptokenProof.TARGET_BYTES): boolean {
        for (let [byte, target_byte] of zip(hash, target)) {
            if (byte < target_byte) {
                return true;
            } else if (byte > target_byte) {
                return false;
            }
        }
        return false; // they are equal, so it is not lower
    }

    constructHeader() {
        const version = Buffer.allocUnsafe(4);
        version.writeUInt32LE(this.version);

        const prevHashLE = Buffer.from(this.recentBlockHash).reverse();

        const merkleRoot = ComptokenProof.doubleSHA256(
            Uint8Array.from(Buffer.concat([this.extraData, this.pubkey.toBytes()])),
        );

        const timestamp = Buffer.allocUnsafe(4);
        timestamp.writeUInt32LE(this.timestamp);

        const n = 0x180eadd8;
        const nbits = Buffer.allocUnsafe(4);
        nbits.writeUInt32LE(n);

        const nonce = Buffer.allocUnsafe(4);
        nonce.writeUInt32LE(this.nonce);

        const header = Uint8Array.from(
            Buffer.concat([
                version, // Version (4 bytes)
                prevHashLE, // Previous Block Hash (32 bytes)
                merkleRoot, // Merkle Root Hash (32 bytes)
                timestamp, // Timestamp (4 bytes)
                nbits, // Difficulty Target (4 bytes)
                nonce, // Nonce (4 bytes)
            ]),
        );
        return header;
    }

    generateHash() {
        let hashed = ComptokenProof.doubleSHA256(this.header);
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

function numAsU32ToLEBytes(num: number): Uint8Array {
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(num);
    return Uint8Array.from(buf);
}

function* zip<T>(...iterables: Iterable<T>[]): Generator<T[]> {
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
