// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const stubbed = require('./wasm');

module.exports.deriveKeypairHard = stubbed.derive_keypair_hard;
module.exports.deriveKeypairSoft = stubbed.derive_keypair_soft;
module.exports.derivePublicSoft = stubbed.derive_public_soft;
module.exports.keypairFromSeed = stubbed.keypair_from_seed;
module.exports.sign = stubbed.sign;
module.exports.verify = stubbed.verify;

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
