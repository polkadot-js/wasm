// Copyright 2019-2020 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const buffer = fs.readFileSync('./build/wasm_opt.wasm');

// base 64
// fs.writeFileSync('./build/wasm_wasm.js', `
// module.exports = Buffer.from('${buffer.toString('base64')}', 'base64');
// `);

// base 122
const { encode } = require('../packages/wasm-crypto/src/js/base122');

fs.writeFileSync('./build/wasm_wasm.js', `// Generated as part of the build, do not edit

const { decode } = require('./base122');

module.exports = Buffer.from(decode("${Buffer.from(encode(buffer)).toString('utf-8')}"));
`, { encoding: 'utf-8' });
