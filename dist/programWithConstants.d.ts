import { default as anchor, Program, type Provider } from "@coral-xyz/anchor";
import type { IdlConst, IdlInstruction } from "@coral-xyz/anchor/dist/cjs/idl.ts";
import { PublicKey } from "@solana/web3.js";
type BNType = anchor.BN;
export declare class ProgramWithConstants<Idl extends anchor.Idl> extends Program<Idl> {
    constants: Constants<Idl["constants"]>;
    constructor(idl: Idl, provider?: Provider, coder?: anchor.Coder, getCustomResolver?: (instruction: IdlInstruction) => anchor.CustomAccountResolver<Idl> | undefined);
}
type IdlBNTypes = "u64" | "i64" | "u128" | "i128" | "u256" | "i256";
type IdlStringType = "string";
type IdlBytesType = "bytes";
type IdlNumberType = "f64" | "f32" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32";
type IdlBooleanType = "bool";
type IdlPublicKeyType = "pubkey";
type Constants<ConstantsType extends anchor.Idl["constants"]> = ConstantsType extends IdlConst[] ? {
    [key in ConstantsType[number] as key["name"]]: key extends {
        type: IdlBNTypes;
    } ? BNType : key extends {
        type: IdlStringType;
    } ? string : key extends {
        type: IdlBytesType;
    } ? Uint8Array : key extends {
        type: IdlNumberType;
    } ? number : key extends {
        type: IdlBooleanType;
    } ? boolean : key extends {
        type: IdlPublicKeyType;
    } ? PublicKey : unknown;
} : {};
export {};
//# sourceMappingURL=programWithConstants.d.ts.map