// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rootIncl = ['@polkadot/wasm-crypto', '@polkadot/wasm-crypto-asmjs', '@polkadot/wasm-crypto-wasm'];
const detcIncl = [
  ...rootIncl.map((p) => `${p}/initOnlyAsm.cjs`),
  ...rootIncl.map((p) => `${p}/initOnlyWasm.cjs`),
  ...rootIncl.map((p) => `${p}/packageInfo.cjs`)
];

require('override-require')(
  (request) =>
    rootIncl.some((p) => request.endsWith(p)) ||
    detcIncl.some((p) => request.endsWith(p)),
  (request) =>
    rootIncl.some((p) => request.endsWith(p))
      ? require(`${rootIncl.find((p) => request.endsWith(p))}/build/index.cjs`)
      : require(`${detcIncl.find((p) => request.endsWith(p))
        .replace('initOnlyAsm.cjs', 'build/initOnlyAsm.cjs')
        .replace('initOnlyWasm.cjs', 'build/initOnlyWasm.cjs')
        .replace('packageInfo.cjs', 'build/packageInfo.cjs')
      }`)
);
