// Copyright 2017-2025 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import baseConfig from '@polkadot/dev/config/eslint';

export default [
  ...baseConfig,
  {
    ignores: [
      'mod.ts'
    ]
  }
];
