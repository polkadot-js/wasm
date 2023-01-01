// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWasm } from '@polkadot/wasm-crypto-init/none';

import { initBridge } from './init';

/**
 * @name initWasm
 * @description
 * For historic purposes and for tighter control on init, specifically performing
 * a WASM initialization with no interface whatsoever (no WASM, no ASM.js)
 *
 * Generally should not be used unless you want explicit control over which
 * interfaces are initialized.
 */
export async function initWasm (): Promise<void> {
  await initBridge(createWasm);
}

initWasm().catch((): void => {
  // cannot happen, initWasm doesn't throw
});
