// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

global.WebAssembly = null;

require('override-require')(
  (request) =>
    request.endsWith('@polkadot/bytes-asmjs-crypto') ||
    request.endsWith('@polkadot/bytes-wasm-crypto'),
  (request) =>
    request.endsWith('@polkadot/bytes-asmjs-crypto')
      ? require('../../bytes-asmjs-crypto/build/data')
      : require('../../bytes-wasm-crypto/build/empty')
);

const { runUnassisted } = require('./all');

runUnassisted();
