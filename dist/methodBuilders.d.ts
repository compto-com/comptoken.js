import type { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods.js";
import { PublicKey, type Signer } from "@solana/web3.js";
import BN from "bn.js";
import { ComptokenProof } from "./comptokenProof.js";
import type { ComptokenIdl, ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
type CollectIdlIx = ComptokenIdl["instructions"][number] & {
    name: "collect";
};
type CollectBuilder = MethodsBuilder<ComptokenIdl, CollectIdlIx>;
export declare function collectBuilder({ program, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): CollectBuilder;
type CreateUserDataAccountIdlIx = ComptokenIdl["instructions"][number] & {
    name: "createUserDataAccount";
};
type CreateUserDataAccountBuilder = MethodsBuilder<ComptokenIdl, CreateUserDataAccountIdlIx>;
export declare function createUserDataAccountBuilder({ program, capacity, accounts: { userWallet, payer, }, }: {
    program: ComptokenProgram;
    capacity?: number;
    accounts: {
        userWallet: Signer;
        payer?: Signer;
    };
}): CreateUserDataAccountBuilder;
type DailyDistributionIdlIx = ComptokenIdl["instructions"][number] & {
    name: "dailyDistribution";
};
type DailyDistributionBuilder = MethodsBuilder<ComptokenIdl, DailyDistributionIdlIx>;
export declare function dailyDistributionBuilder({ program, }: {
    program: ComptokenProgram;
}): DailyDistributionBuilder;
type GetValidBlockhashesIdlIx = ComptokenIdl["instructions"][number] & {
    name: "getValidBlockhashes";
};
type GetValidBlockhashesBuilder = MethodsBuilder<ComptokenIdl, GetValidBlockhashesIdlIx>;
export declare function getValidBlockhashesBuilder({ program, }: {
    program: ComptokenProgram;
}): GetValidBlockhashesBuilder;
type ResizeUserDataAccountIdlIx = ComptokenIdl["instructions"][number] & {
    name: "resizeUserDataAccount";
};
type ResizeUserDataAccountBuilder = MethodsBuilder<ComptokenIdl, ResizeUserDataAccountIdlIx>;
export declare function resizeUserDataAccountBuilder({ program, newCapacity, accounts: { userWallet, payer, }, }: {
    program: ComptokenProgram;
    newCapacity: number | BN | BigInt;
    accounts: {
        userWallet: Signer;
        payer?: Signer;
    };
}): ResizeUserDataAccountBuilder;
type ReverifyIdlIx = ComptokenIdl["instructions"][number] & {
    name: "reverify";
};
type ReverifyBuilder = MethodsBuilder<ComptokenIdl, ReverifyIdlIx>;
export declare function reverifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, }, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        userWallet: Signer;
    };
}): ReverifyBuilder;
type StakeIdlIx = ComptokenIdl["instructions"][number] & {
    name: "stake";
};
type StakeBuilder = MethodsBuilder<ComptokenIdl, StakeIdlIx>;
export declare function stakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    amount: number | BN | BigInt;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): StakeBuilder;
type SubmitMiningProofIdlIx = ComptokenIdl["instructions"][number] & {
    name: "submitMiningProof";
};
type SubmitMiningProofBuilder = MethodsBuilder<ComptokenIdl, SubmitMiningProofIdlIx>;
export declare function submitMiningProofBuilder({ program, proof, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    proof: ComptokenProof;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): SubmitMiningProofBuilder;
type UnstakeIdlIx = ComptokenIdl["instructions"][number] & {
    name: "unstake";
};
type UnstakeBuilder = MethodsBuilder<ComptokenIdl, UnstakeIdlIx>;
export declare function unstakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount, }, }: {
    program: ComptokenProgram;
    amount: number | BN | BigInt;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): UnstakeBuilder;
type UnverifyIdlIx = ComptokenIdl["instructions"][number] & {
    name: "unverify";
};
type UnverifyBuilder = MethodsBuilder<ComptokenIdl, UnverifyIdlIx>;
export declare function unverifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { user, }, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        user: PublicKey;
    };
}): UnverifyBuilder;
type Unverify2IdlIx = ComptokenIdl["instructions"][number] & {
    name: "unverify2";
};
type Unverify2Builder = MethodsBuilder<ComptokenIdl, Unverify2IdlIx>;
export declare function unverify2Builder({ program, nullifierHash, accounts: { userWallet, }, }: {
    program: ComptokenProgram;
    nullifierHash: Buffer;
    accounts: {
        userWallet: Signer;
    };
}): Unverify2Builder;
type VerifyIdlIx = ComptokenIdl["instructions"][number] & {
    name: "verify";
};
type VerifyBuilder = MethodsBuilder<ComptokenIdl, VerifyIdlIx>;
export declare function verifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, userUnstakedTokenAccount, payer, }, }: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
        payer?: Signer;
    };
}): VerifyBuilder;
export {};
//# sourceMappingURL=methodBuilders.d.ts.map