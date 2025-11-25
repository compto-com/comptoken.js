import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import * as addresses from "./addresses.js";
import type { ComptokenProgram } from "./types.js";
import { normalizeTimestamp, ringBufferGetLastN } from "./utils.js";

export type HistoricDistribution = {
    yieldRate: number;
    ubiYield: BN;
};

export async function getDistributionOwed({
    program,
    user,
}: {
    program: ComptokenProgram;
    user: any;
    userUnstakedTokenAccount?: any;
}): Promise<number> {
    const userStakedTokenAccount = addresses.getUserStakedTokensAddress(program, user);
    const userDataAddress = addresses.getUserDataAddress(program, user);

    const [stakedAccountInfo, userData, globalData] = await Promise.all([
        program.provider.connection.getTokenAccountBalance(userStakedTokenAccount),
        program.account.userData.fetch(userDataAddress),
        program.account.globalData.fetch(addresses.getGlobalDataAddress(program)),
    ]);

    const stakedAmount = stakedAccountInfo.value.uiAmount!;

    const today = normalizeTimestamp(Math.floor(Date.now() / 1000)); // normalize to start of day UTC

    const dailyDistributionHistoryLength = program.constants.dailyDistributionDataHistoryLength.toNumber();

    const daysSinceLastClaim = getDaysSinceLastClaim({ program, userData });

    const { buffer: historicDistributionsBuffer, position } = globalData.dailyDistribution.historicDistributions as {
        buffer: HistoricDistribution[];
        position: BN;
    };

    const historicDistributions = { buffer: historicDistributionsBuffer, position: position.toNumber() };

    const { overallRate, totalUbiYield } = [
        ...ringBufferGetLastN(historicDistributions, dailyDistributionHistoryLength, daysSinceLastClaim),
    ]
        .map((dayData) => ({ yieldRate: dayData.yieldRate, ubiYield: dayData.ubiYield.toNumber() }))
        .reduce(
            (acc, dayData) => {
                acc.overallRate += dayData.yieldRate;
                acc.totalUbiYield += dayData.ubiYield;
                return acc;
            },
            { overallRate: 0, totalUbiYield: 0 },
        );

    const isVerified =
        userData.lastVerifiedTimestamp.toNumber() + program.constants.verificationDuration.toNumber() > today;

    return stakedAmount * overallRate + (isVerified ? totalUbiYield : 0);
}

// overloads
export function getDaysSinceLastClaim({
    program,
    user,
}: {
    program: ComptokenProgram;
    user: PublicKey;
}): Promise<number>;
export function getDaysSinceLastClaim({
    program,
    userData,
}: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number;

// implementation
export function getDaysSinceLastClaim({
    program,
    user,
    userData,
}: {
    program: ComptokenProgram;
    user?: PublicKey;
    userData?: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number | Promise<number> {
    const compute = function (lastClaimedTimestamp: number) {
        const daysSinceLastClaimUncapped =
            normalizeTimestamp(Date.now() / 1000) - normalizeTimestamp(lastClaimedTimestamp);

        return daysSinceLastClaimUncapped % program.constants.dailyDistributionDataHistoryLength.toNumber();
    };

    if (userData === undefined) {
        if (user === undefined) throw new Error("Either user or userData must be provided");
        const userDataAddress = addresses.getUserDataAddress(program, user);

        return program.account.userData
            .fetch(userDataAddress)
            .then((ud) => compute(ud.lastClaimedTimestamp.toNumber()));
    }

    return compute(userData.lastClaimedTimestamp.toNumber());
}

// overloads
export function isVerifiedHuman({
    program,
    user,
}: {
    program: ComptokenProgram;
    user: PublicKey;
}): boolean | Promise<boolean>;
export function isVerifiedHuman({
    program,
    userData,
}: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): boolean | Promise<boolean>;

// implementation
export function isVerifiedHuman({
    program,
    user,
    userData,
}: {
    program: ComptokenProgram;
    user?: PublicKey;
    userData?: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): boolean | Promise<boolean> {
    const isStillVerified = function (lastVerifiedTimestamp: number) {
        return (
            lastVerifiedTimestamp + program.constants.verificationDuration.toNumber() <
            normalizeTimestamp(Date.now() / 1000)
        );
    };

    if (user === undefined) {
        if (userData === undefined) throw new Error("Either user or userData must be provided");
        return isStillVerified(getDaysSinceLastClaim({ program, userData }) as number);
    }

    return (getDaysSinceLastClaim({ program, user }) as Promise<number>).then(isStillVerified as any);
}
