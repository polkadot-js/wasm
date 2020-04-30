// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
