/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const { assert } = require('@polkadot/util');

const INIT_ERRROR = '@polkadot/wasm-crypto has not been initialized';

module.exports = function (stubbed) {
  const wrapReady = (fn) =>
    (...params) => {
      assert(stubbed.isReady(), INIT_ERRROR);

      return fn(...params);
    };

  return {
    bip39Generate: wrapReady(stubbed.ext_bip39_generate),
    bip39ToEntropy: wrapReady(stubbed.ext_bip39_to_entropy),
    bip39ToMiniSecret: wrapReady(stubbed.ext_bip39_to_mini_secret),
    bip39ToSeed: wrapReady(stubbed.ext_bip39_to_seed),
    bip39Validate: wrapReady(stubbed.ext_bip39_validate),

    ed25519KeypairFromSeed: wrapReady(stubbed.ext_ed_from_seed),
    ed25519Sign: wrapReady(stubbed.ext_ed_sign),
    ed25519Verify: wrapReady(stubbed.ext_ed_verify),

    sr25519DeriveKeypairHard: wrapReady(stubbed.ext_sr_derive_keypair_hard),
    sr25519DeriveKeypairSoft: wrapReady(stubbed.ext_sr_derive_keypair_soft),
    sr25519DerivePublicSoft: wrapReady(stubbed.ext_sr_derive_public_soft),
    sr25519KeypairFromSeed: wrapReady(stubbed.ext_sr_from_seed),
    sr25519Sign: wrapReady(stubbed.ext_sr_sign),
    sr25519Verify: wrapReady(stubbed.ext_sr_verify),

    blake2b: wrapReady(stubbed.ext_blake2b),
    keccak256: wrapReady(stubbed.ext_keccak256),
    pbkdf2: wrapReady(stubbed.ext_pbkdf2),

    // secp256k1IsRecoverable: wrapReady(stubbed.ext_secp256k1_is_recoverable);
    // secp256k1Recover: wrapReady(stubbed.ext_secp256k1_recover);

    sha512: wrapReady(stubbed.ext_sha512),
    twox: wrapReady(stubbed.ext_twox),

    isReady: stubbed.isReady,
    waitReady: stubbed.waitReady
  };
};
