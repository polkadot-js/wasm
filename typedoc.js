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
