// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');

const buffer = fs.readFileSync('./pkg/wasm_opt.wasm');

fs.writeFileSync('./build/wasm/bytes.js', `// Generated as part of the build, do not edit

module.exports = Buffer.from('${buffer.toString('base64')}', 'base64');
`);
