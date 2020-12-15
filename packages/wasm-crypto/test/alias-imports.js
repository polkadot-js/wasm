// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('override-require')(
  (request) =>
    request.endsWith('@polkadot/wasm-crypto-asmjs') ||
    request.endsWith('@polkadot/wasm-crypto-wasm') ||
    request.includes('package-info.json'),
  (request) =>
    request.includes('package-info.json')
      ? require('../../wasm-crypto/build/package-info.json')
      : request.endsWith('@polkadot/wasm-crypto-asmjs')
        ? require('../../wasm-crypto-asmjs/build/data')
        : require('../../wasm-crypto-wasm/build/empty')
);
