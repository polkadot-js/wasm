// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const { assert } = require('@polkadot/util');
const stubbed = require('./wasm');

const INIT_ERRROR = '@polkadot/wasm-crypto has not been initialized';

const wrapReady = (fn) =>
  (...params) => {
    assert(stubbed.isReady(), INIT_ERRROR);

    return fn(...params);
  };

module.exports.bip39Generate = wrapReady(stubbed.ext_bip39_generate);
module.exports.bip39ToEntropy = wrapReady(stubbed.ext_bip39_to_entropy);
module.exports.bip39ToMiniSecret = wrapReady(stubbed.ext_bip39_to_mini_secret);
module.exports.bip39ToSeed = wrapReady(stubbed.ext_bip39_to_seed);
module.exports.bip39Validate = wrapReady(stubbed.ext_bip39_validate);

module.exports.ed25519KeypairFromSeed = wrapReady(stubbed.ext_ed_from_seed);
module.exports.ed25519Sign = wrapReady(stubbed.ext_ed_sign);
module.exports.ed25519Verify = wrapReady(stubbed.ext_ed_verify);

module.exports.sr25519DeriveKeypairHard = wrapReady(stubbed.ext_sr_derive_keypair_hard);
module.exports.sr25519DeriveKeypairSoft = wrapReady(stubbed.ext_sr_derive_keypair_soft);
module.exports.sr25519DerivePublicSoft = wrapReady(stubbed.ext_sr_derive_public_soft);
module.exports.sr25519KeypairFromSeed = wrapReady(stubbed.ext_sr_from_seed);
module.exports.sr25519Sign = wrapReady(stubbed.ext_sr_sign);
module.exports.sr25519Verify = wrapReady(stubbed.ext_sr_verify);

module.exports.blake2b = wrapReady(stubbed.ext_blake2b);
module.exports.keccak256 = wrapReady(stubbed.ext_keccak256);
module.exports.pbkdf2 = wrapReady(stubbed.ext_pbkdf2);
// module.exports.secp256k1IsRecoverable = wrapReady(stubbed.ext_secp256k1_is_recoverable);
// module.exports.secp256k1Recover = wrapReady(stubbed.ext_secp256k1_recover);
module.exports.sha512 = wrapReady(stubbed.ext_sha512);
module.exports.twox = wrapReady(stubbed.ext_twox);

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
