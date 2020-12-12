// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const lz4 = require('lz4js');
const { formatNumber } = require('@polkadot/util');

const A_NAME = 'bytes-asmjs-crypto';
const W_NAME = 'bytes-wasm-crypto';

function hdr (package) {
  return `// Copyright 2019-2020 @polkadot/${package} authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit
`;
}

function getWasmBuffer () {
  const data = fs.readFileSync('./bytes/wasm_opt.wasm');
  const comp = Buffer.from(lz4.compress(data));

  console.log(`*** Compressed WASM ${formatNumber(data.length)} -> ${formatNumber(comp.length)} (${(100 * comp.length / data.length).toFixed(2)}%)`);

  return comp.toString('base64');
}

fs.writeFileSync(`./${A_NAME}/build/data.mjs`, `${hdr(A_NAME)}
export { asmJsInit } from './data.js';
`);

fs.writeFileSync(`./${W_NAME}/build/data.mjs`, `${hdr(W_NAME)}
export { wasmBytes } from './data.js';
`);

fs.writeFileSync('./bytes-wasm-crypto/build/data.js', `${hdr(W_NAME)}
const lz4 = require('lz4js');

const wasmBytes = lz4.decompress(Buffer.from('${getWasmBuffer()}', 'base64'));

module.exports = { wasmBytes };
`);
