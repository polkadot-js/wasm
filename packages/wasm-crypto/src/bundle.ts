// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WasmCryptoInstance } from '@polkadot/wasm-crypto-init/types';

import { bridge, initBridge } from './init.js';

export { packageInfo } from './packageInfo.js';
export { bridge };

// Removes the first parameter (expected as WasmCryptoInstance) and leaves the
// rest of the parameters in-tack. This allows us to dynamically create a function
// return from the withWasm helper
type PopFirst<T extends unknown[]> =
  T extends [WasmCryptoInstance, ...infer N]
    ? N
    : [];

/**
 * @internal
 * @description
 * This create an extenal interface function from the signature, all the while checking
 * the actual bridge wasm interface to ensure it has been initialized.
 *
 * This means that we can call it
 *
 *   withWasm(wasm: WasmCryptoInstance, a: number, b: string) => Uint8Array
 *
 * and in this case it will create an interface function with the signarure
 *
 *   (a: number, b: string) => Uint8Array
 */
function withWasm <T, F extends (wasm: WasmCryptoInstance, ...params: never[]) => T> (fn: F): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    if (!bridge.wasm) {
      throw new Error('The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.');
    }

    return fn(bridge.wasm, ...params) as ReturnType<F>;
  };
}

export const bip39Generate = /*#__PURE__*/ withWasm((wasm, words: 12 | 15 | 18 | 21 | 24): string => {
  wasm.ext_bip39_generate(8, words);

  return bridge.resultString();
});

export const bip39ToEntropy = /*#__PURE__*/ withWasm((wasm, phrase: string): Uint8Array => {
  wasm.ext_bip39_to_entropy(8, ...bridge.allocString(phrase));

  return bridge.resultU8a();
});

export const bip39ToMiniSecret = /*#__PURE__*/ withWasm((wasm, phrase: string, password: string): Uint8Array => {
  wasm.ext_bip39_to_mini_secret(8, ...bridge.allocString(phrase), ...bridge.allocString(password));

  return bridge.resultU8a();
});

export const bip39ToSeed = /*#__PURE__*/ withWasm((wasm, phrase: string, password: string): Uint8Array => {
  wasm.ext_bip39_to_seed(8, ...bridge.allocString(phrase), ...bridge.allocString(password));

  return bridge.resultU8a();
});

export const bip39Validate = /*#__PURE__*/ withWasm((wasm, phrase: string): boolean => {
  const ret = wasm.ext_bip39_validate(...bridge.allocString(phrase));

  return ret !== 0;
});

export const ed25519KeypairFromSeed = /*#__PURE__*/ withWasm((wasm, seed: Uint8Array): Uint8Array => {
  wasm.ext_ed_from_seed(8, ...bridge.allocU8a(seed));

  return bridge.resultU8a();
});

export const ed25519Sign = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array, seckey: Uint8Array, message: Uint8Array): Uint8Array => {
  wasm.ext_ed_sign(8, ...bridge.allocU8a(pubkey), ...bridge.allocU8a(seckey), ...bridge.allocU8a(message));

  return bridge.resultU8a();
});

export const ed25519Verify = /*#__PURE__*/ withWasm((wasm, signature: Uint8Array, message: Uint8Array, pubkey: Uint8Array): boolean => {
  const ret = wasm.ext_ed_verify(...bridge.allocU8a(signature), ...bridge.allocU8a(message), ...bridge.allocU8a(pubkey));

  return ret !== 0;
});

export const secp256k1FromSeed = /*#__PURE__*/ withWasm((wasm, seckey: Uint8Array): Uint8Array => {
  wasm.ext_secp_from_seed(8, ...bridge.allocU8a(seckey));

  return bridge.resultU8a();
});

export const secp256k1Compress = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array): Uint8Array => {
  wasm.ext_secp_pub_compress(8, ...bridge.allocU8a(pubkey));

  return bridge.resultU8a();
});

export const secp256k1Expand = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array): Uint8Array => {
  wasm.ext_secp_pub_expand(8, ...bridge.allocU8a(pubkey));

  return bridge.resultU8a();
});

export const secp256k1Recover = /*#__PURE__*/ withWasm((wasm, msgHash: Uint8Array, sig: Uint8Array, recovery: number): Uint8Array => {
  wasm.ext_secp_recover(8, ...bridge.allocU8a(msgHash), ...bridge.allocU8a(sig), recovery);

  return bridge.resultU8a();
});

export const secp256k1Sign = /*#__PURE__*/ withWasm((wasm, msgHash: Uint8Array, seckey: Uint8Array): Uint8Array => {
  wasm.ext_secp_sign(8, ...bridge.allocU8a(msgHash), ...bridge.allocU8a(seckey));

  return bridge.resultU8a();
});

export const sr25519DeriveKeypairHard = /*#__PURE__*/ withWasm((wasm, pair: Uint8Array, cc: Uint8Array): Uint8Array => {
  wasm.ext_sr_derive_keypair_hard(8, ...bridge.allocU8a(pair), ...bridge.allocU8a(cc));

  return bridge.resultU8a();
});

export const sr25519DeriveKeypairSoft = /*#__PURE__*/ withWasm((wasm, pair: Uint8Array, cc: Uint8Array): Uint8Array => {
  wasm.ext_sr_derive_keypair_soft(8, ...bridge.allocU8a(pair), ...bridge.allocU8a(cc));

  return bridge.resultU8a();
});

export const sr25519DerivePublicSoft = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array, cc: Uint8Array): Uint8Array => {
  wasm.ext_sr_derive_public_soft(8, ...bridge.allocU8a(pubkey), ...bridge.allocU8a(cc));

  return bridge.resultU8a();
});

export const sr25519KeypairFromSeed = /*#__PURE__*/ withWasm((wasm, seed: Uint8Array): Uint8Array => {
  wasm.ext_sr_from_seed(8, ...bridge.allocU8a(seed));

  return bridge.resultU8a();
});

export const sr25519Sign = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array, secret: Uint8Array, message: Uint8Array): Uint8Array => {
  wasm.ext_sr_sign(8, ...bridge.allocU8a(pubkey), ...bridge.allocU8a(secret), ...bridge.allocU8a(message));

  return bridge.resultU8a();
});

export const sr25519Verify = /*#__PURE__*/ withWasm((wasm, signature: Uint8Array, message: Uint8Array, pubkey: Uint8Array): boolean => {
  const ret = wasm.ext_sr_verify(...bridge.allocU8a(signature), ...bridge.allocU8a(message), ...bridge.allocU8a(pubkey));

  return ret !== 0;
});

export const sr25519Agree = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array, secret: Uint8Array): Uint8Array => {
  wasm.ext_sr_agree(8, ...bridge.allocU8a(pubkey), ...bridge.allocU8a(secret));

  return bridge.resultU8a();
});

export const vrfSign = /*#__PURE__*/ withWasm((wasm, secret: Uint8Array, context: Uint8Array, message: Uint8Array, extra: Uint8Array): Uint8Array => {
  wasm.ext_vrf_sign(8, ...bridge.allocU8a(secret), ...bridge.allocU8a(context), ...bridge.allocU8a(message), ...bridge.allocU8a(extra));

  return bridge.resultU8a();
});

export const vrfVerify = /*#__PURE__*/ withWasm((wasm, pubkey: Uint8Array, context: Uint8Array, message: Uint8Array, extra: Uint8Array, outAndProof: Uint8Array): boolean => {
  const ret = wasm.ext_vrf_verify(...bridge.allocU8a(pubkey), ...bridge.allocU8a(context), ...bridge.allocU8a(message), ...bridge.allocU8a(extra), ...bridge.allocU8a(outAndProof));

  return ret !== 0;
});

export const blake2b = /*#__PURE__*/ withWasm((wasm, data: Uint8Array, key: Uint8Array, size: number): Uint8Array => {
  wasm.ext_blake2b(8, ...bridge.allocU8a(data), ...bridge.allocU8a(key), size);

  return bridge.resultU8a();
});

export const hmacSha256 = /*#__PURE__*/ withWasm((wasm, key: Uint8Array, data: Uint8Array): Uint8Array => {
  wasm.ext_hmac_sha256(8, ...bridge.allocU8a(key), ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const hmacSha512 = /*#__PURE__*/ withWasm((wasm, key: Uint8Array, data: Uint8Array): Uint8Array => {
  wasm.ext_hmac_sha512(8, ...bridge.allocU8a(key), ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const keccak256 = /*#__PURE__*/ withWasm((wasm, data: Uint8Array): Uint8Array => {
  wasm.ext_keccak256(8, ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const keccak512 = /*#__PURE__*/ withWasm((wasm, data: Uint8Array): Uint8Array => {
  wasm.ext_keccak512(8, ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const pbkdf2 = /*#__PURE__*/ withWasm((wasm, data: Uint8Array, salt: Uint8Array, rounds: number): Uint8Array => {
  wasm.ext_pbkdf2(8, ...bridge.allocU8a(data), ...bridge.allocU8a(salt), rounds);

  return bridge.resultU8a();
});

export const scrypt = /*#__PURE__*/ withWasm((wasm, password: Uint8Array, salt: Uint8Array, log2n: number, r: number, p: number): Uint8Array => {
  wasm.ext_scrypt(8, ...bridge.allocU8a(password), ...bridge.allocU8a(salt), log2n, r, p);

  return bridge.resultU8a();
});

export const sha256 = /*#__PURE__*/ withWasm((wasm, data: Uint8Array): Uint8Array => {
  wasm.ext_sha256(8, ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const sha512 = /*#__PURE__*/ withWasm((wasm, data: Uint8Array): Uint8Array => {
  wasm.ext_sha512(8, ...bridge.allocU8a(data));

  return bridge.resultU8a();
});

export const twox = /*#__PURE__*/ withWasm((wasm, data: Uint8Array, rounds: number) => {
  wasm.ext_twox(8, ...bridge.allocU8a(data), rounds);

  return bridge.resultU8a();
});

export function isReady (): boolean {
  return !!bridge.wasm;
}

export async function waitReady (): Promise<boolean> {
  try {
    const wasm = await initBridge();

    return !!wasm;
  } catch {
    return false;
  }
}
