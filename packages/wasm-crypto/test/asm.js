// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

global.WebAssembly = null;

require('./alias-imports');

const { runUnassisted } = require('./all');

runUnassisted();
