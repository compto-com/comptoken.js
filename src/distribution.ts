import { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";

import * as addresses from "./addresses.js";
import type { ComptokenProgram } from "./types.js";
import { daysSinceEpoch, normalizeTimestamp, ringBufferGetLastN } from "./utils.js";

export type HistoricDistribution = {
    yieldRate: number;
    ubiYield: BN;
};

export async function getDistributionOwed({
    program,
    user,
}: {
    program: ComptokenProgram;
    user: PublicKey;
    userUnstakedTokenAccount?: PublicKey;
}): Promise<{ interest: number; ubi: number }> {
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

    return { interest: stakedAmount * overallRate, ubi: isVerified ? totalUbiYield : 0 };
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
        const daysSinceLastClaimUncapped = daysSinceEpoch(Date.now() / 1000) - daysSinceEpoch(lastClaimedTimestamp);

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
export function getDaysSinceLastVerified({
    program,
    user,
}: {
    program: ComptokenProgram;
    user: PublicKey;
}): Promise<number>;
export function getDaysSinceLastVerified({
    program,
    userData,
}: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number;

// implementation
export function getDaysSinceLastVerified({
    program,
    user,
    userData,
}: {
    program: ComptokenProgram;
    user?: PublicKey;
    userData?: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number | Promise<number> {
    const compute = function (lastVerifiedTimestamp: number) {
        const daysSinceLastVerifiedUncapped = daysSinceEpoch(Date.now() / 1000) - daysSinceEpoch(lastVerifiedTimestamp);

        return daysSinceLastVerifiedUncapped % program.constants.dailyDistributionDataHistoryLength.toNumber();
    };

    if (userData === undefined) {
        if (user === undefined) throw new Error("Either user or userData must be provided");
        const userDataAddress = addresses.getUserDataAddress(program, user);

        return program.account.userData
            .fetch(userDataAddress)
            .then((ud) => compute(ud.lastVerifiedTimestamp.toNumber()));
    }

    return compute(userData.lastVerifiedTimestamp.toNumber());
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
            lastVerifiedTimestamp + program.constants.verificationDuration.toNumber() >
            normalizeTimestamp(Date.now() / 1000)
        );
    };

    if (user === undefined) {
        if (userData === undefined) {
            throw new Error("Either user or userData must be provided");
        }
        return isStillVerified(getDaysSinceLastVerified({ program, userData }));
    }

    return getDaysSinceLastVerified({ program, user }).then(isStillVerified);
}

export type HistoricDistributionsWithStatus = {
    distributions: HistoricDistribution[];
    isUpToDate: boolean;
    lastUpdateTimestamp: number;
    expectedTimestamp: number;
};

export async function getHistoricDistributionsWithStatus({
    program,
    days = program.constants.dailyDistributionDataHistoryLength.toNumber(),
}: {
    program: ComptokenProgram;
    days?: number;
}): Promise<HistoricDistributionsWithStatus> {
    const globalDataAddress = addresses.getGlobalDataAddress(program);
    const globalData = await program.account.globalData.fetch(globalDataAddress);

    const lastUpdateTimestamp = globalData.dailyDistribution.lastUpdateTimestamp.toNumber();
    const expectedTimestamp = normalizeTimestamp(Math.floor(Date.now() / 1000));

    const { buffer: historicDistributionsBuffer, position } = globalData.dailyDistribution.historicDistributions as {
        buffer: HistoricDistribution[];
        position: BN;
    };

    const historicDistributions = { buffer: historicDistributionsBuffer, position: position.toNumber() };
    const distributions = [
        ...ringBufferGetLastN(
            historicDistributions,
            program.constants.dailyDistributionDataHistoryLength.toNumber(),
            days,
        ),
    ];

    return {
        distributions,
        isUpToDate: lastUpdateTimestamp === expectedTimestamp,
        lastUpdateTimestamp,
        expectedTimestamp,
    };
}

export async function getHistoricDistributions({
    program,
    days = program.constants.dailyDistributionDataHistoryLength.toNumber(),
}: {
    program: ComptokenProgram;
    days?: number;
}): Promise<HistoricDistribution[]> {
    const historicDistributions = await getHistoricDistributionsWithStatus({ program, days });

    if (!historicDistributions.isUpToDate) {
        throw new Error("Historic distributions are not up to date");
    }

    return historicDistributions.distributions;
}
