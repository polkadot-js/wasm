// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initWasm as baseInitWasm, setWasmPromiseFn } from './init';

export function initWasm (): Promise<void> {
  return baseInitWasm();
}

setWasmPromiseFn(initWasm);
