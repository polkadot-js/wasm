// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global it */

import crypto from 'crypto';

import { assert, hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';

/**
 * @internal
 * @param {*} pair
 */
function extractKeys (pair) {
  return [pair, pair.slice(64), pair.slice(0, 64)];
}

/**
 * @internal
 * @param {*} wasm
 */
function randomPair (wasm) {
  return extractKeys(wasm.sr25519KeypairFromSeed(crypto.randomBytes(32)));
}

/**
 * @param {*} wasm
 */
export function sr25519PairFromSeed (wasm) {
  it('creates a known pair from a known seed', () => {
    const pair = wasm.sr25519KeypairFromSeed(stringToU8a('12345678901234567890123456789012'));

    // console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
    // console.log('\tPUB', u8aToHex(pair.slice(64)));

    assert(u8aToHex(pair) === '0xf0106660c3dda23f16daa9ac5b811b963077f5bc0af89f85804f0de8e424f050f98d66f39442506ff947fd911f18c7a7a5da639a63e8d3b4e233f74143d951c1741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63', 'ERROR: pairFromSeed() does not match');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DevFromSeed (wasm) {
  it('creates a known development pair', () => {
    const pair = wasm.sr25519KeypairFromSeed(hexToU8a('0xfac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e'));

    // console.log('\tSEC', u8aToHex(pair.slice(0, 64)));
    // console.log('\tPUB', u8aToHex(pair.slice(64)));

    assert(u8aToHex(pair) === '0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a', 'ERROR: devFromSeed() does not match');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519VerifyExisting (wasm) {
  it('verifies a known signature', () => {
    const PK = hexToU8a('0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
    const MESSAGE = stringToU8a('I hereby verify that I control 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    const SIGNATURE = hexToU8a('0xb83881d3bd7302981ee1c504fe5b7b394682927131fc0846fd616bb40fa14d02640fd2aca785b4cb57904765c2e4e75f59a7dd30154c209964369912091f6981');

    const isValid = wasm.sr25519Verify(SIGNATURE, MESSAGE, PK);

    // console.log('\tRES', isValid);

    assert(isValid, 'ERROR: Unable to verify signature');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519SignDeterministic (wasm) {
  it('creates non-deterministic signatures', () => {
    const [, pk, sk] = randomPair(wasm);
    const sig1 = u8aToHex(wasm.sr25519Sign(pk, sk, stringToU8a('this is a message')));
    const sig2 = u8aToHex(wasm.sr25519Sign(pk, sk, stringToU8a('this is a message')));

    // console.log('\tSG1', sig1);
    // console.log('\tSG2', sig2);

    assert(sig1 !== sig2, 'ERROR: Signatures are deterministic');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519SignAndVerify (wasm) {
  it('verifies a created signature', () => {
    const [, pk, sk] = randomPair(wasm);
    const signature = wasm.sr25519Sign(pk, sk, stringToU8a('this is a message'));
    const isValid = wasm.sr25519Verify(signature, stringToU8a('this is a message'), pk);

    // console.log('\tSIG', u8aToHex(signature));
    // console.log('\tRES', isValid);

    assert(isValid, 'ERROR: Unable to verify signature');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DeriveHard (wasm) {
  it('derives using a hard path', () => {
    const [pair] = randomPair(wasm);
    const derived = wasm.sr25519DeriveKeypairHard(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

    // console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
    // console.log('\tPUB', u8aToHex(derived.slice(64)));

    assert(derived.length === 96, 'Derived key length mismatch');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DeriveHardKnown (wasm) {
  it('derives a known hard key', () => {
    const derived = wasm.sr25519DeriveKeypairHard(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x14416c6963650000000000000000000000000000000000000000000000000000'));
    const publicKey = u8aToHex(derived.slice(64));

    // console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
    // console.log('\tPUB', publicKey);

    assert(publicKey === '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', 'Unmatched resulting public keys');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DeriveSoft (wasm) {
  it('derives using a soft path', () => {
    const [pair] = randomPair(wasm);
    const derived = wasm.sr25519DeriveKeypairSoft(pair, hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));

    // console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
    // console.log('\tPUB', u8aToHex(derived.slice(64)));

    assert(derived.length === 96, 'Derived key length mismatch');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DeriveSoftKnown (wasm) {
  it('derives a known soft key', () => {
    const derived = wasm.sr25519DeriveKeypairSoft(hexToU8a('0x28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000'));
    const publicKey = u8aToHex(derived.slice(64));

    // console.log('\tSEC', u8aToHex(derived.slice(0, 64)));
    // console.log('\tPUB', publicKey);

    assert(publicKey === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519DeriveSoftPubkey (wasm) {
  it('derives a known soft publicKey', () => {
    const derived = u8aToHex(wasm.sr25519DerivePublicSoft(hexToU8a('0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'), hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000')));

    // console.log('\tPUB', derived);

    assert(derived === '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a', 'Unmatched resulting public keys');
  });
}

/**
 * @param {*} wasm
 */
export function sr25519KeyAgreement (wasm) {
  it('allows for agreements', () => {
    const pair1 = wasm.sr25519KeypairFromSeed(hexToU8a('0x3b44c558f9a8f3dc9690d53088558c1ba2529b677e316c6054d1852595b004af'));
    const pair2 = wasm.sr25519KeypairFromSeed(hexToU8a('0x923b80f79c6981fe756272128ec236eb510ae016dd20bdccbd77a9416b7ab94e'));
    const [, pk1, sk1] = extractKeys(pair1);
    const [, pk2, sk2] = extractKeys(pair2);

    assert(u8aToHex(wasm.sr25519Agree(pk1, sk2)) === '0xfa7b90001b790fe42ff78b8cd86f6cf7a7c0a70b72f6b4c771b5d67536450222', 'Unmatched agreement keys');
    assert(u8aToHex(wasm.sr25519Agree(pk2, sk1)) === '0xfa7b90001b790fe42ff78b8cd86f6cf7a7c0a70b72f6b4c771b5d67536450222', 'Unmatched agreement keys');

    for (let i = 0; i < 256; i++) {
      const [, pk1, sk1] = randomPair(wasm);
      const [, pk2, sk2] = randomPair(wasm);

      assert(u8aToHex(wasm.sr25519Agree(pk1, sk2)) === u8aToHex(wasm.sr25519Agree(pk2, sk1)), 'Unmatched agreement keys');
    }
  });
}

/**
 * @param {*} wasm
 */
export function sr25519Benchmark (wasm) {
  it('runs a verification benchmark', () => {
    const MESSAGE = stringToU8a('this is a message');

    for (let i = 0; i < 256; i++) {
      const [, pk, sk] = randomPair(wasm);

      assert(wasm.sr25519Verify(wasm.sr25519Sign(pk, sk, MESSAGE), MESSAGE, pk), 'ERROR: Unable to verify signature');
    }
  });
}
