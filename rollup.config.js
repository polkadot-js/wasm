// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  external: [
    '@polkadot/util',
    '@polkadot/x-randomvalues'
  ],
  globals: {
    '@polkadot/util': 'rollup-pjs-util',
    '@polkadot/x-randomvalues': 'rollup-pjs-x-randomvalues'
  },
  input: 'packages/wasm-crypto/build/index.js',
  output: {
    file: 'build/wasm-crypto/rollup-pjs-wasm-crypto.js',
    format: 'module'
  },
  plugins: [
    alias({
      entries: [
        { find: '@polkadot/wasm-crypto-asmjs', replacement: '../../wasm-crypto-asmjs/build' },
        { find: '@polkadot/wasm-crypto-wasm', replacement: '../../wasm-crypto-wasm/build' }
      ]
    }),
    nodeResolve(),
    commonjs()
  ]
};
