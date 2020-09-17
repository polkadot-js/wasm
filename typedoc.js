// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  exclude: '**/*+(index|e2e|spec).ts',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
  hideGenerator: true,
  includeDeclarations: false,
  mdEngine: 'gitbook',
  module: 'commonjs',
  moduleResolution: 'node',
  name: 'Polkadot JS WASM',
  out: 'docs',
  stripInternal: 'true',
  theme: 'markdown'
};
