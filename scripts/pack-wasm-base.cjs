// Copyright 2019-2021 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fflate = require('fflate/node');
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

function getWasmBuffer () {
  const data = fs.readFileSync('./bytes/wasm_opt.wasm');
  const compressed = Buffer.from(fflate.zlibSync(data, { level: 9 }));

  console.log(`*** Compressed WASM: ${formatNumber(data.length)} -> ${formatNumber(compressed.length)} (${(100 * compressed.length / data.length).toFixed(2)}%)`);

  return { compressed, sizeUncompressed: data.length };
}

fs.writeFileSync(`./${A_NAME}/build/data.js`, `${hdr(A_NAME)}
export { asmJsInit } from './data.cjs';
`);

fs.writeFileSync(`./${W_NAME}/build/bytes.js`, `${hdr(W_NAME)}
export { bytes, sizeCompressed, sizeUncompressed } from './bytes.cjs';
`);

const { compressed, sizeUncompressed } = getWasmBuffer();

fs.writeFileSync(`./${W_NAME}/build/bytes.cjs`, `${hdr(W_NAME)}
const sizeCompressed = ${compressed.length};
const sizeUncompressed = ${sizeUncompressed};
const bytes = '${compressed.toString('base64')}';

module.exports = { bytes, sizeCompressed, sizeUncompressed };
`);
