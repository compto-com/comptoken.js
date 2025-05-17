const { TokenAccountNotFoundError, TokenInvalidAccountOwnerError } = require("@solana/spl-token");
const { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction, VersionedTransaction, Message } = require("@solana/web3.js");

const { DAILY_DISTRIBUTION_HISTORY_SIZE, SEC_PER_DAY, ComptoPublicKeys, compto_public_keys } = require("./constants.js");
const { normalizeTime, ringBuffer } = require("./utils.js");
const { createGetValidBlockhashesInstruction } = require("./instruction.js");
const {
    TokenAccount,
    UserDataAccount,
    GlobalData,
    GlobalDataAccount,
} = require("./accounts.js");

/**
 * @import { Commitment, VersionedTransactionResponse } from "@solana/web3.js";
 * 
 * @import {
 *      Account,
 *      AccountStatic,
 *      IUserData,
 *      IGlobalData,
 * } from "./accounts.js";
 */

const compto_public_keys_ = compto_public_keys; // rename to avoid shadowing

/**
 * @template T
 * @template DataT
 * @param {Connection}              connection
 * @param {PublicKey}               address
 * @param {AccountStatic<T, DataT>} type
 * @param {Commitment}             [commitment]
 * @returns {Promise<Account<T, DataT>>}
 */
async function getAccount(connection, address, type, commitment) {
    if (commitment === null) {
        commitment = "confirmed";
    }
    const accountInfo = await connection.getAccountInfo(address, commitment);
    if (accountInfo === null) {
        throw new TokenAccountNotFoundError("User comptoken token account does not exist: " + address.toBase58());
    }
    // Convert Buffer to Uint8Array for compatibility (ts issue, not a real issue)
    const accountInfoFixed = {
        ...accountInfo,
        data: new Uint8Array(accountInfo.data),
    };
    return type.fromAccountInfoBytes(address, accountInfoFixed);
}

/**
 * @param {Connection}  connection
 * @param {PublicKey}   user_comptoken_token_account_address
 * @param {Commitment} [commitment]
 * @returns {Promise<TokenAccount>}
 */
async function getComptokenAccount(
    connection,
    user_comptoken_token_account_address,
    commitment,
) {
    return getAccount(connection, user_comptoken_token_account_address, TokenAccount, commitment);
}

/**
 * @param {Connection}  connection
 * @param {PublicKey}   user_comptoken_token_account_address
 * @param {Commitment} [commitment]
 * @returns {Promise<bigint>}
 */
async function getComptokenBalance(
    connection,
    user_comptoken_token_account_address,
    commitment,
) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data.data.amount;
}

/**
 * @param {Connection}  connection
 * @param {PublicKey}   user_comptoken_token_account_address
 * @param {Commitment} [commitment]
 * @returns {Promise<PublicKey>}
 */
async function getNominalOwner(
    connection,
    user_comptoken_token_account_address,
    commitment,
) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data.data.owner;
}

/**
 * @param {Connection}        connection
 * @param {PublicKey}         user_comptoken_token_account_address
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<IUserData>}
 * @throws {TokenError}
 */
async function getUserData(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_token_account_address, compto_public_keys);
    /** @type {UserDataAccount} */
    const user_data_account = await getAccount(connection, user_data_account_address, UserDataAccount, commitment);
    if (!user_data_account.owner.equals(compto_public_keys.compto_program_id_pubkey)) {
        throw new TokenInvalidAccountOwnerError(`${user_data_account_address} is not owned by the compto program`);
    }
    return user_data_account.data.data;
}

/**
 * @param {Connection}        connection
 * @param {PublicKey}         user_comptoken_token_account_address
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<[number, number]>}
 */
async function getDistributionOwed(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const daysSinceLastPayout = await getDaysSinceLastPayout(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);

    const isVerfied = await isVerifiedHuman(connection, user_comptoken_token_account_address, compto_public_keys, commitment);

    let balance = Number(userComptokenAccount.data.data.amount);
    let ubiOwed = 0;
    let i = 0;
    for (let historicDistribution of await getHistoricDistributions(connection, compto_public_keys, commitment)) {
        if (i++ < (GlobalData.DAILY_DISTRIBUTION_HISTORY_SIZE - daysSinceLastPayout)) {
            continue;
        }
        const daysUbi = isVerfied ? Number(historicDistribution.ubiAmount) : 0;
        balance = Math.round((1 + historicDistribution.interestRate) * balance) + daysUbi;
        ubiOwed += daysUbi;
    }

    const interestOwed = balance - Number(userComptokenAccount.data.data.amount) - ubiOwed;
    return [interestOwed, ubiOwed];
}

/**
 * @param {Connection}        connection 
 * @param {PublicKey}         user_comptoken_token_account_address
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<Date>}
 */
async function getLastPayoutDate(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    return new Date(Number(user_data.lastInterestPayoutDate) * 1000);
}

/**
 * @param {Connection}        connection
 * @param {PublicKey}         user_comptoken_token_account_address
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<number>}
 * @throws {TokenError}
 */
async function getDaysSinceLastPayout(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);

    const daysSinceLastPayout = Math.min(
        DAILY_DISTRIBUTION_HISTORY_SIZE,
        Number((BigInt(normalizeTime(new Date()).getTime() / 1000) - user_data.lastInterestPayoutDate) / BigInt(SEC_PER_DAY))
    );
    return daysSinceLastPayout;
}

/**
 * @param {Connection}        connection
 * @param {PublicKey}         user_comptoken_token_account_address
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<boolean>}
 * @throws {TokenError}
 */
async function isVerifiedHuman(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    return user_data.isVerifiedHuman;
}

/**
 * @param {Connection}        connection 
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<IGlobalData>}
 */
async function getGlobalData(
    connection,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const global_data_account = await getAccount(connection, compto_public_keys.global_data_account_pubkey, GlobalDataAccount, commitment);
    return global_data_account.data.data;
}

/**
 * @param {Connection}        connection 
 * @param {Keypair}           payer
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<{announcedBlockhash: Uint8Array, validBlockhash: Uint8Array}>}
 * @throws {Error}
 */
async function getValidBlockhashes(
    connection,
    payer,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const finality = (commitment === 'confirmed' || commitment === 'finalized') ? commitment : 'confirmed';
    let transaction = new Transaction()
        .add(await createGetValidBlockhashesInstruction(compto_public_keys));


    let txSig = await sendAndConfirmTransaction(connection, transaction, [payer], { commitment });

    let result = await connection.getTransaction(txSig, { commitment: finality, maxSupportedTransactionVersion: 0 });

    if (result === null) {
        throw Error("Failed to get transaction: txSig=" + txSig);
    }
    try {
        return getValidBlockhashesFromTransactionResponse(result);
    } catch (error) {
        if (error instanceof Error && error.message == "Failed to get return data") {
            throw Error("Failed to get return data: txSig=" + txSig);
        }
        throw error;
    }
}

/**
 * @param {VersionedTransactionResponse} transactionResponse 
 * @returns {{announcedBlockhash: Uint8Array, validBlockhash: Uint8Array}}
 */
function getValidBlockhashesFromTransactionResponse(transactionResponse) {
    /* @ts-ignore */// returnData *does* exist, but is not in the type definition.
    // returnData is documented in the rpc here: https://solana.com/docs/rpc/json-structures#transaction-status-metadata
    // I cannot figure out where it is set in web3.js, but it definitely exists at runtime.
    let data = transactionResponse.meta?.returnData.data[0];
    if (data === undefined || data === null) {
        throw Error("Failed to get return data");
    }
    let bytes = Uint8Array.from(Buffer.from(data, "base64"));
    return {
        announcedBlockhash: bytes.slice(0, 32),
        validBlockhash: bytes.slice(32),
    };
}

/**
 * @param {Connection}        connection 
 * @param {ComptoPublicKeys} [compto_public_keys]
 * @param {Commitment}       [commitment]
 * @returns {Promise<Generator<{interestRate: number, ubiAmount: bigint}, void, any>>}
 */
async function getHistoricDistributions(
    connection,
    compto_public_keys = compto_public_keys_,
    commitment,
) {
    const globalData = await getGlobalData(connection, compto_public_keys, commitment);
    return function* () {
        const oldestHistoricValue = globalData.dailyDistributionData.oldestHistoricValue;
        for (const historicValue of ringBuffer(
            globalData.dailyDistributionData.historicDistributions,
            Number(oldestHistoricValue),
            Number(oldestHistoricValue) + DAILY_DISTRIBUTION_HISTORY_SIZE)
        ) {
            yield historicValue;
        }
    }();
}

module.exports = {
    getComptokenBalance,
    getNominalOwner,
    getDistributionOwed,
    getLastPayoutDate,
    getDaysSinceLastPayout,
    isVerifiedHuman,
    getValidBlockhashes,
    getValidBlockhashesFromTransactionResponse,
    getHistoricDistributions,
};