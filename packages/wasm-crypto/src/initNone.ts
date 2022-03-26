// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AsmCreator } from './types';

import { __bridge } from './bridge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setPromise (_wasmBytes: Uint8Array | null, _asmFn: AsmCreator | null): Promise<void> {
  __bridge.wasmPromise = Promise.resolve();

  return __bridge.wasmPromise;
}

export function setWasmOnlyPromise (): Promise<void> {
  return setPromise(null, null);
}

export function initWasm (): Promise<void> {
  return setWasmOnlyPromise();
}

__bridge.initFn = initWasm;
