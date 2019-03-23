// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const { assert, stringToU8a, u8aToHex } = require('@polkadot/util');
const crypto = require('../build/index');

function bip39Generate () {
  const RESULT = crypto.bip39Generate(21);

  console.log('\tPHR', RESULT);

  assert(RESULT.split(' ').length === 21, 'ERROR: Invalid bip39 Phase length');
}

function bip39Validate () {
  const RESULT = crypto.bip39Validate(crypto.bip39Generate(12));

  console.log('\tVAL', RESULT);

  assert(RESULT, 'ERROR: Invalid bip39 validation');
}

function bip39ToEntropy () {
  const RESULT = u8aToHex(crypto.bip39ToEntropy('legal winner thank year wave sausage worth useful legal winner thank yellow'));

  console.log('\tENT', RESULT);

  assert(RESULT === '0x7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f', 'ERROR: Invalid bip39 entropy');
}

function bip39ToMiniSecret () {
  const RESULT = u8aToHex(crypto.bip39ToMiniSecret('legal winner thank year wave sausage worth useful legal winner thank yellow', 'Substrate'));

  console.log('\tMIN', RESULT);

  assert(RESULT === '0x4313249608fe8ac10fd5886c92c4579007272cb77c21551ee5b8d60b78041685', 'ERROR: Invalid bip39 mini secret');
}

function bip39ToSeed () {
  const RESULT = u8aToHex(crypto.bip39ToSeed('seed sock milk update focus rotate barely fade car face mechanic mercy', ''));

  console.log('\SEE', RESULT);

  assert(RESULT === '0x3c121e20de068083b49c2315697fb59a2d9e8643c24e5ea7628132c58969a027', 'ERROR: Invalid bip39 mini secret');
}

function blake2bHash () {
  const hash = u8aToHex(crypto.blake2b(stringToU8a('abc'), new Uint8Array(), 64));

  console.log('\tRES', hash);

  assert(hash === '0xba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923', 'ERROR: blake2bHash does not match');
}

function keccak256 () {
  const hash = u8aToHex(crypto.keccak256(stringToU8a('test value')));

  console.log('\tRES', hash);

  assert(hash === '0x2d07364b5c231c56ce63d49430e085ea3033c750688ba532b24029124c26ca5e', 'ERROR: keccak256 does not match');
}

function pbkdf2Hash () {
  const hash = u8aToHex(crypto.pbkdf2(stringToU8a('hello world'), stringToU8a('this is a salt'), 2048));

  console.log('\tRES', hash);

  assert(hash === '0x5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270', 'ERROR: pbkdf2Hash does not match');
}

// function secp256k1Recover () {
//   const pk = u8aToHex(crypto.keccak256(crypto.secp256k1Recover(
//     hexToU8a('0x2bbfa926ee947dfac384d981f8913b4e0992e52d7b6711e0ec3d9f8b0f752648'),
//     hexToU8a('0x7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff1c')
//   )));

//   console.log('\tPUB', pk);

//   assert(pk === '0x91d366769d44a7c7690428bfdf67ec7eae23d2459694685257b6fc59d1baa1fe', 'ERROR: secp256k1Recover does not match');
// }

function sha512Hash () {
  const hash = u8aToHex(crypto.sha512(stringToU8a('hello world')));

  console.log('\tRES', hash);

  assert(hash === '0x309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f', 'ERROR: sha512Hash does not match');
}

function twoxHash () {
  const hash64 = u8aToHex(crypto.twox(stringToU8a('abc'), 1));
  const hash256 = u8aToHex(crypto.twox(stringToU8a('abc'), 4));

  console.log('\t64 ', hash64);
  console.log('\t256', hash256);

  assert(hash64 === '0x990977adf52cbc44' && hash256 === '0x990977adf52cbc440889329981caa9bef7da5770b2b8a05303b75d95360dd62b', 'ERROR: twoxHash does not match');
}

const tests = {
  bip39Generate,
  bip39Validate,
  bip39ToEntropy,
  bip39ToMiniSecret,
  bip39ToSeed,
  blake2bHash,
  keccak256,
  pbkdf2Hash,
  // secp256k1Recover,
  sha512Hash,
  twoxHash
};

module.exports.beforeAll = async function beforeAll () {
  return crypto.waitReady();
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
