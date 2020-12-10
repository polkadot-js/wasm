// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

const HDR = `// Generated as part of the build, do not edit
`;
const FTR = '';

fs.writeFileSync('./bytes-wasm-crypto/build/data.js', `${HDR}
module.exports = Buffer.from('${fs.readFileSync('./bytes/wasm_opt.wasm').toString('base64')}', 'base64');
${FTR}`);

// fs.writeFileSync('./bytes-asmjs-crypto/data.mjs', `${HDR}
// import asm from '../../wasm/asm.js';
// export default asm;
// ${FTR}`);

// fs.writeFileSync('./bytes-wasm-crypto/data.mjs', `${HDR}
// import bytes from '../../wasm/bytes.js';
// export default bytes;
// ${FTR}`);
