// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { __bridge } from './bridge';
import { initWasm } from './init';

__bridge.initFn = initWasm;
