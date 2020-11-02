// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

require('./crypto-polyfill');

const { assert } = require('@polkadot/util');

const wbindgen = require('./wbindgen');

const INIT_ERROR = 'The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.';

function wrapReady (fn) {
  return (...params) => {
    assert(wbindgen.isReady(), INIT_ERROR);

    return fn(...params);
  };
}

module.exports = {
  bip39Generate: wrapReady(wbindgen.bip39_generate),
  bip39ToEntropy: wrapReady(wbindgen.bip39_to_entropy),
  bip39ToMiniSecret: wrapReady(wbindgen.bip39_to_mini_secret),
  bip39ToSeed: wrapReady(wbindgen.bip39_to_seed),
  bip39Validate: wrapReady(wbindgen.bip39_validate),

  ed25519KeypairFromSeed: wrapReady(wbindgen.ed_from_seed),
  ed25519Sign: wrapReady(wbindgen.ed_sign),
  ed25519Verify: wrapReady(wbindgen.ed_verify),

  sr25519DeriveKeypairHard: wrapReady(wbindgen.sr_derive_keypair_hard),
  sr25519DeriveKeypairSoft: wrapReady(wbindgen.sr_derive_keypair_soft),
  sr25519DerivePublicSoft: wrapReady(wbindgen.sr_derive_public_soft),
  sr25519KeypairFromSeed: wrapReady(wbindgen.sr_from_seed),
  sr25519Sign: wrapReady(wbindgen.sr_sign),
  sr25519Verify: wrapReady(wbindgen.sr_verify),

  blake2b: wrapReady(wbindgen.blake2b),
  keccak256: wrapReady(wbindgen.keccak256),
  pbkdf2: wrapReady(wbindgen.pbkdf2),
  scrypt: wrapReady(wbindgen.scrypt),
  sha512: wrapReady(wbindgen.sha512),
  twox: wrapReady(wbindgen.twox),

  // secp256k1IsRecoverable: wrapReady(wbindgen.secp256k1_is_recoverable);
  // secp256k1Recover: wrapReady(wbindgen.secp256k1_recover);

  isReady: wbindgen.isReady,
  waitReady: wbindgen.waitReady
};
