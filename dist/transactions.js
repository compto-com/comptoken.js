import { PublicKey } from "@solana/web3.js";
import * as addresses from "./addresses.js";
import { ComptokenProof } from "./comptokenProof.js";
import * as methodBuilders from "./methodBuilders.js";
import * as utils from "./utils.js";
export { methodBuilders };
export async function collect({ program, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return methodBuilders.collectBuilder({ program, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
}
export async function createUserDataAccount({ program, capacity = 0, accounts: { userWallet, payer = userWallet, //
 }, }) {
    return methodBuilders.createUserDataAccountBuilder({ program, capacity, accounts: { userWallet, payer } }).rpc();
}
export async function dailyDistribution({ program, //
 }) {
    return methodBuilders.dailyDistributionBuilder({ program }).rpc();
}
function getValidBlockhashesRPC({ program, //
 }) {
    return methodBuilders.getValidBlockhashesBuilder({ program }).rpc();
}
/**
 * Helper to get valid blockhashes by calling the getValidBlockhashes instruction and parsing the return data.
 * Unlike other instructions, this does not just submit a transaction; it also retrieves and decodes the return data.
 *
 * to manually retrieve valid blockhashes, use {@link utils.getValidBlockhashesReturn|getValidBlockhashesReturn} on the returned signature.
 */
export async function getValidBlockhashes({ program, //
 }) {
    const sig = await getValidBlockhashesRPC({ program });
    const result = await utils.getValidBlockhashesReturn({ program, sig });
    return { sig, result };
}
export async function resizeUserDataAccount({ program, newCapacity, accounts: { userWallet, payer = userWallet, //
 }, }) {
    return methodBuilders.resizeUserDataAccountBuilder({ program, newCapacity, accounts: { userWallet, payer } }).rpc();
}
export async function reverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, //
 }, }) {
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
export async function stake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return methodBuilders.stakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
}
export async function submitMiningProof({ program, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return methodBuilders
        .submitMiningProofBuilder({
        program,
        proof,
        accounts: { userWallet, userUnstakedTokenAccount },
    })
        .rpc();
}
export async function unstake({ program, amount, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), //
 }, }) {
    return methodBuilders.unstakeBuilder({ program, amount, accounts: { userWallet, userUnstakedTokenAccount } }).rpc();
}
export async function unverify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { user, //
 }, }) {
    return methodBuilders
        .unverifyBuilder({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { user } })
        .rpc();
}
export async function unverify2({ program, nullifierHash, accounts: { userWallet, //
 }, }) {
    return methodBuilders.unverify2Builder({ program, nullifierHash, accounts: { userWallet } }).rpc();
}
export async function verify({ program, solanaWorldIdProgram, rootHash, nullifierHash, proof, accounts: { userWallet, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey), payer = userWallet, }, }) {
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
export async function getComptokenBalance({ program, user, userUnstakedTokenAccount = addresses.getUserUnstakedAssociatedTokenAddress(program, user), }) {
    const userStakedTokenAccount = addresses.getUserStakedTokensAddress(program, user);
    const [stakedAccountInfo, unstakedAccountInfo] = await Promise.all([
        program.provider.connection.getTokenAccountBalance(userStakedTokenAccount),
        program.provider.connection.getTokenAccountBalance(userUnstakedTokenAccount),
    ]);
    const stakedAmount = Number(stakedAccountInfo.value.uiAmountString);
    const unstakedAmount = Number(unstakedAccountInfo.value.uiAmountString);
    return stakedAmount + unstakedAmount;
}
//# sourceMappingURL=transactions.js.map