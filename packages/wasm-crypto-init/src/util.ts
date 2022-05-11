// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitResult } from './types';

import { assert } from '@polkadot/util';

export function createInitFn (wasmBytes: null | Uint8Array, asmFn: null | ((wbg: WebAssembly.ModuleImports) => unknown)): (wbg: WebAssembly.ModuleImports) => Promise<InitResult> {
  return async (wbg: WebAssembly.ModuleImports): Promise<InitResult> => {
    const result: InitResult = {
      type: 'wasm',
      wasm: null
    };

    try {
      assert(typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

      const source = await WebAssembly.instantiate(wasmBytes, { wbg });

      result.wasm = source.instance.exports;
    } catch (error) {
      // if we have a valid supplied asm.js, return that
      if (asmFn) {
        result.type = 'asm';
        result.wasm = asmFn(wbg);
      } else {
        console.error(`FATAL: Unable to initialize @polkadot/wasm-crypto:: ${(error as Error).message}`);

        result.wasm = null;
      }
    }

    return result;
  };
}
