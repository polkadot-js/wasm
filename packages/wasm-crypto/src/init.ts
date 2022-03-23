// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AsmCreator, WasmCryptoInstance } from './types';

import { assert, isFunction } from '@polkadot/util';

import { __bridge } from './bridge';
import * as imports from './imports';

async function createPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null): Promise<void> {
  try {
    assert(typeof WebAssembly !== 'undefined' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

    const source = await WebAssembly.instantiate(wasmBytes, { wbg: imports });
    const exports = (source.instance.exports as unknown as WasmCryptoInstance);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert(isFunction(exports.ext_blake2b), 'Invalid instantiated WASM interface');

    __bridge.wasm = exports;
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asmFn) {
      __bridge.type = 'asm';
      __bridge.wasm = asmFn(imports);
    } else {
      console.error(`FATAL: Unable to initialize @polkadot/wasm-crypto:: ${(error as Error).message}`);

      __bridge.wasm = null;
    }
  }
}

export function setPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null): Promise<void> {
  if (!__bridge.wasmPromise) {
    __bridge.wasmPromise = createPromise(wasmBytes, asmFn);
  }

  return __bridge.wasmPromise;
}
