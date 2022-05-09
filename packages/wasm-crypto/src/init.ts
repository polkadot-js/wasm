// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CreatePromise, WasmCryptoInstance } from './types';

import { init } from '@polkadot/wasm-crypto-init';

import { __bridge } from './bridge';
import * as wbg from './imports';

export async function initWasm (initOverride?: (wbg: WebAssembly.ModuleImports) => CreatePromise): Promise<void> {
  if (!__bridge.wasmPromise || initOverride) {
    __bridge.wasmPromise = (initOverride || init)(wbg);
  }

  __bridge.wasm = (await __bridge.wasmPromise).wasm as WasmCryptoInstance;
}
