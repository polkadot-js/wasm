// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitPromise } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from '@polkadot/wasm-crypto-init/types';

import { Bridge, Wbg } from '@polkadot/wasm-bridge';
import { init } from '@polkadot/wasm-crypto-init';

export const bridge = new Bridge<WasmCryptoInstance>((b) => ({ ...new Wbg(b) }), init);

export async function initBase (override?: (wbg: WebAssembly.ModuleImports) => InitPromise<WasmCryptoInstance>): Promise<WasmCryptoInstance | null> {
  return bridge.init(override);
}
