// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { formatNumber } = require('@polkadot/util');

const A_NAME = 'bytes-asmjs-crypto';
const W_NAME = 'bytes-wasm-crypto';

function hdr (package) {
  return `// Copyright 2019-2020 @polkadot/${package} authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit
`;
}

// only one of the deps are included, here are the details for package.json -
//   "fflate": "^0.4.2"
//   "lz4js": "^0.2.0"
function getWasmBuffer (lib = 'fflate') {
  const data = fs.readFileSync('./bytes/wasm_opt.wasm');
  const comp = lib === 'fflate'
    ? Buffer.from(require('fflate').zlibSync(data, { level: 9 }))
    : Buffer.from(require('lz4js').compress(data));

  console.log(`*** Compressed WASM via ${lib}: ${formatNumber(data.length)} -> ${formatNumber(comp.length)} (${(100 * comp.length / data.length).toFixed(2)}%)`);

  return comp.toString('base64');
}

fs.writeFileSync(`./${A_NAME}/build/data.mjs`, `${hdr(A_NAME)}
export { asmJsInit } from './data.js';
`);

fs.writeFileSync(`./${W_NAME}/build/buffer.mjs`, `${hdr(W_NAME)}
export { buffer } from './buffer.js';
`);

fs.writeFileSync('./bytes-wasm-crypto/build/buffer.js', `${hdr(W_NAME)}
const buffer = Buffer.from('${getWasmBuffer()}', 'base64');

module.exports = { buffer };
`);
