// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { WasmCryptoInstance } from './types';

import { assert, stringToU8a, u8aToString } from '@polkadot/util';

import { __internal } from './cjs/internal.js';

type PopFirst<T extends unknown[]> =
  T extends [WasmCryptoInstance, ...infer N]
    ? N
    : [];

export function withWasm <T, F extends (wasm: WasmCryptoInstance, ...params: never[]) => T> (fn: F): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    assert(__internal.wasm, 'The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.');

    return fn(__internal.wasm, ...params) as ReturnType<F>;
  };
}

export function getWasm (): WasmCryptoInstance {
  return __internal.wasm!;
}

export function getInt32 (): Int32Array {
  if (__internal.cachegetInt32 === null || __internal.cachegetInt32.buffer !== __internal.wasm!.memory.buffer) {
    __internal.cachegetInt32 = new Int32Array(__internal.wasm!.memory.buffer);
  }

  return __internal.cachegetInt32;
}

export function getUint8 (): Uint8Array {
  if (__internal.cachegetUint8 === null || __internal.cachegetUint8.buffer !== __internal.wasm!.memory.buffer) {
    __internal.cachegetUint8 = new Uint8Array(__internal.wasm!.memory.buffer);
  }

  return __internal.cachegetUint8;
}

export function getU8a (ptr: number, len: number): Uint8Array {
  return getUint8().subarray(ptr / 1, ptr / 1 + len);
}

export function getString (ptr: number, len: number): string {
  return u8aToString(getU8a(ptr, len));
}

export function allocU8a (arg: Uint8Array): [number, number] {
  const ptr = __internal.wasm!.__wbindgen_malloc(arg.length * 1);

  getUint8().set(arg, ptr / 1);

  return [ptr, arg.length];
}

export function allocString (arg: string): [number, number] {
  return allocU8a(stringToU8a(arg));
}

export function resultU8a (): Uint8Array {
  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  __internal.wasm!.__wbindgen_free(r0, r1 * 1);

  return ret;
}

export function resultString (): string {
  return u8aToString(resultU8a());
}
