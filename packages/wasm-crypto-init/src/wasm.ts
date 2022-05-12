// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from './types';

import { createWasmFn } from '@polkadot/wasm-bridge';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

export { packageInfo } from './packageInfo';

export const createWasm: InitFn<WasmCryptoInstance> = createWasmFn('crypto', wasmBytes, null);
