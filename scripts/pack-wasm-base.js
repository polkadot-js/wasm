// Copyright 2019-2021 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { formatNumber } = require('@polkadot/util');

const A_NAME = 'wasm-crypto-asmjs';
const W_NAME = 'wasm-crypto-wasm';

function hdr (package) {
  return `// Copyright 2019-2021 @polkadot/${package} authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit
`;
}

// only one of the deps are included, here are the details for package.json -
//   "fflate": "^0.4.2"
//   "lz4js": "^0.2.0"
function getWasmBuffer (lib = 'fflate') {
  const data = fs.readFileSync('./bytes/wasm_opt.wasm');
  const compressed = lib === 'fflate'
    ? Buffer.from(require('fflate/node').zlibSync(data, { level: 9 }))
    : Buffer.from(require('lz4js').compress(data));

  console.log(`*** Compressed WASM via ${lib}: ${formatNumber(data.length)} -> ${formatNumber(compressed.length)} (${(100 * compressed.length / data.length).toFixed(2)}%)`);

  return { compressed, sizeUncompressed: data.length };
}

fs.writeFileSync(`./${A_NAME}/build/data.mjs`, `${hdr(A_NAME)}
export { asmJsInit } from './data.js';
`);

fs.writeFileSync(`./${W_NAME}/build/bytes.mjs`, `${hdr(W_NAME)}
export { bytes, sizeCompressed, sizeUncompressed } from './bytes.js';
`);

const { compressed, sizeUncompressed } = getWasmBuffer();

fs.writeFileSync(`./${W_NAME}/build/bytes.js`, `${hdr(W_NAME)}
const sizeCompressed = ${compressed.length};
const sizeUncompressed = ${sizeUncompressed};
const bytes = '${compressed.toString('base64')}';

module.exports = { bytes, sizeCompressed, sizeUncompressed };
`);
