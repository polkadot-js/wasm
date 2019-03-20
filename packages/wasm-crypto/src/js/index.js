// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const stubbed = require('./wasm');

module.exports.bip39Generate = stubbed.ext_bip39_generate;
module.exports.bip39ToEntropy = stubbed.ext_bip39_to_entropy;
module.exports.bip39ToMiniSecret = stubbed.ext_bip39_to_mini_secret;
module.exports.bip39Validate = stubbed.ext_bip39_validate
module.exports.blake2b = stubbed.ext_blake2b;
module.exports.pbkdf2 = stubbed.ext_pbkdf2;
module.exports.sha512 = stubbed.ext_sha512;
module.exports.twox = stubbed.ext_twox;

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
