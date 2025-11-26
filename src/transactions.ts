import * as anchor from "@coral-xyz/anchor";
import { PublicKey, type TransactionSignature } from "@solana/web3.js";

import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
import * as utils from "./utils.js";

const { BN } = anchor;

export async function collect({
    program,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet), //
    },
}: {
    program: ComptokenProgram;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .collect()
        .accounts({
            userWallet,
            userStakedTokenAccount: addresses.getUserStakedTokensAddress(program, userWallet),
            userUnstakedTokenAccount,
        })
        .rpc();
}

export async function createUserDataAccount({
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
        userWallet: PublicKey;
        payer?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .createUserDataAccount({
            capacity: new BN(capacity),
        })
        .accounts({
            userWallet,
            payer,
        })
        .rpc();
}

export async function dailyDistribution({
    program, //
}: {
    program: ComptokenProgram;
}): Promise<TransactionSignature> {
    return await program.methods.dailyDistribution().accounts({}).rpc();
}

export async function getValidBlockhashes({
    program, //
}: {
    program: ComptokenProgram;
}) {
    const sig = await utils.getValidBlockhashesRPC({ program });
    const tx = await program.provider.connection.getTransaction(sig, {
        maxSupportedTransactionVersion: 0,
    });
    if (tx?.meta?.logMessages === undefined || tx?.meta?.logMessages === null) {
        throw new Error("Failed to get transaction logs for valid blockhashes");
    }
    const { buffer } = utils.getReturnLog(tx.meta.logMessages);
    return { sig, result: utils.decodeValidBlockhashesReturn(program, buffer) };
}

export async function resizeUserDataAccount({
    program,
    newCapacity,
    accounts: {
        userWallet,
        payer = userWallet, //
    },
}: {
    program: ComptokenProgram;
    newCapacity: number;
    accounts: {
        userWallet: PublicKey;
        payer?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .resizeUserDataAccount({ newCapacity: new BN(newCapacity) })
        .accounts({
            userWallet,
            payer,
        })
        .rpc();
}

export async function reverify({
    program,
    solanaWorldIdProgram,
    rootHash,
    nullifierHash,
    proof,
}: {
    program: ComptokenProgram;
    solanaWorldIdProgram: SolanaWorldIdProgram;
    rootHash: Buffer;
    nullifierHash: Buffer;
    proof: Buffer;
}): Promise<TransactionSignature> {
    return await program.methods
        .reverify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accounts({
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
        })
        .rpc();
}

export async function stake({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet), //
    },
}: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .stake({
            amount: new BN(amount),
        })
        .accounts({
            userWallet: userWallet,
            userUnstakedTokenAccount,
        })
        .rpc();
}

export async function submitMiningProof({
    program,
    proof,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet), //
    },
}: {
    program: ComptokenProgram;
    proof: ComptokenProof;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .submitMiningProof({ rawData: [...proof.serializeData()] })
        .accounts({
            userWallet,
            userUnstakedTokenAccount,
        })
        .rpc();
}

export async function unstake({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet), //
    },
}: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: PublicKey;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .unstake({
            amount: new BN(amount),
        })
        .accounts({
            userWallet,
            userUnstakedTokenAccount,
        })
        .rpc();
}

export async function unverify({
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
        userWallet: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .unverify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet: userWallet,
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
            worldIdConfig: addresses.getWorldIdConfigAddress(solanaWorldIdProgram),
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .rpc();
}

export async function unverify2({
    program,
    nullifierHash,
    accounts: {
        userWallet, //
    },
}: {
    program: ComptokenProgram;
    nullifierHash: Buffer;
    accounts: {
        userWallet: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .unverify2({
            nullifierHash: { 0: [...nullifierHash] },
        })
        .accountsPartial({
            userWallet,
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .rpc();
}

export async function verify({
    program,
    solanaWorldIdProgram,
    rootHash,
    nullifierHash,
    proof,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet),
        payer = userWallet,
    },
}: {
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
}): Promise<TransactionSignature> {
    return await program.methods
        .verify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet,
            userUnstakedTokenAccount,
            payer,
            worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
            worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .rpc();
}

// special helper to get total comptoken balance (staked + unstaked) for a user

export async function getComptokenBalance({
    program,
    user,
    userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, user),
}: {
    program: ComptokenProgram;
    user: PublicKey;
    userUnstakedTokenAccount?: PublicKey;
}): Promise<number> {
    const userStakedTokenAccount = addresses.getUserStakedTokensAddress(program, user);

    const [stakedAccountInfo, unstakedAccountInfo] = await Promise.all([
        program.provider.connection.getTokenAccountBalance(userStakedTokenAccount),
        program.provider.connection.getTokenAccountBalance(userUnstakedTokenAccount),
    ]);

    const stakedAmount = stakedAccountInfo.value.uiAmount;
    const unstakedAmount = unstakedAccountInfo.value.uiAmount;

    return stakedAmount! + unstakedAmount!;
}
