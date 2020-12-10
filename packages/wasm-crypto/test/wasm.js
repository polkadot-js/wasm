// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('override-require')(
  (request) =>
    request.endsWith('@polkadot/bytes-asmjs-crypto') ||
    request.endsWith('@polkadot/bytes-wasm-crypto'),
  (request) =>
    request.endsWith('@polkadot/bytes-asmjs-crypto')
      ? require('../../bytes-asmjs-crypto/build/empty')
      : require('../../bytes-wasm-crypto/build/data')
);

const { runUnassisted } = require('./all');

runUnassisted();
