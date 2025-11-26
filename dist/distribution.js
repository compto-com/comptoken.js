import { PublicKey } from "@solana/web3.js";
import * as addresses from "./addresses.js";
import { daysSinceEpoch, normalizeTimestamp, ringBufferGetLastN } from "./utils.js";
export async function getDistributionOwed({ program, user, }) {
    const userStakedTokenAccount = addresses.getUserStakedTokensAddress(program, user);
    const userDataAddress = addresses.getUserDataAddress(program, user);
    const [stakedAccountInfo, userData, globalData] = await Promise.all([
        program.provider.connection.getTokenAccountBalance(userStakedTokenAccount),
        program.account.userData.fetch(userDataAddress),
        program.account.globalData.fetch(addresses.getGlobalDataAddress(program)),
    ]);
    const stakedAmount = stakedAccountInfo.value.uiAmount;
    const today = normalizeTimestamp(Math.floor(Date.now() / 1000)); // normalize to start of day UTC
    const dailyDistributionHistoryLength = program.constants.dailyDistributionDataHistoryLength.toNumber();
    const daysSinceLastClaim = getDaysSinceLastClaim({ program, userData });
    const { buffer: historicDistributionsBuffer, position } = globalData.dailyDistribution.historicDistributions;
    const historicDistributions = { buffer: historicDistributionsBuffer, position: position.toNumber() };
    const { overallRate, totalUbiYield } = [
        ...ringBufferGetLastN(historicDistributions, dailyDistributionHistoryLength, daysSinceLastClaim),
    ]
        .map((dayData) => ({ yieldRate: dayData.yieldRate, ubiYield: dayData.ubiYield.toNumber() }))
        .reduce((acc, dayData) => {
        acc.overallRate += dayData.yieldRate;
        acc.totalUbiYield += dayData.ubiYield;
        return acc;
    }, { overallRate: 0, totalUbiYield: 0 });
    const isVerified = userData.lastVerifiedTimestamp.toNumber() + program.constants.verificationDuration.toNumber() > today;
    return stakedAmount * overallRate + (isVerified ? totalUbiYield : 0);
}
// implementation
export function getDaysSinceLastClaim({ program, user, userData, }) {
    const compute = function (lastClaimedTimestamp) {
        const daysSinceLastClaimUncapped = daysSinceEpoch(Date.now() / 1000) - daysSinceEpoch(lastClaimedTimestamp);
        return daysSinceLastClaimUncapped % program.constants.dailyDistributionDataHistoryLength.toNumber();
    };
    if (userData === undefined) {
        if (user === undefined)
            throw new Error("Either user or userData must be provided");
        const userDataAddress = addresses.getUserDataAddress(program, user);
        return program.account.userData
            .fetch(userDataAddress)
            .then((ud) => compute(ud.lastClaimedTimestamp.toNumber()));
    }
    return compute(userData.lastClaimedTimestamp.toNumber());
}
// implementation
export function getDaysSinceLastVerified({ program, user, userData, }) {
    const compute = function (lastVerifiedTimestamp) {
        const daysSinceLastVerifiedUncapped = daysSinceEpoch(Date.now() / 1000) - daysSinceEpoch(lastVerifiedTimestamp);
        return daysSinceLastVerifiedUncapped % program.constants.dailyDistributionDataHistoryLength.toNumber();
    };
    if (userData === undefined) {
        if (user === undefined)
            throw new Error("Either user or userData must be provided");
        const userDataAddress = addresses.getUserDataAddress(program, user);
        return program.account.userData
            .fetch(userDataAddress)
            .then((ud) => compute(ud.lastVerifiedTimestamp.toNumber()));
    }
    return compute(userData.lastVerifiedTimestamp.toNumber());
}
// implementation
export function isVerifiedHuman({ program, user, userData, }) {
    const isStillVerified = function (lastVerifiedTimestamp) {
        return (lastVerifiedTimestamp + program.constants.verificationDuration.toNumber() >
            normalizeTimestamp(Date.now() / 1000));
    };
    if (user === undefined) {
        if (userData === undefined) {
            throw new Error("Either user or userData must be provided");
        }
        return isStillVerified(getDaysSinceLastVerified({ program, userData }));
    }
    return getDaysSinceLastVerified({ program, user }).then(isStillVerified);
}
//# sourceMappingURL=distribution.js.map