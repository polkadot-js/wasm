// Copyright 2019-2022 @polkadot/wasm-bundle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn, InitPromise, InitResult, WasmBaseInstance } from './types';

import { assert } from '@polkadot/util';

export function createWasmFn <C extends WasmBaseInstance> (root: string, wasmBytes: null | Uint8Array, asmFn: null | ((wbg: WebAssembly.ModuleImports) => C)): InitFn<C> {
  return async (wbg: WebAssembly.ModuleImports): InitPromise<C> => {
    const result: InitResult<C> = {
      error: null,
      type: 'none',
      wasm: null
    };

    try {
      assert(typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

      const source = await WebAssembly.instantiate(wasmBytes, { wbg });

      result.wasm = source.instance.exports as unknown as C;
      result.type = 'wasm';
    } catch (error) {
      // if we have a valid supplied asm.js, return that
      if (asmFn) {
        result.wasm = asmFn(wbg);
        result.type = 'asm';
      } else {
        result.error = `FATAL: Unable to initialize @polkadot/wasm-${root}:: ${(error as Error).message}`;

        console.error(result.error);
      }
    }

    return result;
  };
}
