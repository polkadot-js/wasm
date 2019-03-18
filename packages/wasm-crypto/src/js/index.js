// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const stubbed = require('./wasm');

module.exports.blake2b = stubbed.blake2b;
module.exports.pbkdf2 = stubbed.pbkdf2;
module.exports.sha512 = stubbed.sha512;
module.exports.twox = stubbed.twox;

module.exports.isReady = stubbed.isReady;
module.exports.waitReady = stubbed.waitReady;
