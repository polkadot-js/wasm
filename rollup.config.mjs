// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createBundle } from '@polkadot/dev/config/rollup';

const pkgs = [
  '@polkadot/wasm-crypto'
];

const external = [
  ...pkgs,
  '@polkadot/util',
  '@polkadot/x-randomvalues'
];

const overrides = {
  '@polkadot/wasm-crypto': {
    entries: ['wasm-crypto-asmjs', 'wasm-crypto-wasm'].map((p) => ({
      find: `@polkadot/${p}`,
      replacement: `../../${p}/build`
    }))
  }
};

export default pkgs.map((pkg) =>
  createBundle({ external, pkg, ...(overrides[pkg] || {}) })
);
