// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { init } from '@polkadot/wasm-crypto-init/wasm';

import { initBase } from './init';

export async function initWasm (): Promise<void> {
  await initBase(init);
}

initWasm().catch(undefined);
