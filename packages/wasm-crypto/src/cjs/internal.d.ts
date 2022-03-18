// Copyright 2019-2022 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WasmCryptoInstance } from '../types';

export declare const __internal: {
  cachegetInt32: Int32Array | null;
  cachegetUint8: Uint8Array | null;
  wasm: WasmCryptoInstance | null;
  wasmPromise: Promise<void> | null;
};
