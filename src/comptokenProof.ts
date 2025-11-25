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

        if (!ComptokenProof.isLowerThanTarget(this.hash, this.target)) {
            throw new Error("The provided proof does not have enough zeroes");
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
    static mine({
        pubkey,
        recentBlockHash,
        extraData,
        version,
        timestamp,
    }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        version: number;
        timestamp: number;
    }): ComptokenProof {
        recentBlockHash = Uint8Array.from(Buffer.from(recentBlockHash).swap32());
        for (let nonce = 0; nonce < 2 ** 32; nonce++) {
            try {
                // there is no reason to *ever* mine a real proof in JS
                return new ComptokenProof({
                    pubkey,
                    recentBlockHash,
                    extraData,
                    nonce,
                    version,
                    timestamp,
                    target: ComptokenProof.TARGET_BYTES_DEVNET,
                });
            } catch (e) {
                continue;
            }
        }
        throw new Error("Failed to mine a valid proof after 2^32 attempts");
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

        const prevHashLE = reverseAndSwapEndianness(this.recentBlockHash);

        const merkleRoot = ComptokenProof.doubleSHA256(
            Uint8Array.from(Buffer.concat([this.extraData, this.pubkey.toBytes()])),
        );

        const timestamp = Buffer.allocUnsafe(4);
        timestamp.writeUInt32LE(this.timestamp);

        const nbits = Buffer.from([0xd8, 0xad, 0x0e, 0x18]);

        const nonce = Buffer.allocUnsafe(4);
        nonce.writeUInt32LE(this.nonce);

        return Uint8Array.from(
            Buffer.concat([
                Uint8Array.from(version), // Version (4 bytes)
                Uint8Array.from(prevHashLE), // Previous Block Hash (32 bytes)
                Uint8Array.from(merkleRoot), // Merkle Root Hash (32 bytes)
                Uint8Array.from(timestamp), // Timestamp (4 bytes)
                Uint8Array.from(nbits), // Difficulty Target (4 bytes)
                Uint8Array.from(nonce), // Nonce (4 bytes)
            ]),
        );
    }

    generateHash() {
        let hashed = ComptokenProof.doubleSHA256(this.header);
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

function numAsU32ToLEBytes(num: number): Uint8Array {
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(num);
    return Uint8Array.from(buf);
}

function reverseAndSwapEndianness(data: Uint8Array): Uint8Array {
    const reversedBuffer = Buffer.from(data).reverse();
    return Uint8Array.from(reversedBuffer.swap32());
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
