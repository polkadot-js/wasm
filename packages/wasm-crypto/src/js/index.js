// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const stubbed = require('./wasm');

module.exports.blake2bHash = stubbed.blake2b_hash
module.exports.pbkdf2Hash = stubbed.pbkdf2_hash;
module.exports.sha512Hash = stubbed.sha512_hash;

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
