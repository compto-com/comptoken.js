import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import * as utils from "./utils.js";
const { BN } = anchor;
export async function collect({ program, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
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
export async function createUserDataAccount({ program, capacity = 0, accounts: { userWallet, payer = userWallet, //
 }, }) {
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
export async function dailyDistribution({ program, //
 }) {
    return await program.methods.dailyDistribution().accounts({}).rpc();
}
export async function getValidBlockhashes({ program, //
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
export async function resizeUserDataAccount({ program, newCapacity, accounts: { userWallet, payer = userWallet, //
 }, }) {
    return await program.methods
        .resizeUserDataAccount({ newCapacity: new BN(newCapacity) })
        .accounts({
        userWallet: userWallet.publicKey,
        payer: payer.publicKey,
    })
        .signers([userWallet, payer])
        .rpc();
}
export async function reverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, }) {
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
export async function stake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
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
export async function submitMiningProof({ program, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return await program.methods
        .submitMiningProof({ rawData: [...proof.serializeData()] })
        .accounts({
        userWallet: userWallet.publicKey,
        userUnstakedTokenAccount,
    })
        .signers([userWallet])
        .rpc();
}
export async function unstake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
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
export async function unverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, //
 }, }) {
    return await program.methods
        .unverify({
        rootHash: { 0: [...rootHash] },
        nullifierHash: { 0: [...nullifierHash] },
        proof: [...proof],
    })
        .accountsPartial({
        userWallet: userWallet.publicKey,
        worldIdRoot: addresses.getWorldIdRootAddress(solanaWorldIdProgram, rootHash),
        worldIdLatestRoot: addresses.getWorldIdLatestRootAddress(solanaWorldIdProgram),
        worldIdConfig: addresses.getWorldIdConfigAddress(solanaWorldIdProgram),
        worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
    })
        .signers([userWallet])
        .rpc();
}
export async function unverify2({ program, nullifierHash, accounts: { userWallet, //
 }, }) {
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
export async function verify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), payer = userWallet, }, }) {
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
export async function getComptokenBalance({ program, user, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, user), }) {
    const userStakedTokenAccount = addresses.getUserStakedTokensAddress(program, user);
    const [stakedAccountInfo, unstakedAccountInfo] = await Promise.all([
        program.provider.connection.getTokenAccountBalance(userStakedTokenAccount),
        program.provider.connection.getTokenAccountBalance(userUnstakedTokenAccount),
    ]);
    const stakedAmount = stakedAccountInfo.value.uiAmount;
    const unstakedAmount = unstakedAccountInfo.value.uiAmount;
    return stakedAmount + unstakedAmount;
}
//# sourceMappingURL=transactions.js.map