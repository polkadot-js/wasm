// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('./alias-imports.cjs');
require('@polkadot/wasm-crypto/initOnlyAsm');

const wasm = require('../build');
const { runUnassisted } = require('./all/index.js');

runUnassisted('ASM', wasm);
