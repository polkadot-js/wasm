// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createBundle } from '@polkadot/dev/config/rollup';

const pkgs = [
  '@polkadot/wasm-crypto'
];

const external = [
  ...pkgs,
  '@polkadot/util'
];

const overrides = {
  '@polkadot/wasm-crypto': {
    entries: ['bridge', 'crypto-init', 'crypto-asmjs', 'crypto-wasm', 'util'].reduce((all, p) => ({
      ...all,
      [`@polkadot/wasm-${p}`]: `../../wasm-${p}/build/bundle.js`
    }), {}),
  }
};

export default pkgs.map((pkg) =>
  createBundle({
    external,
    pkg,
    ...(overrides[pkg] || {})
  })
);
