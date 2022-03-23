// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AsmCreator, WasmCryptoInstance } from './types';

import { assert } from '@polkadot/util';

import { __bridge } from './bridge';
import * as wbg from './imports';

async function createPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null): Promise<void> {
  try {
    assert(typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

    const source = await WebAssembly.instantiate(wasmBytes, { wbg });

    __bridge.wasm = (source.instance.exports as unknown as WasmCryptoInstance);
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asmFn) {
      __bridge.type = 'asm';
      __bridge.wasm = asmFn(wbg);
    } else {
      console.error(`FATAL: Unable to initialize @polkadot/wasm-crypto:: ${(error as Error).message}`);

      __bridge.wasm = null;
    }
  }
}

export function setPromise (wasmBytes: Uint8Array | null, asmFn: AsmCreator | null, force = false): Promise<void> {
  if (!__bridge.wasmPromise || force) {
    __bridge.wasmPromise = createPromise(wasmBytes, asmFn);
  }

  return __bridge.wasmPromise;
}
