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
  bip39Generate: wrapReady(wasm.bip39_generate),
  bip39ToEntropy: wrapReady(wasm.bip39_to_entropy),
  bip39ToMiniSecret: wrapReady(wasm.bip39_to_mini_secret),
  bip39ToSeed: wrapReady(wasm.bip39_to_seed),
  bip39Validate: wrapReady(wasm.bip39_validate),

  ed25519KeypairFromSeed: wrapReady(wasm.ed_from_seed),
  ed25519Sign: wrapReady(wasm.ed_sign),
  ed25519Verify: wrapReady(wasm.ed_verify),

  sr25519DeriveKeypairHard: wrapReady(wasm.sr_derive_keypair_hard),
  sr25519DeriveKeypairSoft: wrapReady(wasm.sr_derive_keypair_soft),
  sr25519DerivePublicSoft: wrapReady(wasm.sr_derive_public_soft),
  sr25519KeypairFromSeed: wrapReady(wasm.sr_from_seed),
  sr25519Sign: wrapReady(wasm.sr_sign),
  sr25519Verify: wrapReady(wasm.sr_verify),

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
