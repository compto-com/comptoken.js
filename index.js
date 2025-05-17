const {
    COMPTOKEN_DECIMALS,
    COMPTOKEN_WALLET_SIZE,
    GLOBAL_DATA_SIZE,
    SEC_PER_DAY,
    DAILY_DISTRIBUTION_HISTORY_SIZE,
    devnet_compto_public_keys,
    compto_public_keys,
    ComptoPublicKeys,
} = require("./lib/constants.js");

const {
    TLV,
    Token,
    TokenAccount,
    UserData,
    UserDataAccount,
    GlobalData,
    GlobalDataAccount,
} = require("./lib/accounts.js");

const {
    getComptokenBalance,
    getNominalOwner,
    getDistributionOwed,
    getLastPayoutDate,
    getDaysSinceLastPayout,
    isVerifiedHuman,
    getValidBlockhashes,
    getValidBlockhashesFromTransactionResponse,
    getHistoricDistributions,
} = require("./lib/helper.js");

const {
    ComptokenProof,
    Instruction,
    createProofSubmissionInstruction,
    createCreateUserDataAccountInstruction,
    createDailyDistributionEventInstruction,
    createGetValidBlockhashesInstruction,
    createGetOwedComptokensInstruction,
    createGrowUserDataAccountInstruction,
    createVerifyHumanInstruction,
} = require("./lib/instruction.js");



module.exports = {
    TLV, // account.js
    Token,
    TokenAccount,
    UserData,
    UserDataAccount,
    GlobalData,
    GlobalDataAccount,
    getComptokenBalance, // helper.js
    getNominalOwner,
    getDistributionOwed,
    getLastPayoutDate,
    getDaysSinceLastPayout,
    isVerifiedHuman,
    getValidBlockhashes,
    getValidBlockhashesFromTransactionResponse,
    getHistoricDistributions,
    COMPTOKEN_DECIMALS, // constants.js
    COMPTOKEN_WALLET_SIZE,
    GLOBAL_DATA_SIZE,
    SEC_PER_DAY,
    DAILY_DISTRIBUTION_HISTORY_SIZE,
    devnet_compto_public_keys,
    compto_public_keys,
    ComptoPublicKeys,
    ComptokenProof, // instruction.js
    Instruction,
    createProofSubmissionInstruction,
    createCreateUserDataAccountInstruction,
    createDailyDistributionEventInstruction,
    createGetValidBlockhashesInstruction,
    createGetOwedComptokensInstruction,
    createGrowUserDataAccountInstruction,
    createVerifyHumanInstruction,
};