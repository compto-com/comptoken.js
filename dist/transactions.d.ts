import { PublicKey, type TransactionSignature } from "@solana/web3.js";
import { ComptokenProof } from "./comptokenProof.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
export declare function collect({ program, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function createUserDataAccount({ program, capacity, accounts: { userWallet, payer, }, }: {
    program: ComptokenProgram;
    capacity?: number;
    accounts: {
        userWallet: PublicKey;
        payer?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function dailyDistribution({ program, }: {
    program: ComptokenProgram;
}): Promise<TransactionSignature>;
export declare function getValidBlockhashes({ program, }: {
    program: ComptokenProgram;
}): Promise<{
    sig: string;
    result: {
        announced: number[];
        valid: number[];
    };
}>;
export declare function resizeUserDataAccount({ program, newCapacity, accounts: { userWallet, payer, }, }: {
    program: ComptokenProgram;
    newCapacity: number;
    accounts: {
        userWallet: PublicKey;
        payer?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function reverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
}): Promise<TransactionSignature>;
export declare function stake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function submitMiningProof({ program, proof, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    proof: ComptokenProof;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function unstake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function unverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, }, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        userWallet: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function unverify2({ program, nullifierHash, accounts: { userWallet, }, }: {
    program: ComptokenProgram;
    nullifierHash: Buffer;
    accounts: {
        userWallet: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function verify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, userUnstakedTokenAccount, payer, }, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
        payer?: PublicKey;
    };
}): Promise<TransactionSignature>;
export declare function getComptokenBalance({ program, user, userUnstakedTokenAccount, }: {
    program: ComptokenProgram;
    user: PublicKey;
    userUnstakedTokenAccount?: PublicKey;
}): Promise<number>;
//# sourceMappingURL=transactions.d.ts.map