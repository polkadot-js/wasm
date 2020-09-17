// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
