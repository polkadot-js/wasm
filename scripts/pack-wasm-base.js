// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

const A_NAME = 'bytes-asmjs-crypto';
const W_NAME = 'bytes-wasm-crypto';

const hdr = (package) => `// Copyright 2019-2020 @polkadot/${package} authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Generated as part of the build, do not edit
`;

function writeEsm (package) {
  fs.writeFileSync(`./${package}/build/data.mjs`, `${hdr(package)}
import data from './data.js';
export default data;
`);
  fs.writeFileSync(`./${package}/build/empty.mjs`, `${hdr(package)}
export default null;
`);
}

writeEsm(A_NAME);
writeEsm(W_NAME);

fs.writeFileSync('./bytes-wasm-crypto/build/data.js', `${hdr(W_NAME)}
module.exports = Buffer.from('${fs.readFileSync('./bytes/wasm_opt.wasm').toString('base64')}', 'base64');
`);
