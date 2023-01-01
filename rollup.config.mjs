// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createBundle } from '@polkadot/dev/config/rollup';

const pkgs = [
  '@polkadot/wasm-crypto'
];

const external = [
  ...pkgs,
  '@polkadot/util'
];

const overrides = pkgs
  .map((n) => n.replace('@polkadot/wasm-', ''))
  .reduce((map, n) => ({
    ...map,
    [`@polkadot/wasm-${n}`]: {
      entries: [
        'bridge',
        'util',
        ...['init', 'asmjs', 'wasm'].map((p) => `${n}-${p}`)
      ].reduce((all, p) => ({
        ...all,
        [`@polkadot/wasm-${p}`]: `../../wasm-${p}/build/bundle.js`
      }), {})
    }
  }), {});

export default pkgs.map((pkg) =>
  createBundle({
    external,
    pkg,
    ...(overrides[pkg] || {})
  })
);
