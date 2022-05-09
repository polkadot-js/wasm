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
      '@polkadot/wasm-crypto-init': '../../wasm-crypto-init/build',
      '@polkadot/wasm-data-asmjs': '../../../wasm-data-asmjs/build',
      '@polkadot/wasm-data-wasm': '../../../wasm-data-wasm/build',
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
