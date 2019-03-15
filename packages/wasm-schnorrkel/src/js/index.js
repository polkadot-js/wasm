// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const stubbed = require('./wasm_schnorrkel');

module.exports.isReady = stubbed.isReady;
module.exports.keypairFromSeed = stubbed.keypair_from_seed;
module.exports.secretFromSeed = stubbed.secret_from_seed;
module.exports.sign = stubbed.sign;
module.exports.softDeriveKeypair = stubbed.soft_derive_keypair;
module.exports.softDerivePublic = stubbed.soft_derive_public;
module.exports.softDeriveSecret = stubbed.soft_derive_secret;
module.exports.verify = stubbed.verify;
module.exports.waitReady = stubbed.waitReady;
