import { default as anchor, Program, type Coder, type CustomAccountResolver, type Provider } from "@coral-xyz/anchor";
import type { IdlConst, IdlInstruction, IdlType, IdlTypeArray, IdlTypeCOption, IdlTypeDefined, IdlTypeOption, IdlTypeVec } from "@coral-xyz/anchor/dist/cjs/idl.ts";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export declare class ProgramWithConstants<Idl extends anchor.Idl> extends Program<Idl> {
    constants: Constants<Idl["constants"]>;
    constructor(idl: Idl, provider?: Provider, coder?: Coder, getCustomResolver?: (instruction: IdlInstruction) => CustomAccountResolver<Idl> | undefined);
}
export declare function getConstants<Idl extends anchor.Idl>(idl: Idl): Constants<Idl["constants"]>;
type IdlBNTypes = "u64" | "i64" | "u128" | "i128" | "u256" | "i256";
type IdlStringType = "string";
type IdlBytesType = "bytes";
type IdlNumberType = "f64" | "f32" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32";
type IdlBooleanType = "bool";
type IdlPublicKeyType = "pubkey";
type IdlTypeToJSType<T extends {
    type: IdlType;
}> = T extends {
    type: IdlBNTypes;
} ? BN : T extends {
    type: IdlStringType;
} ? string : T extends {
    type: IdlBytesType;
} ? Uint8Array : T extends {
    type: IdlNumberType;
} ? number : T extends {
    type: IdlBooleanType;
} ? boolean : T extends {
    type: IdlPublicKeyType;
} ? PublicKey : T extends {
    type: IdlTypeDefined;
} ? IdlTypeDefinedToJSType<T> : T extends {
    type: IdlTypeArray;
} ? IdlTypeToJSType<{
    type: T["type"]["array"][0];
}>[] : T extends {
    type: IdlTypeVec;
} ? IdlTypeToJSType<{
    type: T["type"]["vec"];
}>[] : T extends {
    type: IdlTypeOption;
} ? IdlTypeToJSType<{
    type: T["type"]["option"];
}> | null : T extends {
    type: IdlTypeCOption;
} ? IdlTypeToJSType<{
    type: T["type"]["coption"];
}> | null : unknown;
type IdlTypeDefinedToJSType<T extends {
    type: IdlTypeDefined;
}> = T extends {
    type: {
        defined: {
            name: "hash";
        };
    };
} ? Uint8Array : unknown;
type Constants<ConstantsType extends anchor.Idl["constants"]> = ConstantsType extends IdlConst[] ? {
    [key in ConstantsType[number] as key["name"]]: IdlTypeToJSType<key>;
} : {};
export {};
//# sourceMappingURL=programWithConstants.d.ts.map