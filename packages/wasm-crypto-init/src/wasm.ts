// Copyright 2019-2023 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from './types';

import { createWasmFn } from '@polkadot/wasm-bridge';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

export { packageInfo } from './packageInfo';

/**
 * @name createWasm
 * @description
 * Creates an interface using only WASM
 */
export const createWasm: InitFn<WasmCryptoInstance> = /*#__PURE__*/ createWasmFn('crypto', wasmBytes, null);
