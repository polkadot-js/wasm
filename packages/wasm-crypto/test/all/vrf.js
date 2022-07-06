// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const crypto = require('crypto');
const { assert, stringToU8a, u8aToHex } = require('@polkadot/util');

function extractKeys (pair) {
  return [pair, pair.slice(64), pair.slice(0, 64)];
}

function randomPair (wasm) {
  return extractKeys(wasm.sr25519KeypairFromSeed(crypto.randomBytes(32)));
}

function vrfSignAndVerifyCompat (wasm) {
  const [, pk, sk] = randomPair(wasm);
  const outAndProof = wasm.vrfSign(sk, stringToU8a('my VRF context'), stringToU8a('this is a message'), new Uint8Array());
  const isValid = wasm.vrfVerify(pk, stringToU8a('my VRF context'), stringToU8a('this is a message'), new Uint8Array(), outAndProof);

  console.log('\tVRF', u8aToHex(outAndProof));
  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify VRF output & proof');
}

function vrfSignAndVerify (wasm) {
  const [, pk, sk] = randomPair(wasm);
  const outAndProof = wasm.vrfSign(sk, stringToU8a('my VRF context'), stringToU8a('this is a message'), stringToU8a('extra param'));
  const isValid = wasm.vrfVerify(pk, stringToU8a('my VRF context'), stringToU8a('this is a message'), stringToU8a('extra param'), outAndProof);

  console.log('\tVRF', u8aToHex(outAndProof));
  console.log('\tRES', isValid);

  assert(isValid, 'ERROR: Unable to verify VRF extra output & proof');
}

function vrfSignAndVerifyDeterministic (wasm) {
  const [,, sk] = randomPair(wasm);
  const outAndProof1 = wasm.vrfSign(sk, stringToU8a('my VRF context'), stringToU8a('this is a message'), stringToU8a('extra param'));
  const outAndProof2 = wasm.vrfSign(sk, stringToU8a('my VRF context'), stringToU8a('this is a message'), stringToU8a('extra param'));
  const sig1 = u8aToHex(outAndProof1.slice(0, 32));
  const sig2 = u8aToHex(outAndProof2.slice(0, 32));

  console.log('\tSG1', sig1);
  console.log('\tSG2', sig2);

  assert(sig1 === sig2, 'ERROR: VRF extra outputs are non-deterministic');
}

module.exports = {
  vrfSignAndVerify,
  vrfSignAndVerifyCompat,
  vrfSignAndVerifyDeterministic
};
