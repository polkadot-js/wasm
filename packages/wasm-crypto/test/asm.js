// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/wasm-crypto/initOnlyAsm';

import * as wasm from '@polkadot/wasm-crypto';

import { runUnassisted } from './all/index.js';

runUnassisted('ASM', wasm);
