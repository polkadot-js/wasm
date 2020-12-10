// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/bytes-asmjs-crypto(.*)$': '<rootDir>/packages/bytes-asmjs-crypto/build/$1',
    '@polkadot/bytes-wasm-crypto(.*)$': '<rootDir>/packages/bytes-wasm-crypto/build/$1',
    '@polkadot/wasm-crypto(.*)$': '<rootDir>/packages/wasm-crypto/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/bytes-asmjs-crypto/build',
    '<rootDir>/packages/bytes-wasm-crypto/build',
    '<rootDir>/packages/wasm-crypto/build'
  ],
  resolver: '@polkadot/dev/config/jest-resolver.cjs'
});
