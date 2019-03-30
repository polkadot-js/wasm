// Copyright 2019 @polkadot/wasm-dalek-ed25519 authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const crypto = require('crypto');
const { assert, hexToU8a, stringToU8a, u8aToHex } = require('@polkadot/util');
const dalek = require('../build/index');

function extractKeys (pair) {
  return [pair, pair.slice(32), pair.slice(0, 32)];
}

function randomPair () {
  return extractKeys(dalek.keypairFromSeed(crypto.randomBytes(32)));
}

function pairFromSeed () {
  const [pair, pk, sk] = extractKeys(dalek.keypairFromSeed(stringToU8a('12345678901234567890123456789012')));

  console.log('\tSEC', u8aToHex(sk));
  console.log('\tPUB', u8aToHex(pk));

  assert(u8aToHex(pair) === '0x31323334353637383930313233343536373839303132333435363738393031322f8c6129d816cf51c374bc7f08c3e63ed156cf78aefb4a6550d97b87997977ee', 'ERROR: pairFromSeed() does not match');
}

function signAndVerify () {
  const [, pk, sk] = randomPair();
  const signature = dalek.sign(pk, sk, stringToU8a('this is a message'));
  const isValid = dalek.verify(signature, stringToU8a('this is a message'), pk);

  console.log('\tSIG', u8aToHex(signature));
  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function verifyExisting () {
  const isValid = dalek.verify(hexToU8a('0x90588f3f512496f2dd40571d162e8182860081c74e2085316e7c4396918f07da412ee029978e4dd714057fe973bd9e7d645148bf7b66680d67c93227cde95202'), stringToU8a('this is a message'), hexToU8a('0x2f8c6129d816cf51c374bc7f08c3e63ed156cf78aefb4a6550d97b87997977ee'));

  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function benchmark () {
  const MESSAGE = stringToU8a('this is a message');

  for (let i = 0; i < 256; i++) {
    const [, pk, sk] = randomPair();

    assert(dalek.verify(dalek.sign(pk, sk, MESSAGE), MESSAGE, pk), 'ERROR: Unable to verify signature');
  }
}

const tests = {
  pairFromSeed,
  signAndVerify,
  verifyExisting,
  benchmark
};

module.exports.beforeAll = async function beforeAll () {
  return dalek.waitReady();
}

module.exports.runAll = function runAll () {
  Object.keys(tests).forEach((name) => {
    console.time(name);
    console.log();
    console.log(name);

    tests[name]();

    console.timeEnd(name);
  });
}

module.exports.tests = tests;
