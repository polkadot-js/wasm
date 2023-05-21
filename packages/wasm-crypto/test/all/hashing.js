// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global it */

import { assert, stringToU8a, u8aToHex } from '@polkadot/util';

/**
 * @param {*} wasm
 */
export function blake2bHash (wasm) {
  it('creates a known blake2b hash', () => {
    const hash = u8aToHex(wasm.blake2b(stringToU8a('abc'), new Uint8Array(), 64));

    // console.log('\tRES', hash);

    assert(hash === '0xba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923', 'ERROR: blake2bHash does not match');
  });
}

/**
 * @param {*} wasm
 */
export function hmacSha256 (wasm) {
  it('creates a known hmacSha256', () => {
    const hash = u8aToHex(wasm.hmacSha256(stringToU8a('secret'), stringToU8a('some message')));

    // console.log('\tRES', hash);

    assert(hash === '0xf28a70b41263840e5c059a0a733336e0957efba87902aa8cca11441d4b0c96d7', 'ERROR: hmacSha256 does not match');
  });
}

/**
 * @param {*} wasm
 */
export function hmacSha512 (wasm) {
  it('creates a known hmacSha512', () => {
    const hash = u8aToHex(wasm.hmacSha512(stringToU8a('secret'), stringToU8a('some message')));

    // console.log('\tRES', hash);

    assert(hash === '0x295832e97ed77be75a9fa98029497e4a722c4b9a2f21b39d34f1befa931a39ec520fd24711d6f5c03501384ea66b83066a01a82c57a0460f8cd1f471fcce5841', 'ERROR: hmacSha512 does not match');
  });
}

/**
 * @param {*} wasm
 */
export function keccak256 (wasm) {
  it('creates a known keccak256 hash', () => {
    const hash = u8aToHex(wasm.keccak256(stringToU8a('test value')));

    // console.log('\tRES', hash);

    assert(hash === '0x2d07364b5c231c56ce63d49430e085ea3033c750688ba532b24029124c26ca5e', 'ERROR: keccak256 does not match');
  });
}

/**
 * @param {*} wasm
 */
export function keccak512 (wasm) {
  it('creates a known keccak512 hash', () => {
    const hash = u8aToHex(wasm.keccak512(stringToU8a('test')));

    // console.log('\tRES', hash);

    assert(hash === '0x1e2e9fc2002b002d75198b7503210c05a1baac4560916a3c6d93bcce3a50d7f00fd395bf1647b9abb8d1afcc9c76c289b0c9383ba386a956da4b38934417789e', 'ERROR: keccak512 does not match');
  });
}

/**
 * @param {*} wasm
 */
export function pbkdf2Hash (wasm) {
  it('creates a known pbkdf2 hash', () => {
    const hash = u8aToHex(wasm.pbkdf2(stringToU8a('hello world'), stringToU8a('this is a salt'), 2048));

    // console.log('\tRES', hash);

    assert(hash === '0x5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270', 'ERROR: pbkdf2Hash does not match');
  });
}

/**
 * @param {*} wasm
 */
export function scryptHash (wasm) {
  it('creates a known scrypt hash', () => {
    const hash = u8aToHex(wasm.scrypt(stringToU8a('password'), stringToU8a('salt'), 14, 8, 1));

    // console.log('\tRES', hash);

    assert(hash === '0x745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6', 'ERROR: scryptHash does not match');
  });
}

/**
 * @param {*} wasm
 */
export function sha256Hash (wasm) {
  it('creates a known sha256 hash', () => {
    const hash = u8aToHex(wasm.sha256(stringToU8a('hello world')));

    // console.log('\tRES', hash);

    assert(hash === '0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', 'ERROR: sha256Hash does not match');
  });
}

/**
 * @param {*} wasm
 */
export function sha512Hash (wasm) {
  it('creates a known sha512 hash', () => {
    const hash = u8aToHex(wasm.sha512(stringToU8a('hello world')));

    // console.log('\tRES', hash);

    assert(hash === '0x309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f', 'ERROR: sha512Hash does not match');
  });
}

/**
 * @param {*} wasm
 */
export function twoxHash (wasm) {
  it('creates a known twox hash', () => {
    const hash64 = u8aToHex(wasm.twox(stringToU8a('abc'), 1));
    const hash256 = u8aToHex(wasm.twox(stringToU8a('abc'), 4));

    // console.log('\t64 ', hash64);
    // console.log('\t256', hash256);

    assert(hash64 === '0x990977adf52cbc44' && hash256 === '0x990977adf52cbc440889329981caa9bef7da5770b2b8a05303b75d95360dd62b', 'ERROR: twoxHash does not match');
  });
}
