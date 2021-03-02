// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

global.WebAssembly = null;

require('./alias-imports.cjs');

const { runUnassisted } = require('./all/index.cjs');

runUnassisted();
