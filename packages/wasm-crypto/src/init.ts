// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AsmCreator, WasmCryptoInstance } from './types';

import { assert } from '@polkadot/util';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

import { __internal } from './cjs/internal.js';
import * as imports from './imports';

async function createPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null): Promise<void> {
  try {
    assert(typeof WebAssembly !== 'undefined' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

    const source = await WebAssembly.instantiate(wasmBytes, { wbg: imports });

    __internal.wasm = source.instance.exports as unknown as WasmCryptoInstance;
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asmFn) {
      __internal.wasm = asmFn(imports);
    } else {
      console.error('FATAL: Unable to initialize @polkadot/wasm-crypto');
      console.error(error);

      __internal.wasm = null;
    }
  }
}

export function setPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null): Promise<void> {
  __internal.wasmPromise = createPromise(wasmBytes, asmFn);

  return __internal.wasmPromise;
}

export function setWasmOnlyPromise (): Promise<void> {
  return setPromise(wasmBytes, null);
}
