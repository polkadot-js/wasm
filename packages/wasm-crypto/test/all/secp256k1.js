// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global it */

import { assert, hexToU8a, u8aToHex } from '@polkadot/util';

/**
 * @param {*} wasm
 */
export function secp256k1Compress (wasm) {
  it('compresses a known publicKey', () => {
    const pubkey = '0x04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af';
    const result = u8aToHex(wasm.secp256k1Compress(hexToU8a(pubkey)));

    // console.log('\tRES', result);

    assert(result === '0x03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077', 'ERROR: secp256k1Compress does not match');
  });
}

/**
 * @param {*} wasm
 */
export function secp256k1Expand (wasm) {
  it('expands a known compressed key', () => {
    const pubkey = '0x03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077';
    const result = u8aToHex(wasm.secp256k1Expand(hexToU8a(pubkey)));

    // console.log('\tRES', result);

    assert(result === '0x04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af', 'ERROR: secp256k1Expand does not match');
  });
}

/**
 * @param {*} wasm
 */
export function secp256k1FromSeed1 (wasm) {
  it('creates a known pair from seed (1)', () => {
    const seckey = '0x4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae';
    const result = u8aToHex(wasm.secp256k1FromSeed(hexToU8a(seckey)));

    // console.log('\tRES', result);

    assert(result === '0x4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae03fd8c74f795ced92064b86191cb2772b1e3a0947740aa0a5a6e379592471fd85b', 'ERROR: secp256k1FromSeed does not match');
  });
}

/**
 * @param {*} wasm
 */
export function secp256k1FromSeed2 (wasm) {
  it('creates a known pair from seed (2)', () => {
    // https://github.com/polkadot-js/wasm/issues/307
    const seckey = new Uint8Array([
      203, 109, 249, 222, 30, 252, 167, 163, 153, 138, 142,
      173, 78, 2, 21, 157, 95, 169, 156, 62, 13, 79,
      214, 67, 38, 103, 57, 11, 180, 114, 104, 84
    ]);
    const expected = u8aToHex(new Uint8Array([
      203, 109, 249, 222, 30, 252, 167, 163, 153, 138, 142,
      173, 78, 2, 21, 157, 95, 169, 156, 62, 13, 79,
      214, 67, 38, 103, 57, 11, 180, 114, 104, 84, 2,
      10, 16, 145, 52, 31, 229, 102, 75, 250, 23, 130,
      213, 224, 71, 121, 104, 144, 104, 201, 22, 176, 76,
      179, 101, 236, 49, 83, 117, 86, 132, 217, 161
    ]));
    const result = u8aToHex(wasm.secp256k1FromSeed(seckey));

    // console.log('\tRES', result);

    assert(result === expected, 'ERROR: secp256k1FromSeed does not match');
  });
}

/**
 * @param {*} wasm
 */
export function secp256k1Recover (wasm) {
  it('recovers a publicKey from signature', () => {
    const sig = '0x7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff';
    const msg = '0xa30b64ce1eedf409c8afb801d72c05234e64849ea538c15dd3c8cf4ffcf166c9';
    const result = u8aToHex(wasm.secp256k1Recover(hexToU8a(msg), hexToU8a(sig), 0));

    // console.log('\tRES', result);

    assert(result === '0x028d13da15a02f3a70677339d51b14177ee9b49657662b35e56a9d9dee17db1d30', 'ERROR: secp256k1Recover does not match');
  });
}

/**
 * @param {*} wasm
 */
export function secp256k1Sign (wasm) {
  it('creates a known signature', () => {
    const sec = '0x4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae';
    const msg = '0x68c731589a583d08b70861683b59ce3dd56284cb2f0da5b6cd83e6641dac3aab';
    const result = u8aToHex(wasm.secp256k1Sign(hexToU8a(msg), hexToU8a(sec)));

    // console.log('\tRES', result);

    assert(result === '0xdf92f73d9f060cefacf187b5414491cb992998ace017fa48839b5cda3e264ba83b105adec9e9872647a7d8bb28855b45e22805aea3d097953cbb1391f671d13e01', 'ERROR: secp256k1Sign does not match');
  });
}
