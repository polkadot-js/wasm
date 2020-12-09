// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

const HDR = `// Generated as part of the build, do not edit
`;
const FTR = '';

fs.writeFileSync('./build/wasm/bytes.js', `${HDR}
module.exports = Buffer.from('${fs.readFileSync('./pkg/wasm_opt.wasm').toString('base64')}', 'base64');
${FTR}`);

fs.writeFileSync('./build/esm/wasm/asm.js', `${HDR}
import asm from '../../wasm/asm.js';
export default asm;
${FTR}`);

fs.writeFileSync('./build/esm/wasm/bytes.js', `${HDR}
import bytes from '../../wasm/bytes.js';
export default bytes;
${FTR}`);
