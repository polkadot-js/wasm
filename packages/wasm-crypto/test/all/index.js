/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

// @ts-ignore
const wasm = require('../../build/index');
const bip39 = require('./bip39');
const ed25519 = require('./ed25519');
const hashing = require('./hashing');
const sr25519 = require('./sr25519');

const tests = { ...bip39, ...ed25519, ...hashing, ...sr25519 };

module.exports.beforeAll = async function beforeAll () {
  return wasm.waitReady();
};

module.exports.runAll = function runAll () {
  Object.keys(tests).forEach((name) => {
    console.time(name);
    console.log();
    console.log(name);

    tests[name]();

    console.timeEnd(name);
  });
};

module.exports.tests = tests;
