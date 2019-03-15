#!/usr/bin/env node

const fs = require('fs');
const buffer = fs.readFileSync('./build/wasm_schnorrkel_opt.wasm');

fs.writeFileSync('./build/wasm_schnorrkel_wasm.js', `
module.exports = Buffer.from('${buffer.toString('base64')}', 'base64');
`);
