// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitResult } from './types';

import { createPromise } from './create';

export function init (wbg: WebAssembly.ModuleImports): Promise<InitResult> {
  return createPromise(wbg, null, null);
}
