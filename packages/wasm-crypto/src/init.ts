// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CreatePromise } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from './types';

import { Bridge, Wbg } from '@polkadot/wasm-bridge';
import { init } from '@polkadot/wasm-crypto-init';

export const bridge = new Bridge<WasmCryptoInstance>(
  (b) => ({ ...new Wbg(b) }),
  (w) => init(w) as unknown as CreatePromise<WasmCryptoInstance>
);

export async function initWasm (initOverride?: (wbg: WebAssembly.ModuleImports) => CreatePromise<unknown>): Promise<WasmCryptoInstance> {
  return bridge.initWasm(initOverride as never);
}
