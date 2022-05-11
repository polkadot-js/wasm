// Copyright 2019-2022 @polkadot/wasm-data-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bytes, sizeUncompressed } from './cjs/bytes';
import { base64Decode } from './base64';
import { unzlibSync } from './fflate';

export { packageInfo } from './packageInfo';

export const wasmBytes = unzlibSync(base64Decode(bytes), new Uint8Array(sizeUncompressed));
