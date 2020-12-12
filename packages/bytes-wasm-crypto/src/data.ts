// Copyright 2017-2020 @polkadot/bytes-wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { unzlibSync } from 'fflate';

import { buffer } from './buffer';

export const wasmBytes = unzlibSync(buffer);
