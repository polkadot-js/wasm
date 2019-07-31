/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const crypto = require('crypto');
const { assert, hexToU8a, stringToU8a, u8aToHex } = require('@polkadot/util');

function extractKeys (pair) {
  return [pair, pair.slice(64), pair.slice(0, 64)];
}

function randomPair (wasm) {
  return extractKeys(wasm.sr25519KeypairFromSeed(crypto.randomBytes(32)));
}

function sr25519_pairFromSeed (wasm) {
  const pair = wasm.sr25519KeypairFromSeed(stringToU8a('12345678901234567890123456789012'));

  console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
  console.log('\tPUB', u8aToHex(pair.slice(64)));

  assert(u8aToHex(pair) === '0xf0106660c3dda23f16daa9ac5b811b963077f5bc0af89f85804f0de8e424f050f98d66f39442506ff947fd911f18c7a7a5da639a63e8d3b4e233f74143d951c1741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63', 'ERROR: pairFromSeed() does not match');
}

function sr25519_devFromSeed (wasm) {
  const pair = wasm.sr25519KeypairFromSeed(hexToU8a('0xfac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e'));

  console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
  console.log('\tPUB', u8aToHex(pair.slice(64)));

  assert(u8aToHex(pair) === '0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a', 'ERROR: devFromSeed() does not match');
}

function sr25519_verifyExisting (wasm) {
  const PK = hexToU8a('0xb4bfa1f7a5166695eb75299fd1c4c03ea212871c342f2c5dfea0902b2c246918');
  const MESSAGE = stringToU8a('Verifying that I am the owner of 5G9hQLdsKQswNPgB499DeA5PkFBbgkLPJWkkS6FAM6xGQ8xD. Hash: 221455a3\n');
  const SIGNATURE = hexToU8a('0x5a9755f069939f45d96aaf125cf5ce7ba1db998686f87f2fb3cbdea922078741a73891ba265f70c31436e18a9acd14d189d73c12317ab6c313285cd938453202');

  const isValid = wasm.sr25519Verify(SIGNATURE, MESSAGE, PK);

  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function sr25519_signAndVerify (wasm) {
  const [, pk, sk] = randomPair(wasm);
  const signature = wasm.sr25519Sign(pk, sk, stringToU8a('this is a message'));
  const isValid = wasm.sr25519Verify(signature, stringToU8a('this is a message'), pk);

  console.log('\tSIG', u8aToHex(signature));
  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');
}

function sr25519_deriveHard (wasm) {
  const [pair] = randomPair(wasm);
  const derived = wasm.sr25519DeriveKeypairHard(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', u8aToHex(derived.slice(64)));
}

function sr25519_deriveHardKnown (wasm) {
  const derived = wasm.sr25519DeriveKeypairHard(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x14416c6963650000000000000000000000000000000000000000000000000000'));
  const publicKey = u8aToHex(derived.slice(64));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', publicKey);

  assert(publicKey === '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', 'Unmatched resulting public keys');
}

function sr25519_deriveSoft (wasm) {
  const [pair] = randomPair(wasm);
  const derived = wasm.sr25519DeriveKeypairSoft(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', u8aToHex(derived.slice(64)));
}

function sr25519_deriveSoftKnown (wasm) {
  const derived = wasm.sr25519DeriveKeypairSoft(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));
  const publicKey = u8aToHex(derived.slice(64));

  console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
  console.log('\tPUB', publicKey);

  assert(publicKey === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
}

function sr25519_deriveSoftPubkey (wasm) {
  const derived = u8aToHex(wasm.sr25519DerivePublicSoft(hexToU8a('0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000')));

  console.log('\tPUB', derived);

  assert(derived === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
}

function sr25519_benchmark (wasm) {
  const MESSAGE = stringToU8a('this is a message');

  for (let i = 0; i < 256; i++) {
    const [, pk, sk] = randomPair(wasm);

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
