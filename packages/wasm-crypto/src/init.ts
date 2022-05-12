// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from '@polkadot/wasm-crypto-init/types';

import { Bridge } from '@polkadot/wasm-bridge';
import { createWasm } from '@polkadot/wasm-crypto-init';

export const bridge = new Bridge<WasmCryptoInstance>(createWasm);

export async function initBridge (createWasm?: InitFn<WasmCryptoInstance>): Promise<WasmCryptoInstance | null> {
  return bridge.init(createWasm);
}
