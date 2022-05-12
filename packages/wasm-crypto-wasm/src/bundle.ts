// Copyright 2019-2022 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { base64Decode, unzlibSync } from '@polkadot/wasm-util';

import { bytes, sizeUncompressed } from './cjs/bytes';

export { packageInfo } from './packageInfo';

export const wasmBytes = unzlibSync(base64Decode(bytes), new Uint8Array(sizeUncompressed));
