// Copyright 2019-2021 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { toByteArray } from './base64';
import { bytes, sizeUncompressed } from './bytes';
import { unzlibSync } from './fflate';

export const wasmBytes = unzlibSync(toByteArray(bytes), new Uint8Array(sizeUncompressed));
