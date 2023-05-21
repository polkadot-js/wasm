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
  return [pair, pair.slice(32), pair.slice(0, 32)];
}

/**
 * @internal
 * @param {*} wasm
 */
function randomPair (wasm) {
  return extractKeys(wasm.ed25519KeypairFromSeed(crypto.randomBytes(32)));
}

/**
 * @param {*} wasm
 */
export function ed25519PairFromSeed (wasm) {
  it('creates a known pair from a known seed', () => {
    const [pair, pk, sk] = extractKeys(wasm.ed25519KeypairFromSeed(stringToU8a('12345678901234567890123456789012')));

    // console.log('\tSEC', u8aToHex(sk));
    // console.log('\tPUB', u8aToHex(pk));

    assert(u8aToHex(sk) === '0x3132333435363738393031323334353637383930313233343536373839303132', 'Secretkey does not match');
    assert(u8aToHex(pk) === '0x2f8c6129d816cf51c374bc7f08c3e63ed156cf78aefb4a6550d97b87997977ee', 'Public key does not match');
    assert(u8aToHex(pair) === '0x31323334353637383930313233343536373839303132333435363738393031322f8c6129d816cf51c374bc7f08c3e63ed156cf78aefb4a6550d97b87997977ee', 'ERROR: pairFromSeed() does not match');
  });
}

/**
 * @param {*} wasm
 */
export function ed25519SignAndVerify (wasm) {
  it('signs and verifies', () => {
    const [, pk, sk] = randomPair(wasm);
    const signature = wasm.ed25519Sign(pk, sk, stringToU8a('this is a message'));
    const isValid = wasm.ed25519Verify(signature, stringToU8a('this is a message'), pk);

    // console.log('\tSIG', u8aToHex(signature));
    // console.log('\tRES', isValid);

    assert(isValid, 'ERROR: Unable to verify signature');
  });
}

/**
 * @param {*} wasm
 */
export function ed25519VerifyExisting (wasm) {
  it('verifies a known signature', () => {
    const isValid = wasm.ed25519Verify(hexToU8a('0x90588f3f512496f2dd40571d162e8182860081c74e2085316e7c4396918f07da412ee029978e4dd714057fe973bd9e7d645148bf7b66680d67c93227cde95202'), stringToU8a('this is a message'), hexToU8a('0x2f8c6129d816cf51c374bc7f08c3e63ed156cf78aefb4a6550d97b87997977ee'));

    // console.log('\tRES', isValid);

    assert(isValid, 'ERROR: Unable to verify signature');
  });
}

/**
 * @param {*} wasm
 */
export function ed25519Benchmark (wasm) {
  it('runs a verification benchamark', () => {
    const MESSAGE = stringToU8a('this is a message');

    for (let i = 0; i < 256; i++) {
      const [, pk, sk] = randomPair(wasm);

      assert(wasm.ed25519Verify(wasm.ed25519Sign(pk, sk, MESSAGE), MESSAGE, pk), 'ERROR: Unable to verify signature');
    }
  });
}
