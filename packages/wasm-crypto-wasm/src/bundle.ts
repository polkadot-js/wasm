// Copyright 2019-2022 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { base64Decode, unzlibSync } from '@polkadot/wasm-util';

import { bytes, sizeUncompressed } from './cjs/bytes';

export { packageInfo } from './packageInfo';

/**
 * @name wasmBytes
 * @description
 * The decoded WASM interface as exposed by this package.
 *
 * The build process will output into cjs/* into a compressed base64 format.
 * Upon loading the exposed bytes will be decoded and decompressed form this
 * specific format and returned.
 */
export const wasmBytes = unzlibSync(base64Decode(bytes), new Uint8Array(sizeUncompressed));
