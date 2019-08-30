/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const wasm = require('../../build/index');
const bip39 = require('./bip39');
const ed25519 = require('./ed25519');
const hashing = require('./hashing');
const sr25519 = require('./sr25519');

const tests = {
  ...bip39,
  ...ed25519,
  ...hashing,
  ...sr25519
};

function beforeAll () {
  return wasm.waitReady();
}

function runAll () {
  const failed = [];
  let count = 0;

  Object.keys(tests).forEach((name) => {
    count++;

    try {
      console.time(name);
      console.log();
      console.log(name);

      tests[name](wasm);

      console.timeEnd(name);
    } catch (error) {
      console.error(error);
      failed.push(name);
    }
  });

  if (failed.length) {
    throw new Error(`Failed: ${failed.length} of ${count}: ${failed.concat(', ')}`);
  }
}

function runUnassisted () {
  (async () => {
    await beforeAll();

    runAll();
  })().catch((error) => {
    console.error(error);

    process.exit(-1);
  });
}

module.exports = {
  beforeAll,
  runAll,
  runUnassisted,
  tests,
  wasm
};
