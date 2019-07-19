/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

// @ts-ignore
global.WebAssembly = null;

require('override-require')(
  (request) => request === './wasm_asm_stub',
  // @ts-ignore
  () => require('../build/wasm_asm')
);

// @ts-ignore
const wasm = require('../build/index');
const { beforeAll, runAll } = require('./all')(wasm);

(async () => {
  await beforeAll();

  runAll();
})().catch((error) => {
  console.error(error);

  process.exit(-1);
});
