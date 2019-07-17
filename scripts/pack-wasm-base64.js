/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const buffer = fs.readFileSync('./build/wasm_opt.wasm');

fs.writeFileSync('./build/wasm_wasm.js', `
module.exports = Buffer.from('${buffer.toString('base64')}', 'base64');
`);
