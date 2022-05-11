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
    entries: {
      '@polkadot/wasm-bridge': '../../wasm-bridge/build/bundle.js',
      '@polkadot/wasm-crypto-init': '../../wasm-crypto-init/build/wasm.js',
      '@polkadot/wasm-crypto-asmjs': '../../wasm-crypto-asmjs/build/bundle.js',
      '@polkadot/wasm-crypto-wasm': '../../wasm-crypto-wasm/build/bundle.js',
    }
  }
};

export default pkgs.map((pkg) =>
  createBundle({
    external,
    pkg,
    ...(overrides[pkg] || {})
  })
);
