import type { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods.js";
import { type PublicKey, SYSVAR_SLOT_HASHES_PUBKEY, type Signer } from "@solana/web3.js";
import BN from "bn.js";

import * as addresses from "./addresses.js";
import type { ComptokenProof } from "./comptokenProof.js";
import type { ComptokenIdl, ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
import * as utils from "./utils.js";

type CollectIdlIx = ComptokenIdl["instructions"][number] & { name: "collect" };
type CollectBuilder = MethodsBuilder<ComptokenIdl, CollectIdlIx>;

export function collectBuilder({
    program,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): CollectBuilder {
    return program.methods
        .collect()
        .accounts({
            userWallet: userWallet.publicKey,
            userStakedTokenAccount: addresses.getUserStakedTokensAddress(program, userWallet.publicKey),
            userUnstakedTokenAccount,
        })
        .signers([userWallet]);
}

type CreateUserDataAccountIdlIx = ComptokenIdl["instructions"][number] & { name: "createUserDataAccount" };
type CreateUserDataAccountBuilder = MethodsBuilder<ComptokenIdl, CreateUserDataAccountIdlIx>;

export function createUserDataAccountBuilder({
    program,
    capacity = 0,
    accounts: {
        userWallet,
        payer = userWallet, //
    },
}: {
    program: ComptokenProgram;
    capacity?: number;
    accounts: {
        userWallet: Signer;
        payer?: Signer;
    };
}): CreateUserDataAccountBuilder {
    return program.methods
        .createUserDataAccount({
            capacity: new BN(capacity),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            payer: payer.publicKey,
        })
        .signers([userWallet, payer]);
}

type DailyDistributionIdlIx = ComptokenIdl["instructions"][number] & { name: "dailyDistribution" };
type DailyDistributionBuilder = MethodsBuilder<ComptokenIdl, DailyDistributionIdlIx>;

export function dailyDistributionBuilder({
    program, //
}: {
    program: ComptokenProgram;
}): DailyDistributionBuilder {
    return program.methods.dailyDistribution().accounts({});
}

type GetValidBlockhashesIdlIx = ComptokenIdl["instructions"][number] & { name: "getValidBlockhashes" };
type GetValidBlockhashesBuilder = MethodsBuilder<ComptokenIdl, GetValidBlockhashesIdlIx>;

export function getValidBlockhashesBuilder({
    program, //
}: {
    program: ComptokenProgram;
}): GetValidBlockhashesBuilder {
    return program.methods.getValidBlockhashes().accounts({
        slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
    });
}

type ResizeUserDataAccountIdlIx = ComptokenIdl["instructions"][number] & { name: "resizeUserDataAccount" };
type ResizeUserDataAccountBuilder = MethodsBuilder<ComptokenIdl, ResizeUserDataAccountIdlIx>;

export function resizeUserDataAccountBuilder({
    program,
    newCapacity,
    accounts: {
        userWallet,
        payer = userWallet, //
    },
}: {
    program: ComptokenProgram;
    newCapacity: number | BN | bigint;
    accounts: {
        userWallet: Signer;
        payer?: Signer;
    };
}): ResizeUserDataAccountBuilder {
    return program.methods
        .resizeUserDataAccount({ newCapacity: utils.normalizeToBN(newCapacity) })
        .accounts({
            userWallet: userWallet.publicKey,
            payer: payer.publicKey,
        })
        .signers([userWallet, payer]);
}

type ReverifyIdlIx = ComptokenIdl["instructions"][number] & { name: "reverify" };
type ReverifyBuilder = MethodsBuilder<ComptokenIdl, ReverifyIdlIx>;

export function reverifyBuilder({
    program,
    solanaWorldIdProgram,
    rootHash,
    nullifierHash,
    proof,
    accounts: {
        userWallet, //
    },
}: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        userWallet: Signer;
    };
}): ReverifyBuilder {
    return program.methods
        .reverify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet: userWallet.publicKey,
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .signers([userWallet]);
}

type StakeIdlIx = ComptokenIdl["instructions"][number] & { name: "stake" };
type StakeBuilder = MethodsBuilder<ComptokenIdl, StakeIdlIx>;

export function stakeBuilder({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    amount: number | BN | bigint;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): StakeBuilder {
    return program.methods
        .stake({
            amount: utils.normalizeToBN(amount),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet]);
}

type SubmitMiningProofIdlIx = ComptokenIdl["instructions"][number] & { name: "submitMiningProof" };
type SubmitMiningProofBuilder = MethodsBuilder<ComptokenIdl, SubmitMiningProofIdlIx>;

export function submitMiningProofBuilder({
    program,
    proof,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    proof: ComptokenProof;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): SubmitMiningProofBuilder {
    return program.methods
        .submitMiningProof({ rawData: [...proof.serializeData()] })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet]);
}

type UnstakeIdlIx = ComptokenIdl["instructions"][number] & { name: "unstake" };
type UnstakeBuilder = MethodsBuilder<ComptokenIdl, UnstakeIdlIx>;

export function unstakeBuilder({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    amount: number | BN | bigint;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): UnstakeBuilder {
    return program.methods
        .unstake({
            amount: utils.normalizeToBN(amount),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet]);
}

type UnverifyIdlIx = ComptokenIdl["instructions"][number] & { name: "unverify" };
type UnverifyBuilder = MethodsBuilder<ComptokenIdl, UnverifyIdlIx>;

export function unverifyBuilder({
    program,
    solanaWorldIdProgram,
    rootHash,
    nullifierHash,
    proof,
    accounts: {
        user, //
    },
}: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
    accounts: {
        user: PublicKey;
    };
}): UnverifyBuilder {
    return program.methods
        .unverify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet: user,
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        });
}

type Unverify2IdlIx = ComptokenIdl["instructions"][number] & { name: "unverify2" };
type Unverify2Builder = MethodsBuilder<ComptokenIdl, Unverify2IdlIx>;

export function unverify2Builder({
    program,
    nullifierHash,
    accounts: {
        userWallet, //
    },
}: {
    program: ComptokenProgram;
    nullifierHash: Buffer;
    accounts: {
        userWallet: Signer;
    };
}): Unverify2Builder {
    return program.methods
        .unverify2({
            nullifierHash: { 0: [...nullifierHash] },
        })
        .accountsPartial({
            userWallet: userWallet.publicKey,
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .signers([userWallet]);
}

type VerifyIdlIx = ComptokenIdl["instructions"][number] & { name: "verify" };
type VerifyBuilder = MethodsBuilder<ComptokenIdl, VerifyIdlIx>;

export function verifyBuilder({
    program,
    solanaWorldIdProgram,
    rootHash,
    nullifierHash,
    proof,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey),
        payer = userWallet, //
    },
}: {
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
}): VerifyBuilder {
    return program.methods
        .verify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
            payer: payer.publicKey,
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .signers([userWallet, payer]);
}
