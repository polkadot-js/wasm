// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const external = [
  '@polkadot/util',
  '@polkadot/x-randomvalues'
];

const globals = {
  '@polkadot/util': 'polkadotUtil',
  '@polkadot/x-randomvalues': 'polkadotXRandomvalues'
};

export default [
  {
    external,
    input: 'packages/wasm-crypto/build/index.js',
    output: {
      file: 'build/wasm-crypto/bundle/polkadotWasmCrypto.js',
      format: 'iife',
      globals,
      name: 'polkadotWasmCrypto',
      preferConst: true
    },
    plugins: [
      alias({
        entries: [
          { find: '@polkadot/wasm-crypto-asmjs', replacement: '../../wasm-crypto-asmjs/build' },
          { find: '@polkadot/wasm-crypto-wasm', replacement: '../../wasm-crypto-wasm/build' }
        ]
      }),
      nodeResolve({ browser: true }),
      commonjs()
    ]
  }
];
