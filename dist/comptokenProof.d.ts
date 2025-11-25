import { PublicKey } from "@solana/web3.js";
export declare class ComptokenProof {
    #private;
    pubkey: PublicKey;
    recentBlockHash: Uint8Array;
    extraData: Uint8Array;
    nonce: number;
    version: number;
    timestamp: number;
    target: number[];
    header: Uint8Array;
    hash: Uint8Array;
    static readonly TARGET_BYTES: number[];
    static readonly TARGET_BYTES_DEVNET: number[];
    constructor({ pubkey, recentBlockHash, extraData, nonce, version, timestamp, target, }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        nonce: number;
        version: number;
        timestamp: number;
        target?: number[];
    });
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
    static mine({ pubkey, recentBlockHash, extraData, version, timestamp, }: {
        pubkey: PublicKey;
        recentBlockHash: Uint8Array;
        extraData: Uint8Array;
        version: number;
        timestamp: number;
    }): ComptokenProof;
    static doubleSHA256(data: Uint8Array): Uint8Array;
    static isLowerThanTarget(hash: Uint8Array, target?: number[]): boolean;
    constructHeader(): Uint8Array<ArrayBuffer>;
    generateHash(): Uint8Array<ArrayBuffer>;
    serializeData(): Buffer;
}
//# sourceMappingURL=comptokenProof.d.ts.map