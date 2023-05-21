// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global it */

import { assert, u8aToHex } from '@polkadot/util';

/**
 * @param {*} wasm
 */
export function bip39Generate (wasm) {
  it('generates a bip39 phrase', () => {
    const res = wasm.bip39Generate(21);

    // console.log('\tPHR', res);

    assert(res.split(' ').length === 21, 'ERROR: Invalid bip39 Phase length');
  });
}

/**
 * @param {*} wasm
 */
export function bip39GenerateSubsequent (wasm) {
  it('generates different subsequent mnemonics', () => {
    const val1 = wasm.bip39Generate(24);
    const val2 = wasm.bip39Generate(24);

    // console.log('\tVL1', val1);
    // console.log('\tVL2', val2);

    assert(val1 !== val2, 'ERROR: Subsequent mnemonics are the same');
  });
}

/**
 * @param {*} wasm
 */
export function bip39Validate (wasm) {
  it('validates a created mnemonic', () => {
    const res = wasm.bip39Validate(wasm.bip39Generate(12));

    // console.log('\tVAL', res);

    assert(res, 'ERROR: Invalid bip39 validation');
  });
}

/**
 * @param {*} wasm
 */
export function bip39ToEntropy (wasm) {
  it('creates correct entropy for a known mnemonic', () => {
    const res = u8aToHex(wasm.bip39ToEntropy('legal winner thank year wave sausage worth useful legal winner thank yellow'));

    // console.log('\tENT', res);

    assert(res === '0x7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f', 'ERROR: Invalid bip39 entropy');
  });
}

/**
 * @param {*} wasm
 */
export function bip39ToMiniSecret (wasm) {
  it('creates the correct minisecret from a mnemonic', () => {
    const res = u8aToHex(wasm.bip39ToMiniSecret('legal winner thank year wave sausage worth useful legal winner thank yellow', 'Substrate'));

    // console.log('\tMIN', res);

    assert(res === '0x4313249608fe8ac10fd5886c92c4579007272cb77c21551ee5b8d60b78041685', 'ERROR: Invalid bip39 mini secret');
  });
}

/**
 * @param {*} wasm
 */
export function bip39ToSeed (wasm) {
  it('creates the correct seed for a mnemonic', () => {
    const res = u8aToHex(wasm.bip39ToSeed('seed sock milk update focus rotate barely fade car face mechanic mercy', ''));

    // console.log('\tSEE', res);

    assert(res === '0x3c121e20de068083b49c2315697fb59a2d9e8643c24e5ea7628132c58969a027', 'ERROR: Invalid bip39 mini secret');
  });
}
