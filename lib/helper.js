const { TokenAccountNotFoundError, TokenInvalidAccountOwnerError } = require("@solana/spl-token");
const { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction } = require("@solana/web3.js");

const { DAILY_DISTRIBUTION_HISTORY_SIZE, SEC_PER_DAY, ComptoPublicKeys, compto_public_keys } = require("./constants.js");
const { normalizeTime, ringBuffer } = require("./utils.js");
const { createGetValidBlockhashesInstruction } = require("./instruction.js");
const {
    Account,
    TokenAccount,
    UserData,
    UserDataAccount,
    GlobalData,
    GlobalDataAccount,
} = require("./accounts.js");

const compto_public_keys_ = compto_public_keys; // rename to avoid shadowing

/**
 * @template {Account} T
 * @template {typeof T} U
 * @param {Connection} connection
 * @param {PublicKey} address
 * @param {U} type
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<T>}
 */
async function getAccount(connection, address, type, commitment = null) {
    if (commitment === null) {
        commitment = "confirmed";
    }
    const accountInfo = await connection.getAccountInfo(address, commitment);
    if (accountInfo === null) {
        throw new TokenAccountNotFoundError("User comptoken token account does not exist: " + address.toBase58());
    }
    return type.fromAccountInfoBytes(address, accountInfo);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<TokenAccount>}
 */
async function getComptokenAccount(
    connection,
    user_comptoken_token_account_address,
    commitment = null,
) {
    return getAccount(connection, user_comptoken_token_account_address, TokenAccount, commitment);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<number>}
 */
async function getComptokenBalance(
    connection,
    user_comptoken_token_account_address,
    commitment = null,
) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data.amount;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<PublicKey>}
 */
async function getNominalOwner(
    connection,
    user_comptoken_token_account_address,
    commitment = null,
) {
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);
    return userComptokenAccount.data.nominalOwner;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<UserData>}
 * @throws {TokenError}
 */
async function getUserData(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const user_data_account_address = UserDataAccount.addressFromComptokenAccount(user_comptoken_token_account_address, compto_public_keys);
    /** @type {UserDataAccount} */
    const user_data_account = await getAccount(connection, user_data_account_address, UserDataAccount, commitment);
    if (!user_data_account.owner.equals(compto_public_keys.compto_program_id_pubkey)) {
        throw new TokenInvalidAccountOwnerError(`${user_data_account_address} is not owned by the compto program`);
    }
    return user_data_account.data;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<[number, bigint]>}
 */
async function getDistributionOwed(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const daysSinceLastPayout = await getDaysSinceLastPayout(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    const userComptokenAccount = await getComptokenAccount(connection, user_comptoken_token_account_address, commitment);

    let interestOwed = Number(userComptokenAccount.data.amount);
    let ubiOwed = 0n;
    let i = 0;
    for (let historicDistribution of await getHistoricDistributions(connection, compto_public_keys, commitment)) {
        if (i++ < (GlobalData.DAILY_DISTRIBUTION_HISTORY_SIZE - daysSinceLastPayout)) {
            continue;
        }
        interestOwed *= 1 + historicDistribution.interestRate;
        ubiOwed += historicDistribution.ubiAmount;
    }

    if (!(await isVerifiedHuman(connection, user_comptoken_token_account_address, compto_public_keys, commitment))) {
        ubiOwed = 0n;
    }
    return [interestOwed - Number(userComptokenAccount.data.amount), ubiOwed];
}

/**
 * @param {Connection} connection 
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<Date>}
 */
async function getLastPayoutDate(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    return new Date(Number(user_data.lastInterestPayoutDate) * 1000);
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<number>}
 * @throws {TokenError}
 */
async function getDaysSinceLastPayout(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);

    const daysSinceLastPayout = Math.min(
        DAILY_DISTRIBUTION_HISTORY_SIZE,
        Number((BigInt(normalizeTime(new Date()) / 1000) - user_data.lastInterestPayoutDate) / BigInt(SEC_PER_DAY))
    );
    return daysSinceLastPayout;
}

/**
 * @param {Connection} connection
 * @param {PublicKey} user_comptoken_token_account_address
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<boolean>}
 * @throws {TokenError}
 */
async function isVerifiedHuman(
    connection,
    user_comptoken_token_account_address,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const user_data = await getUserData(connection, user_comptoken_token_account_address, compto_public_keys, commitment);
    return user_data.isVerifiedHuman;
}

/**
 * @param {Connection} connection 
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<GlobalData>}
 */
async function getGlobalData(
    connection,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const global_data_account = await getAccount(connection, compto_public_keys.global_data_account_pubkey, GlobalDataAccount, commitment);
    return global_data_account.data;
}

/**
 * @param {Connection} connection 
 * @param {Keypair} payer
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<{announcedBlockhash: Uint8Array, validBlockhash: Uint8Array}>}
 * @throws {Error}
 */
async function getValidBlockhashes(
    connection,
    payer,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    let transaction = new Transaction();
    transaction.add(await createGetValidBlockhashesInstruction(compto_public_keys));
    let txSig = await sendAndConfirmTransaction(connection, transaction, [payer], { commitment });
    /** @type {import("@solana/web3.js").VersionedTransactionResponse | null} */
    let result = await connection.getTransaction(txSig, { commitment, maxSupportedTransactionVersion: 0 });
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
 * @param {import("@solana/web3.js").TransactionResponse} transactionResponse 
 * @returns {{announcedBlockhash: Uint8Array, validBlockhash: Uint8Array}}
 */
function getValidBlockhashesFromTransactionResponse(transactionResponse) {
    let data = transactionResponse?.meta?.returnData.data[0];
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
 * @param {Connection} connection 
 * @param {ComptoPublicKeys?} compto_public_keys
 * @param {import("@solana/web3.js").Commitment?} commitment
 * @returns {Promise<Generator<{interestRate: number, ubiAmount: bigint}, void, any>>}
 */
async function getHistoricDistributions(
    connection,
    compto_public_keys = compto_public_keys_,
    commitment = null,
) {
    const globalData = await getGlobalData(connection, compto_public_keys, commitment);
    return function* () {
        const oldestHistoricValue = globalData.dailyDistributionData.oldestHistoricValue;
        for (const historicValue of ringBuffer(
            globalData.dailyDistributionData.historicDistributions,
            oldestHistoricValue,
            oldestHistoricValue + BigInt(DAILY_DISTRIBUTION_HISTORY_SIZE))
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