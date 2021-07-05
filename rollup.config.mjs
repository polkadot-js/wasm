// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createInput, createOutput, createPlugins } from '@polkadot/dev/config/rollup';

const external = [
  '@polkadot/util',
  '@polkadot/x-randomvalues'
];

export default [
  {
    external,
    input: createInput('wasm-crypto'),
    output: createOutput('wasm-crypto', external),
    plugins: createPlugins(
      ['wasm-crypto-asmjs', 'wasm-crypto-wasm'].map((p) => ({
        find: `@polkadot/${p}`,
        replacement: `../../${p}/build`
      }))
    )
  }
];
