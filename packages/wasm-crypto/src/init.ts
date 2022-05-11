// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BridgeBase, CreatePromise } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from '@polkadot/wasm-crypto-init/types';

import { Bridge, Wbg } from '@polkadot/wasm-bridge';
import { init } from '@polkadot/wasm-crypto-init';

function initWbg (bridge: BridgeBase<WasmCryptoInstance>): WebAssembly.ModuleImports {
  return { ...new Wbg(bridge) };
}

export const bridge = new Bridge<WasmCryptoInstance>(initWbg, init);

export async function initWasm (initOverride?: (wbg: WebAssembly.ModuleImports) => CreatePromise<WasmCryptoInstance>): Promise<WasmCryptoInstance> {
  return bridge.initWasm(initOverride);
}
