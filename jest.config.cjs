// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/wasm-crypto-asmjs(.*)$': '<rootDir>/packages/wasm-crypto-asmjs/build/$1',
    '@polkadot/wasm-crypto-wasm(.*)$': '<rootDir>/packages/wasm-crypto-wasm/build/$1',
    // eslint-disable-next-line sort-keys
    '@polkadot/wasm-crypto(.*)$': '<rootDir>/packages/wasm-crypto/src/$1'
  }
});
