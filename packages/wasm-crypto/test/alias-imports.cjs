// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const rootIncl = ['@polkadot/wasm-crypto', '@polkadot/wasm-crypto-init', '@polkadot/wasm-data-asmjs', '@polkadot/wasm-data-wasm'];
const detcIncl = [
  ...rootIncl.map((p) => `${p}/initOnlyAsm`),
  ...rootIncl.map((p) => `${p}/cjs/asm`),
  ...rootIncl.map((p) => `${p}/cjs/packageInfo`)
];

require('override-require')(
  (request) =>
    rootIncl.some((p) => request.endsWith(p)) ||
    detcIncl.some((p) => request.endsWith(p)),
  (request) =>
    rootIncl.some((p) => request.endsWith(p))
      ? require(`${rootIncl.find((p) => request.endsWith(p))}/build/cjs`)
      : require(`${detcIncl.find((p) => request.endsWith(p))
        .replace('/initOnlyAsm', '/build/cjs/initOnlyAsm.js')
        .replace('/cjs/asm', '/build/cjs/asm.js')
        .replace('/cjs/packageInfo', '/build/cjs/packageInfo.js')
      }`)
);
