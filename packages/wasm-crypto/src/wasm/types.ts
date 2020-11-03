// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

// wasm-pack build output (formatted) from pkg/wasm_bg.d.ts
export interface WasmCryptoInstance {
  memory: WebAssembly.Memory;

  __wbindgen_free(a: number, b: number): void;
  __wbindgen_malloc(a: number): number;
  __wbindgen_realloc(a: number, b: number, c: number): number;
  __wbindgen_exn_store(a: number): void;

  ext_bip39_generate(a: number, b: number): void;
  ext_bip39_to_entropy(a: number, b: number, c: number): void;
  ext_bip39_to_mini_secret(a: number, b: number, c: number, d: number, e: number): void;
  ext_bip39_to_seed(a: number, b: number, c: number, d: number, e: number): void;
  ext_bip39_validate(a: number, b: number): number;
  ext_ed_from_seed(a: number, b: number, c: number): void;
  ext_ed_sign(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
  ext_ed_verify(a: number, b: number, c: number, d: number, e: number, f: number): number;
  ext_blake2b(a: number, b: number, c: number, d: number, e: number, f: number): void;
  ext_keccak256(a: number, b: number, c: number): void;
  ext_pbkdf2(a: number, b: number, c: number, d: number, e: number, f: number): void;
  ext_scrypt(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number): void;
  ext_sha512(a: number, b: number, c: number): void;
  ext_twox(a: number, b: number, c: number, d: number): void;
  ext_sr_derive_keypair_hard(a: number, b: number, c: number, d: number, e: number): void;
  ext_sr_derive_keypair_soft(a: number, b: number, c: number, d: number, e: number): void;
  ext_sr_derive_public_soft(a: number, b: number, c: number, d: number, e: number): void;
  ext_sr_from_seed(a: number, b: number, c: number): void;
  ext_sr_sign(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
  ext_sr_verify(a: number, b: number, c: number, d: number, e: number, f: number): number;
}
