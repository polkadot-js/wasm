// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setWasmOnlyPromise } from './initOnlyWasmBase';

export function initWasm (): Promise<void> {
  return setWasmOnlyPromise();
}

initWasm().catch(() => undefined);
