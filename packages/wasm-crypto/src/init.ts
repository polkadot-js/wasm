// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from '@polkadot/wasm-crypto-init/types';

import { Bridge } from '@polkadot/wasm-bridge';
import { createWasm } from '@polkadot/wasm-crypto-init';

/**
 * @name bridge
 * @description
 * The JS <-> WASM bridge that is in operation. For the specific package
 * it is a global, i.e. all operations happens on this specific bridge
 */
export const bridge = new Bridge<WasmCryptoInstance>(createWasm);

/**
 * @name initBridge
 * @description
 * Creates a new bridge interface with the (optional) initialization function
 */
export async function initBridge (createWasm?: InitFn<WasmCryptoInstance>): Promise<WasmCryptoInstance | null> {
  return bridge.init(createWasm);
}
