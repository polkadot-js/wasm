// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const crypto = require('crypto');
const { assert, hexToU8a, stringToU8a, u8aToHex } = require('@polkadot/util');

const wasm = require('../../build/index');

function extractKeys (pair) {
  return [pair, pair.slice(64), pair.slice(0, 64)];
}

function randomPair () {
  return extractKeys(wasm.sr25519KeypairFromSeed(crypto.randomBytes(32)));
}

function sr25519_pairFromSeed () {
  const pair = wasm.sr25519KeypairFromSeed(stringToU8a('12345678901234567890123456789012'));

  console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
  console.log('\tPUB', u8aToHex(pair.slice(64)));

  assert(u8aToHex(pair) === '0xf0106660c3dda23f16daa9ac5b811b963077f5bc0af89f85804f0de8e424f050f98d66f39442506ff947fd911f18c7a7a5da639a63e8d3b4e233f74143d951c1741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63', 'ERROR: pairFromSeed() does not match');
}

function sr25519_devFromSeed () {
  const pair = wasm.sr25519KeypairFromSeed(hexToU8a('0xfac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e'));

  console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
  console.log('\tPUB', u8aToHex(pair.slice(64)));

  assert(u8aToHex(pair) === '0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a', 'ERROR: devFromSeed() does not match');
}

function sr25519_verifyExisting () {
  const PK = hexToU8a('0x741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63');
  const MESSAGE = stringToU8a('this is a message');
  const SIGNATURE = hexToU8a('0xdecef12cf20443e7c7a9d406c237e90bcfcf145860722622f92ebfd5eb4b5b3990b6443934b5cba8f925a0ae75b3a77d35b8490cbb358dd850806e58eaf72904'
);

  const isValid = wasm.sr25519Verify(SIGNATURE, MESSAGE, PK);

  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function sr25519_signAndVerify () {
  const [, pk, sk] = randomPair();
  const signature = wasm.sr25519Sign(pk, sk, stringToU8a('this is a message'));
  const isValid = wasm.sr25519Verify(signature, stringToU8a('this is a message'), pk);

  console.log('\tSIG', u8aToHex(signature));
  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function sr25519_deriveHard () {
  const [pair] = randomPair();
  const derived = wasm.sr25519DeriveKeypairHard(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', u8aToHex(derived.slice(64)));
}

function sr25519_deriveHardKnown () {
  const derived = wasm.sr25519DeriveKeypairHard(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x14416c6963650000000000000000000000000000000000000000000000000000'));
  const publicKey = u8aToHex(derived.slice(64));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', publicKey);

  assert(publicKey === '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', 'Unmatched resulting public keys');
}

function sr25519_deriveSoft () {
  const [pair] = randomPair();
  const derived = wasm.sr25519DeriveKeypairSoft(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', u8aToHex(derived.slice(64)));
}

function sr25519_deriveSoftKnown () {
  const derived = wasm.sr25519DeriveKeypairSoft(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));
  const publicKey = u8aToHex(derived.slice(64));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', publicKey);

  assert(publicKey === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
}

function sr25519_deriveSoftPubkey () {
  const derived = u8aToHex(wasm.sr25519DerivePublicSoft( hexToU8a('0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000')));

  console.log('\tPUB', derived);

  assert(derived === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
}

function sr25519_benchmark () {
  const MESSAGE = stringToU8a('this is a message');

  for (let i = 0; i < 256; i++) {
    const [, pk, sk] = randomPair();

    assert(wasm.sr25519Verify(wasm.sr25519Sign(pk, sk, MESSAGE), MESSAGE, pk), 'ERROR: Unable to verify signature');
  }
}

module.exports = {
  sr25519_pairFromSeed,
  sr25519_devFromSeed,
  sr25519_deriveHard,
  sr25519_deriveHardKnown,
  sr25519_deriveSoft,
  sr25519_deriveSoftKnown,
  sr25519_deriveSoftPubkey,
  sr25519_signAndVerify,
  sr25519_verifyExisting,
  sr25519_benchmark
};
