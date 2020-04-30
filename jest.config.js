// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const config = require('@polkadot/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/wasm-(schnorrkel)(.*)$': '<rootDir>/packages/wasm-$1/src/$2'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/wasm-schnorrkel/build'
  ],
  resolver: './jest.resolver.js'
});
