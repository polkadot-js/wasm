// Copyright 2019-2023 @polkadot/wasm-bundle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn, InitPromise, InitResult, WasmBaseInstance, WasmImports } from './types.js';

/**
 * @name createWasmFn
 * @description
 * Create a WASM (or ASM.js) creator interface based on the supplied information.
 *
 * It will attempt to create a WASM interface first and if this fails or is not available in
 * the environment, will fallback to attempting to create an ASM.js interface.
 */
export function createWasmFn <C extends WasmBaseInstance> (root: 'crypto', wasmBytes: null | Uint8Array, asmFn: null | ((wbg: WasmImports) => C)): InitFn<C> {
  return async (wbg: WasmImports): InitPromise<C> => {
    const result: InitResult<C> = {
      error: null,
      type: 'none',
      wasm: null
    };

    try {
      if (!wasmBytes || !wasmBytes.length) {
        throw new Error('No WebAssembly provided for initialization');
      } else if (typeof WebAssembly !== 'object' || typeof WebAssembly.instantiate !== 'function') {
        throw new Error('WebAssembly is not available in your environment');
      }

      const source = await WebAssembly.instantiate(wasmBytes, { wbg });

      result.wasm = source.instance.exports as unknown as C;
      result.type = 'wasm';
    } catch (error) {
      // if we have a valid supplied asm.js, return that
      if (typeof asmFn === 'function') {
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
