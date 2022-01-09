// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rootIncl = ['@polkadot/wasm-crypto-asmjs', '@polkadot/wasm-crypto-wasm'];
const detcIncl = rootIncl.map((p) => `${p}/packageInfo.cjs`);

require('override-require')(
  (request) =>
    rootIncl.some((p) => request.endsWith(p)) ||
    detcIncl.some((p) => request.endsWith(p)),
  (request) =>
    rootIncl.some((p) => request.endsWith(p))
      ? require(`${rootIncl.find((p) => request.endsWith(p))}/build/data.cjs`)
      : require(`${detcIncl.find((p) => request.endsWith(p)).replace('packageInfo.cjs', 'build/packageInfo.cjs')}`)
);
