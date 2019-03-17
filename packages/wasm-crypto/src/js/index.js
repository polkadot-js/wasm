// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const stubbed = require('./wasm');

module.exports.pbkdf2Hash = stubbed.pbkdf2_hash;

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
