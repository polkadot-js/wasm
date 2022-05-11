// Copyright 2019-2022 @polkadot/wasm-bundle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn, InitResult, WasmBaseInstance } from './types';

import { assert } from '@polkadot/util';

export function initWasm <C extends WasmBaseInstance> (root: string, wasmBytes: null | Uint8Array, asmFn: null | ((wbg: WebAssembly.ModuleImports) => C)): InitFn<C> {
  return async (wbg: WebAssembly.ModuleImports): Promise<InitResult<C>> => {
    const result: InitResult<C> = {
      type: 'wasm',
      wasm: null
    };

    try {
      assert(typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function' && wasmBytes && wasmBytes.length, 'WebAssembly is not available in your environment');

      const source = await WebAssembly.instantiate(wasmBytes, { wbg });

      result.wasm = source.instance.exports as unknown as C;
    } catch (error) {
      // if we have a valid supplied asm.js, return that
      if (asmFn) {
        result.type = 'asm';
        result.wasm = asmFn(wbg);
      } else {
        console.error(`FATAL: Unable to initialize @polkadot/${root}:: ${(error as Error).message}`);

        result.wasm = null;
      }
    }

    return result;
  };
}
