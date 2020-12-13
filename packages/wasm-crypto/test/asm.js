// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

global.WebAssembly = null;

require('override-require')(
  (request) =>
    request.endsWith('@polkadot/wasm-crypto-asmjs') ||
    request.endsWith('@polkadot/wasm-crypto-wasm'),
  (request) =>
    request.endsWith('@polkadot/wasm-crypto-asmjs')
      ? require('../../wasm-crypto-asmjs/build/data')
      : require('../../wasm-crypto-wasm/build/empty')
);

const { runUnassisted } = require('./all');

runUnassisted();
