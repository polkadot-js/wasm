// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

const { assert } = require('@polkadot/util');

const wasm = require('./exports');

const INIT_ERROR = 'The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.';

function wrapReady (fn) {
  return (...params) => {
    assert(wasm.isReady(), INIT_ERROR);

    return fn(...params);
  };
}

module.exports = {
  bip39Generate: wrapReady(wasm.bip39Generate),
  bip39ToEntropy: wrapReady(wasm.bip39ToEntropy),
  bip39ToMiniSecret: wrapReady(wasm.bip39ToMiniSecret),
  bip39ToSeed: wrapReady(wasm.bip39ToSeed),
  bip39Validate: wrapReady(wasm.bip39Validate),

  ed25519KeypairFromSeed: wrapReady(wasm.edFromSeed),
  ed25519Sign: wrapReady(wasm.edSign),
  ed25519Verify: wrapReady(wasm.edVerify),

  sr25519DeriveKeypairHard: wrapReady(wasm.srDeriveKeypairHard),
  sr25519DeriveKeypairSoft: wrapReady(wasm.srDeriveKeypairSoft),
  sr25519DerivePublicSoft: wrapReady(wasm.srDerivePublicSoft),
  sr25519KeypairFromSeed: wrapReady(wasm.srFromSeed),
  sr25519Sign: wrapReady(wasm.srSign),
  sr25519Verify: wrapReady(wasm.srVerify),

  blake2b: wrapReady(wasm.blake2b),
  keccak256: wrapReady(wasm.keccak256),
  pbkdf2: wrapReady(wasm.pbkdf2),
  scrypt: wrapReady(wasm.scrypt),
  sha512: wrapReady(wasm.sha512),
  twox: wrapReady(wasm.twox),

  // secp256k1IsRecoverable: wrapReady(wasm.secp256k1_is_recoverable);
  // secp256k1Recover: wrapReady(wasm.secp256k1_recover);

  isReady: wasm.isReady,
  waitReady: wasm.waitReady
};
