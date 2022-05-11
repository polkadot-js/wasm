// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { asmJsInit } from '@polkadot/wasm-crypto-asmjs';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

import { createInitFn } from './util';

export { packageInfo } from './packageInfo';

export const init = createInitFn(wasmBytes, asmJsInit);
