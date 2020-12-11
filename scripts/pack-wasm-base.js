// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

const A_NAME = 'bytes-asmjs-crypto';
const W_NAME = 'bytes-wasm-crypto';

const hdr = (package) => `// Copyright 2019-2020 @polkadot/${package} authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit
`;

fs.writeFileSync(`./${A_NAME}/build/data.mjs`, `${hdr(A_NAME)}
export { asmJsInit } from './data.js';
`);

fs.writeFileSync(`./${W_NAME}/build/data.mjs`, `${hdr(W_NAME)}
export { wasmBytes } from './data.js';
`);

fs.writeFileSync('./bytes-wasm-crypto/build/data.js', `${hdr(W_NAME)}
module.exports = { wasmBytes: Buffer.from('${fs.readFileSync('./bytes/wasm_opt.wasm').toString('base64')}', 'base64') };
`);
