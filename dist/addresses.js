import { createAssociatedTokenAccountIdempotent, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
const WorldVerificationType = 0;
export function getGlobalDataAddress(program) {
    return PublicKey.findProgramAddressSync([program.constants.globalDataSeed], program.programId)[0];
}
export function getUserDataAddress(program, user) {
    return PublicKey.findProgramAddressSync([program.constants.userDataSeed, user.toBuffer()], program.programId)[0];
}
export function getWorldIdNullifierAddress(program, nullifier) {
    return PublicKey.findProgramAddressSync([program.constants.nullifierSeed, nullifier], program.programId)[0];
}
export function getWorldIdRootAddress(program, root) {
    return PublicKey.findProgramAddressSync([Buffer.from("Root"), root, Buffer.from([WorldVerificationType])], program.programId)[0];
}
export function getWorldIdLatestRootAddress(program) {
    return PublicKey.findProgramAddressSync([Buffer.from("LatestRoot"), Buffer.from([WorldVerificationType])], program.programId)[0];
}
export function getWorldIdConfigAddress(program) {
    return PublicKey.findProgramAddressSync([Buffer.from("Config")], program.programId)[0];
}
export function getStakedMintAddress(program) {
    return PublicKey.findProgramAddressSync([program.constants.stakedMintSeed], program.programId)[0];
}
export function getUnstakedMintAddress(program) {
    return PublicKey.findProgramAddressSync([program.constants.unstakedMintSeed], program.programId)[0];
}
/**
 * the only valid address for a user's staked token account is the associated token account.
 */
export function getUserStakedTokensAddress(program, user) {
    return getAssociatedTokenAddressSync(getStakedMintAddress(program), user, false, TOKEN_2022_PROGRAM_ID);
}
/**
 * any valid address for a user's unstaked token account is allowed, but this helper gets the associated token account.
 */
export function getUserUnstakedAssociatedTokenAddress(program, user) {
    return getAssociatedTokenAddressSync(getUnstakedMintAddress(program), user, false, TOKEN_2022_PROGRAM_ID);
}
export async function createUserStakedTokenAccount(program, user, payer) {
    return createAssociatedTokenAccountIdempotent(program.provider.connection, payer, getStakedMintAddress(program), user, undefined, TOKEN_2022_PROGRAM_ID);
}
export async function createUserUnstakedTokenAccount(program, user, payer) {
    return createAssociatedTokenAccountIdempotent(program.provider.connection, payer, getUnstakedMintAddress(program), user, undefined, TOKEN_2022_PROGRAM_ID);
}
//# sourceMappingURL=addresses.js.map