// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const buffer = fs.readFileSync('./build/wasm_opt.wasm');

fs.writeFileSync('./build/wasm_wasm.js', `// Generated as part of the build, do not edit

module.exports = Buffer.from('${buffer.toString('base64')}', 'base64');
`);
