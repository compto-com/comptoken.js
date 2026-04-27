import type { default as anchor, BorshAccountsCoder, BorshCoder, IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import type { BorshTypesCoder } from "@coral-xyz/anchor/dist/cjs/coder/borsh/types.js";
import type { IdlAccount, IdlTypeDef } from "@coral-xyz/anchor/dist/cjs/idl.js";

type SnakeToPascalCase<S extends string> = S extends `${infer First}_${infer Rest}`
    ? `${Capitalize<First>}${SnakeToPascalCase<Capitalize<Rest>>}`
    : Capitalize<S>;

type SnakeToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
    ? `${Uncapitalize<First>}${SnakeToPascalCase<Capitalize<Rest>>}`
    : Uncapitalize<S>;

type CamelToSnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
    ? `${First extends Capitalize<First> ? "_" : ""}${Lowercase<First>}${CamelToSnakeCase<Rest>}`
    : Lowercase<S>;

type RustToTypeScript<S extends string> = S extends `${infer First}::${infer Rest}`
    ? `${SnakeToCamelCase<First>}::${RustToTypeScript<Rest>}`
    : SnakeToCamelCase<S>;

type TypeScriptToRust<S extends string> = S extends `${infer First}::${infer Rest}`
    ? `${CamelToSnakeCase<First>}::${TypeScriptToRust<Rest>}`
    : S;

type AccountNames<Idl extends anchor.Idl> = Extract<
    Idl["accounts"] extends IdlAccount[] ? Idl["accounts"][number]["name"] : never,
    string
>;
type TypeNames<Idl extends anchor.Idl> = RustToTypeScript<
    Extract<Idl["types"] extends IdlTypeDef[] ? Idl["types"][number]["name"] : never, string>
>;

type AccountType<Idl extends anchor.Idl, A extends AccountNames<Idl>> = IdlAccounts<Idl>[A];
type TypeType<Idl extends anchor.Idl, T extends TypeNames<Idl>> = IdlTypes<Idl>[TypeScriptToRust<T>];

type BetterAccountsCoder<Idl extends anchor.Idl> = Omit<
    BorshAccountsCoder<AccountNames<Idl>>,
    "encode" | "decode" | "decodeUnchecked" | "decodeAny"
> & {
    encode<Name extends AccountNames<Idl>>(accountName: Name, account: AccountType<Idl, Name>): Promise<Buffer>;
    decode<Name extends AccountNames<Idl>>(accountName: Name, data: Buffer): AccountType<Idl, Name>;
    decodeUnchecked<Name extends AccountNames<Idl>>(accountName: Name, data: Buffer): AccountType<Idl, Name>;
    decodeAny<T extends IdlAccounts<Idl>[AccountNames<Idl>]>(data: Buffer): T;
};

type BetterTypesCoder<Idl extends anchor.Idl> = Omit<BorshTypesCoder<TypeNames<Idl>>, "encode" | "decode"> & {
    encode<TypeN extends TypeNames<Idl>>(typeName: TypeN, type: TypeType<Idl, TypeN>): Promise<Buffer>;
    decode<TypeN extends TypeNames<Idl>>(typeName: TypeN, data: Buffer): TypeType<Idl, TypeN>;
};

export type BetterBorshCoder<Idl extends anchor.Idl> = Omit<
    BorshCoder<AccountNames<Idl>, TypeNames<Idl>>,
    "accounts" | "types"
> & {
    accounts: BetterAccountsCoder<Idl>;
    types: BetterTypesCoder<Idl>;
};
