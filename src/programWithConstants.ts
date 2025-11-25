import { default as anchor, BN, Program, type Provider } from "@coral-xyz/anchor";
import type { IdlConst, IdlInstruction, IdlType, IdlTypeDefined } from "@coral-xyz/anchor/dist/cjs/idl.ts";
import { PublicKey } from "@solana/web3.js";
const { bs58 } = anchor.utils.bytes;

export class ProgramWithConstants<Idl extends anchor.Idl> extends Program<Idl> {
    constants: Constants<Idl["constants"]>;

    constructor(
        idl: Idl,
        provider?: Provider,
        coder?: anchor.Coder,
        getCustomResolver?: (instruction: IdlInstruction) => anchor.CustomAccountResolver<Idl> | undefined,
    ) {
        super(idl, provider, coder, getCustomResolver);

        this.constants = getConstants(this);
    }
}

function getConstants<Idl extends anchor.Idl>(program: Program<Idl>): Constants<Idl["constants"]> {
    const rawConstants = program.idl.constants;
    if (!rawConstants) {
        return {} as Constants<Idl["constants"]>;
    }
    const constants: Constants<Idl["constants"]> = {} as any;
    for (const constant of rawConstants) {
        // @ts-ignore - unsure why ts is unhappy here, it infers unknown instead of the mapped type
        constants[constant.name] = constantToValue(constant);
    }
    return constants;
}

function constantToValue(constant: IdlConst): IdlTypeToJSType<IdlConst["type"]> {
    switch (constant.type) {
        // potentially too big for number
        case "u64":
        case "i64":
        case "u128":
        case "i128":
        case "u256":
        case "i256":
            return new BN(constant.value);

        case "string":
            return constant.value;

        case "pubkey":
            return new PublicKey(constant.value);

        case "bytes":
            return Uint8Array.from(JSON.parse(constant.value));

        case "f64":
        case "f32":
            return parseFloat(constant.value);

        case "u8":
        case "i8":
        case "u16":
        case "i16":
        case "u32":
        case "i32":
            return parseInt(constant.value);

        case "bool":
            return constant.value === "true";

        default:
            if (typeof constant.type === "object" && "defined" in constant.type) {
                return constantDefinedToValue({ ...constant, type: constant.type });
            }
            throw new Error(`Unknown constant type: ${JSON.stringify(constant.type)}`);
    }
}

function constantDefinedToValue(constant: { name: string; type: IdlTypeDefined; value: string }): any {
    switch (constant.type.defined.name) {
        case "hash": {
            // Hash(<hash in base64?>)
            const buf = bs58.decode(constant.value.slice(5, -1));
            return Uint8Array.from(buf);
        }
    }
    throw new Error(`Unknown defined constant type: ${constant.type.defined.name}`);
}

//IdlTypeOption | IdlTypeCOption | IdlTypeDefined | IdlTypeGeneric | IdlTypeVec | IdlTypeArray;
type IdlBNTypes = "u64" | "i64" | "u128" | "i128" | "u256" | "i256";
type IdlStringType = "string";
type IdlBytesType = "bytes";
type IdlNumberType = "f64" | "f32" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32";
type IdlBooleanType = "bool";
type IdlPublicKeyType = "pubkey";

type IdlTypeToJSType<T extends IdlType> = T extends { type: IdlBNTypes }
    ? BN
    : T extends { type: IdlStringType }
    ? string
    : T extends { type: IdlBytesType }
    ? Uint8Array
    : T extends { type: IdlNumberType }
    ? number
    : T extends { type: IdlBooleanType }
    ? boolean
    : T extends { type: IdlPublicKeyType }
    ? PublicKey
    : unknown;

type Constants<ConstantsType extends anchor.Idl["constants"]> = ConstantsType extends IdlConst[]
    ? {
          [key in ConstantsType[number] as key["name"]]: key extends { type: IdlBNTypes }
              ? BN
              : key extends { type: IdlStringType }
              ? string
              : key extends { type: IdlBytesType }
              ? Uint8Array
              : key extends { type: IdlNumberType }
              ? number
              : key extends { type: IdlBooleanType }
              ? boolean
              : key extends { type: IdlPublicKeyType }
              ? PublicKey
              : unknown;
      }
    : {};
