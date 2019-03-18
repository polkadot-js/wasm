// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const { assert, stringToU8a, u8aToHex } = require('@polkadot/util');
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

async function sha512Hash () {
  const DATA = stringToU8a('hello world');
  const EXPECTED = '0x309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f';

  const hash = u8aToHex(crypto.sha512Hash(DATA));

  console.log('\tRES', hash);

  assert(hash === EXPECTED, 'ERROR: pbkdf2Hash does not match');
}

const tests = {
  pbkdf2Hash,
  sha512Hash
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
