import { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { ComptokenProgram } from "./types.js";
export type HistoricDistribution = {
    yieldRate: number;
    ubiYield: BN;
};
export declare function getDistributionOwed({ program, user, }: {
    program: ComptokenProgram;
    user: PublicKey;
    userUnstakedTokenAccount?: PublicKey;
}): Promise<{
    interest: number;
    ubi: number;
}>;
export declare function getDaysSinceLastClaim({ program, user, }: {
    program: ComptokenProgram;
    user: PublicKey;
}): Promise<number>;
export declare function getDaysSinceLastClaim({ program, userData, }: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number;
export declare function getDaysSinceLastVerified({ program, user, }: {
    program: ComptokenProgram;
    user: PublicKey;
}): Promise<number>;
export declare function getDaysSinceLastVerified({ program, userData, }: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): number;
export declare function isVerifiedHuman({ program, user, }: {
    program: ComptokenProgram;
    user: PublicKey;
}): boolean | Promise<boolean>;
export declare function isVerifiedHuman({ program, userData, }: {
    program: ComptokenProgram;
    userData: Awaited<ReturnType<ComptokenProgram["account"]["userData"]["fetch"]>>;
}): boolean | Promise<boolean>;
export declare function getHistoricDistributions({ program, days, }: {
    program: ComptokenProgram;
    days?: number;
}): Promise<HistoricDistribution[]>;
//# sourceMappingURL=distribution.d.ts.map