// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const { assert, hexToU8a, stringToU8a, u8aToHex } = require('@polkadot/util');
const crypto = require('../build/index');

async function beforeAll () {
  return crypto.waitReady();
}

async function pbkdf2Hash () {
  const SALT = stringToU8a('this is a salt');
  const DATA = stringToU8a('hello world');
  const EXPECTED = '0x5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270';

  const hash = u8aToHex(crypto.pbkdf2Hash(DATA, SALT, 2048));

  console.log('\tRES', hash);

  assert(hash === EXPECTED, 'ERROR: pbkdf2Hash does not match');
}

async function pbkdf2Benchmark () {
  const SALT = stringToU8a('this is a salt');
  let dataWasm = stringToU8a('hello world');

  for (let i = 0; i < 50; i++) {
    dataWasm = crypto.pbkdf2Hash(dataWasm, SALT, 2048)
  }

  console.log('\tWM', u8aToHex(dataWasm));
}

const tests = {
  pbkdf2Hash,
  pbkdf2Benchmark
};

async function runAll () {
  Object.keys(tests).forEach(async (name) => {
    console.time(name);
    console.log();
    console.log(name);

    await tests[name]();

    console.timeEnd(name);
  });
}

module.exports.beforeAll = beforeAll;
module.exports.runAll = runAll;
module.exports.tests = tests;
