import { PublicKey, SYSVAR_SLOT_HASHES_PUBKEY } from "@solana/web3.js";
import BN from "bn.js";
import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import * as utils from "./utils.js";
export function collectBuilder({ program, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return program.methods
        .collect()
        .accounts({
        userWallet: userWallet.publicKey,
        userStakedTokenAccount: addresses.getUserStakedTokensAddress(program, userWallet.publicKey),
        userUnstakedTokenAccount,
    })
        .signers([userWallet]);
}
export function createUserDataAccountBuilder({ program, capacity = 0, accounts: { userWallet, payer = userWallet, //
 }, }) {
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
export function dailyDistributionBuilder({ program, //
 }) {
    return program.methods.dailyDistribution().accounts({});
}
export function getValidBlockhashesBuilder({ program, //
 }) {
    return program.methods.getValidBlockhashes().accounts({
        slotHashes: SYSVAR_SLOT_HASHES_PUBKEY,
    });
}
export function resizeUserDataAccountBuilder({ program, newCapacity, accounts: { userWallet, payer = userWallet, //
 }, }) {
    return program.methods
        .resizeUserDataAccount({ newCapacity: utils.normalizeToBN(newCapacity) })
        .accounts({
        userWallet: userWallet.publicKey,
        payer: payer.publicKey,
    })
        .signers([userWallet, payer]);
}
export function reverifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, //
 }, }) {
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
export function stakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
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
export function submitMiningProofBuilder({ program, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return program.methods
        .submitMiningProof({ rawData: [...proof.serializeData()] })
        .accounts({
        userWallet: userWallet.publicKey,
        userUnstakedTokenAccount,
    })
        .signers([userWallet]);
}
export function unstakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
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
export function unverifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { user, //
 }, }) {
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
        worldIdConfig: addresses.getWorldIdConfigAddress(solanaWorldIdProgram),
        worldIdNullifier: addresses.getWorldIdNullifierAddress(program, nullifierHash),
    });
}
export function unverify2Builder({ program, nullifierHash, accounts: { userWallet, //
 }, }) {
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
export function verifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), payer = userWallet, //
 }, }) {
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
//# sourceMappingURL=methodBuilders.js.map