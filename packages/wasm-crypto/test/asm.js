/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

// @ts-ignore
global.WebAssembly = null;

// @ts-ignore
const asm = require('../build/index');
const { beforeAll, runAll } = require('./all')(asm);

(async () => {
  await beforeAll();

  runAll();
})().catch((error) => {
  console.error(error);

  process.exit(-1);
});
