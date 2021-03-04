// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rootIncl = ['@polkadot/wasm-crypto-asmjs', '@polkadot/wasm-crypto-wasm'];
const detcIncl = ['@polkadot/wasm-crypto-asmjs/packageInfo', '@polkadot/wasm-crypto-wasm/packageInfo'];

require('override-require')(
  (request) =>
    rootIncl.some((p) => request.endsWith(p)) ||
    detcIncl.some((p) => request.endsWith(p)),
  (request) =>
    rootIncl.some((p) => request.endsWith(p))
      ? request.endsWith(rootIncl[0])
        ? require('../../wasm-crypto-asmjs/build/data.cjs')
        : require('../../wasm-crypto-wasm/build/empty.cjs')
      : request.endsWith(detcIncl[1])
        ? require('../../wasm-crypto-asmjs/build/packageInfo.cjs')
        : require('../../wasm-crypto-wasm/build/packageInfo.cjs')
);
