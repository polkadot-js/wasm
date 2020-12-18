// Copyright 2017-2020 @polkadot/wasm-crypto-wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { unzlibSync } from 'fflate';

import { buffer } from './buffer';
import { unzlibSync } from './fflate';

export const wasmBytes = unzlibSync(buffer);
