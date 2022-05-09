// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    '@polkadot/wasm-crypto-init(.*)$': '<rootDir>/packages/wasm-crypto-init/build/$1',
    '@polkadot/wasm-data-(asmjs|wasm)(.*)$': '<rootDir>/packages/wasm-data-$1/build/$2',
    // eslint-disable-next-line sort-keys
    '@polkadot/wasm-crypto(.*)$': '<rootDir>/packages/wasm-crypto/src/$1'
  }
};
