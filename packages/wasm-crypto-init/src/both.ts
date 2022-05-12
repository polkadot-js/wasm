// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InitFn } from '@polkadot/wasm-bridge/types';
import type { WasmCryptoInstance } from './types';

import { initWasm } from '@polkadot/wasm-bridge';
import { asmJsInit } from '@polkadot/wasm-crypto-asmjs';
import { wasmBytes } from '@polkadot/wasm-crypto-wasm';

export { packageInfo } from './packageInfo';

export const init: InitFn<WasmCryptoInstance> = initWasm('crypto', wasmBytes, asmJsInit);
