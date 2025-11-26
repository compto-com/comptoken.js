import { PublicKey, type Signer, type TransactionSignature } from "@solana/web3.js";
import BN from "bn.js";

import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
import * as utils from "./utils.js";

export async function collect({
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
}): Promise<TransactionSignature> {
    return await program.methods
        .collect()
        .accounts({
            userWallet: userWallet.publicKey,
            userStakedTokenAccount: addresses.getUserStakedTokensAddress(program, userWallet.publicKey),
            userUnstakedTokenAccount,
        })
        .signers([userWallet])
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
        userWallet: Signer;
        payer?: Signer;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .createUserDataAccount({
            capacity: new BN(capacity),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            payer: payer.publicKey,
        })
        .signers([userWallet, payer])
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
        userWallet: Signer;
        payer?: Signer;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .resizeUserDataAccount({ newCapacity: new BN(newCapacity) })
        .accounts({
            userWallet: userWallet.publicKey,
            payer: payer.publicKey,
        })
        .signers([userWallet, payer])
        .rpc();
}

export async function reverify({
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
}): Promise<TransactionSignature> {
    return await program.methods
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
        .signers([userWallet])
        .rpc();
}

export async function stake({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .stake({
            amount: new BN(amount),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet])
        .rpc();
}

export async function submitMiningProof({
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
}): Promise<TransactionSignature> {
    return await program.methods
        .submitMiningProof({ rawData: [...proof.serializeData()] })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet])
        .rpc();
}

export async function unstake({
    program,
    amount,
    accounts: {
        userWallet,
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
    },
}: {
    program: ComptokenProgram;
    amount: number;
    accounts: {
        userWallet: Signer;
        userUnstakedTokenAccount?: PublicKey;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .unstake({
            amount: new BN(amount),
        })
        .accounts({
            userWallet: userWallet.publicKey,
            userUnstakedTokenAccount,
        })
        .signers([userWallet])
        .rpc();
}

export async function unverify({
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
}): Promise<TransactionSignature> {
    return await program.methods
        .unverify({
            rootHash: { 0: [...rootHash] },
            nullifierHash: { 0: [...nullifierHash] },
            proof: [...proof],
        })
        .accountsPartial({
            userWallet: user,
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
        userWallet: Signer;
    };
}): Promise<TransactionSignature> {
    return await program.methods
        .unverify2({
            nullifierHash: { 0: [...nullifierHash] },
        })
        .accountsPartial({
            userWallet: userWallet.publicKey,
            worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
        })
        .signers([userWallet])
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
        userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey),
        payer = userWallet,
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
}): Promise<TransactionSignature> {
    return await program.methods
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
        .signers([userWallet, payer])
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
