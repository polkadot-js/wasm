// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const wasm = require('../../build/index.cjs');
const bip39 = require('./bip39.cjs');
const ed25519 = require('./ed25519.cjs');
const hashing = require('./hashing.cjs');
const secp256k1 = require('./secp256k1.cjs');
const sr25519 = require('./sr25519.cjs');
const vrf = require('./vrf.cjs');

const tests = {
  // We place secp256k1 first, this allows the interaction with it in the
  // hashing (specifically scrypt) test not be an issue (ASM.js only)
  // https://github.com/polkadot-js/wasm/issues/307
  ...secp256k1,
  ...ed25519,
  ...sr25519,
  ...vrf,
  ...bip39,
  ...hashing
};

function beforeAll () {
  return wasm.waitReady();
}

function runAll (name) {
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
      console.error();
      console.error(error);

      failed.push(name);
    }
  });

  if (failed.length) {
    throw new Error(`\n*** ${name}: FAILED: ${failed.length} of ${count}: ${failed.join(', ')}`);
  }
}

function runUnassisted (name) {
  console.log(`\n*** ${name}: Running tests`);

  beforeAll()
    .then(() => runAll(name))
    .then(() => {
      console.log(`\n*** ${name}: All passed`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message, '\n');
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
