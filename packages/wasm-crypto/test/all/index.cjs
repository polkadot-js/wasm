// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const wasm = require('../../build/index.cjs');
const bip39 = require('./bip39.cjs');
const ed25519 = require('./ed25519.cjs');
const hashing = require('./hashing.cjs');
const sr25519 = require('./sr25519.cjs');
const vrf = require('./vrf.cjs');

const tests = {
  ...bip39,
  ...ed25519,
  ...hashing,
  ...sr25519,
  ...vrf
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
  beforeAll()
    .then(() => runAll())
    .then(() => process.exit(0))
    .catch((error) => {
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
