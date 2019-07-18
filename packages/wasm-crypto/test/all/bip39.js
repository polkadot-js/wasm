/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const { assert, u8aToHex } = require('@polkadot/util');

module.exports = function (wasm) {
  function bip39_generate () {
    const RESULT = wasm.bip39Generate(21);

    console.log('\tPHR', RESULT);

    assert(RESULT.split(' ').length === 21, 'ERROR: Invalid bip39 Phase length');
  }

  function bip39_validate () {
    const RESULT = wasm.bip39Validate(wasm.bip39Generate(12));

    console.log('\tVAL', RESULT);

    assert(RESULT, 'ERROR: Invalid bip39 validation');
  }

  function bip39_toEntropy () {
    const RESULT = u8aToHex(wasm.bip39ToEntropy('legal winner thank year wave sausage worth useful legal winner thank yellow'));

    console.log('\tENT', RESULT);

    assert(RESULT === '0x7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f', 'ERROR: Invalid bip39 entropy');
  }

  function bip39_toMiniSecret () {
    const RESULT = u8aToHex(wasm.bip39ToMiniSecret('legal winner thank year wave sausage worth useful legal winner thank yellow', 'Substrate'));

    console.log('\tMIN', RESULT);

    assert(RESULT === '0x4313249608fe8ac10fd5886c92c4579007272cb77c21551ee5b8d60b78041685', 'ERROR: Invalid bip39 mini secret');
  }

  function bip39_toSeed () {
    const RESULT = u8aToHex(wasm.bip39ToSeed('seed sock milk update focus rotate barely fade car face mechanic mercy', ''));

    console.log('\tSEE', RESULT);

    assert(RESULT === '0x3c121e20de068083b49c2315697fb59a2d9e8643c24e5ea7628132c58969a027', 'ERROR: Invalid bip39 mini secret');
  }

  return {
    bip39_generate,
    bip39_validate,
    bip39_toEntropy,
    bip39_toMiniSecret,
    bip39_toSeed
  };
};
