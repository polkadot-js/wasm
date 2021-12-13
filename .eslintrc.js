// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@polkadot/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    '**/target/*',
    'scripts/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './packages/**/tsconfig.json'
    ]
  }
};
