// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

import { setPromise } from './init';

export function setWasmOnlyPromise (): Promise<void> {
  return setPromise(wasmBytes, null);
}
