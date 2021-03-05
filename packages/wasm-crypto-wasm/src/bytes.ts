// Copyright 2019-2021 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bytes as _bytes, sizeCompressed as _sizeUCompressed, sizeUncompressed as _sizeUncompressed } from './cjs/bytes';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const bytes = _bytes;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const sizeCompressed = _sizeUCompressed;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const sizeUncompressed = _sizeUncompressed;
