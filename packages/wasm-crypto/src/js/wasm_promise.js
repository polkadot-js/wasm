/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const pkg = require('./package.json');
const asm = require('./wasm_asm_stub');
const bytes = require('./wasm_wasm');
const js = require('./wasm');

module.exports = async function createExportPromise () {
  const imports = {
    './wasm': js
  };

  if (WebAssembly) {
    try {
      const { instance } = await WebAssembly.instantiate(bytes, imports);

      return instance.exports;
    } catch (error) {
      console.error(`ERROR: Unable to initialize WebAssembly for ${pkg.name} ${pkg.version}`);
      console.error(error);
    }
  }

  return asm;
};
