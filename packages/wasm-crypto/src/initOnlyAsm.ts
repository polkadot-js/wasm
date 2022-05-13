// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWasm } from '@polkadot/wasm-crypto-init/asm';

import { initBridge } from './init';

export async function initWasm (): Promise<void> {
  await initBridge(createWasm);
}

initWasm().catch((): void => {
  // cannot happen, initWasm doesn't throw
});
