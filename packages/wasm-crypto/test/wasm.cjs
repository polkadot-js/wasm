// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('./alias-imports.cjs');

const wasm = require('../build');
const { runUnassisted } = require('./all/index.js');

runUnassisted('WASM', wasm);
