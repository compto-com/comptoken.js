import { PublicKey, type Signer, type TransactionSignature } from "@solana/web3.js";

import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import * as methodBuilders from "./methodBuilders.js";
import type { ComptokenProgram, SolanaWorldIdProgram } from "./types.js";
import * as utils from "./utils.js";

export { methodBuilders };

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
    return methodBuilders.collectBuilder({ program, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
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
    return methodBuilders.createUserDataAccountBuilder({ program, capacity, accounts: { userWallet, payer } }).rpc();
}

export async function dailyDistribution({
    program, //
}: {
    program: ComptokenProgram;
}): Promise<TransactionSignature> {
    return methodBuilders.dailyDistributionBuilder({ program }).rpc();
}

function syncValidBlockhashesRPC({
    program, //
}: {
    program: ComptokenProgram;
}): Promise<TransactionSignature> {
    return methodBuilders.syncValidBlockhashesBuilder({ program }).rpc();
}

/**
 * Helper to sync valid blockhashes by calling the syncValidBlockhashes instruction and parsing the return data.
 * Unlike other instructions, this does not just submit a transaction; it also retrieves and decodes the return data.
 *
 * to manually retrieve valid blockhashes, use {@link utils.syncValidBlockhashesReturn|syncValidBlockhashesReturn} on the returned signature.
 */
export async function syncValidBlockhashes({
    program, //
}: {
    program: ComptokenProgram;
}): Promise<{ sig: TransactionSignature; result: { announced: Buffer; valid: Buffer } }> {
    const sig = await syncValidBlockhashesRPC({ program });
    const result = await utils.syncValidBlockhashesReturn({ program, sig });
    return { sig, result };
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
    return methodBuilders.resizeUserDataAccountBuilder({ program, newCapacity, accounts: { userWallet, payer } }).rpc();
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
    return methodBuilders
        .reverifyBuilder({
            program,
            solanaWorldIdProgram,
            rootHash,
            nullifierHash,
            proof,
            accounts: { userWallet },
        })
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
    return methodBuilders.stakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
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
    return methodBuilders
        .submitMiningProofBuilder({
            program,
            proof,
            accounts: { userWallet, userUnstakedTokenAccount },
        })
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
    return methodBuilders.unstakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
}

export async function unverifyWithProofRecovery({
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
    return methodBuilders
        .unverifyWithProofRecoveryBuilder({
            program,
            solanaWorldIdProgram,
            rootHash,
            nullifierHash,
            proof,
            accounts: { user },
        })
        .rpc();
}

export async function unverifyWithWalletSignature({
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
    return methodBuilders
        .unverifyWithWalletSignatureBuilder({ program, nullifierHash, accounts: { userWallet } })
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
    return methodBuilders
        .verifyBuilder({
            program,
            solanaWorldIdProgram,
            rootHash,
            nullifierHash,
            proof,
            accounts: { userWallet, userUnstakedTokenAccount, payer },
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

    const stakedAmount = Number(stakedAccountInfo.value.uiAmountString);
    const unstakedAmount = Number(unstakedAccountInfo.value.uiAmountString);

    return stakedAmount! + unstakedAmount!;
}
