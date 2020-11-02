// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('./crypto-polyfill');

const stubbed = require('./wbindgen');

module.exports = require('./exports')(stubbed);
