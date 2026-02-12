import { default as anchor, Program, type Coder, type CustomAccountResolver, type Provider } from "@coral-xyz/anchor";
import { convertIdlToCamelCase } from "@coral-xyz/anchor/dist/cjs/idl.js";
import type {
    IdlConst,
    IdlInstruction,
    IdlType,
    IdlTypeArray,
    IdlTypeCOption,
    IdlTypeDefined,
    IdlTypeOption,
    IdlTypeVec,
} from "@coral-xyz/anchor/dist/cjs/idl.ts";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

const { bs58 } = anchor.utils.bytes;

export class ProgramWithConstants<Idl extends anchor.Idl> extends Program<Idl> {
    constants: Constants<Idl["constants"]>;

    constructor(
        idl: Idl,
        provider?: Provider,
        coder?: Coder,
        getCustomResolver?: (instruction: IdlInstruction) => CustomAccountResolver<Idl> | undefined,
    ) {
        super(idl, provider, coder, getCustomResolver);

        this.constants = getConstants(this.idl);
    }
}

export function getConstants<Idl extends anchor.Idl>(idl: Idl): Constants<Idl["constants"]> {
    const rawConstants = convertIdlToCamelCase(idl).constants;
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

function constantToValue(constant: IdlConst): IdlTypeToJSType<IdlConst> {
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
            if (typeof constant.type === "object") {
                if ("defined" in constant.type) {
                    return constantDefinedToValue({ ...constant, type: constant.type });
                } else if ("array" in constant.type) {
                    const type = constant.type.array[0];
                    const arr = JSON.parse(constant.value) as any[];
                    return arr.map((item) =>
                        constantToValue({ name: constant.name, type, value: JSON.stringify(item) }),
                    );
                } else if ("vec" in constant.type) {
                    const type = constant.type.vec;
                    const arr = JSON.parse(constant.value) as any[];
                    return arr.map((item) =>
                        constantToValue({ name: constant.name, type, value: JSON.stringify(item) }),
                    );
                } else if ("option" in constant.type) {
                    if (constant.value === "null") {
                        return null;
                    }
                    const type = constant.type.option;
                    return constantToValue({ name: constant.name, type, value: constant.value });
                } else if ("coption" in constant.type) {
                    if (constant.value === "null") {
                        return null;
                    }
                    const type = constant.type.coption;
                    return constantToValue({ name: constant.name, type, value: constant.value });
                }
            }
            throw new Error(`Unknown constant type: ${JSON.stringify(constant.type)}`);
    }
}

function constantDefinedToValue(constant: { name: string; type: IdlTypeDefined; value: string }) {
    switch (constant.type.defined.name) {
        case "Hash":
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

type IdlTypeToJSType<T extends { type: IdlType }> = T extends { type: IdlBNTypes }
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
              : T extends { type: IdlTypeDefined }
                ? IdlTypeDefinedToJSType<T>
                : T extends { type: IdlTypeArray }
                  ? IdlTypeToJSType<{ type: T["type"]["array"][0] }>[]
                  : T extends { type: IdlTypeVec }
                    ? IdlTypeToJSType<{ type: T["type"]["vec"] }>[]
                    : T extends { type: IdlTypeOption }
                      ? IdlTypeToJSType<{ type: T["type"]["option"] }> | null
                      : T extends { type: IdlTypeCOption }
                        ? IdlTypeToJSType<{ type: T["type"]["coption"] }> | null
                        : unknown;

type IdlTypeDefinedToJSType<T extends { type: IdlTypeDefined }> = T extends { type: { defined: { name: "hash" } } }
    ? Uint8Array
    : unknown;

type Constants<ConstantsType extends anchor.Idl["constants"]> = ConstantsType extends IdlConst[]
    ? { [key in ConstantsType[number] as key["name"]]: IdlTypeToJSType<key> }
    : {};
