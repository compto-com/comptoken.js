import { default as anchor, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
const { bs58 } = anchor.utils.bytes;
export class ProgramWithConstants extends Program {
    constructor(idl, provider, coder, getCustomResolver) {
        super(idl, provider, coder, getCustomResolver);
        this.constants = getConstants(this.idl);
    }
}
export function getConstants(idl) {
    const rawConstants = idl.constants;
    if (!rawConstants) {
        return {};
    }
    const constants = {};
    for (const constant of rawConstants) {
        // @ts-ignore - unsure why ts is unhappy here, it infers unknown instead of the mapped type
        constants[constant.name] = constantToValue(constant);
    }
    return constants;
}
function constantToValue(constant) {
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
                }
                else if ("array" in constant.type) {
                    const type = constant.type.array[0];
                    const arr = JSON.parse(constant.value);
                    return arr.map((item) => constantToValue({ name: constant.name, type, value: JSON.stringify(item) }));
                }
                else if ("vec" in constant.type) {
                    const type = constant.type.vec;
                    const arr = JSON.parse(constant.value);
                    return arr.map((item) => constantToValue({ name: constant.name, type, value: JSON.stringify(item) }));
                }
                else if ("option" in constant.type) {
                    if (constant.value === "null") {
                        return null;
                    }
                    const type = constant.type.option;
                    return constantToValue({ name: constant.name, type, value: constant.value });
                }
                else if ("coption" in constant.type) {
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
function constantDefinedToValue(constant) {
    switch (constant.type.defined.name) {
        case "hash": {
            // Hash(<hash in base64?>)
            const buf = bs58.decode(constant.value.slice(5, -1));
            return Uint8Array.from(buf);
        }
    }
    throw new Error(`Unknown defined constant type: ${constant.type.defined.name}`);
}
//# sourceMappingURL=programWithConstants.js.map