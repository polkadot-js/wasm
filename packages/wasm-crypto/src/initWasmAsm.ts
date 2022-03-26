// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { asmJsInit } from '@polkadot/wasm-crypto-asmjs';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

import { __bridge } from './bridge';
import { setPromise } from './init';

export function initWasm (): Promise<void> {
  return setPromise(wasmBytes, asmJsInit);
}

__bridge.initFn = initWasm;
