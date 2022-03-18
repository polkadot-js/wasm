// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { asmJsInit } from '@polkadot/wasm-crypto-asmjs';

import { setPromise } from './init';

setPromise(null, asmJsInit).catch(() => undefined);
