// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const pkg = require('./package.json');
const asm = require('./wasm_asm_stub');
const bytes = require('./wasm_wasm');
const imports = require('./wasm');

module.exports = async function createExportPromise () {
  try {
    const { instance } = await WebAssembly.instantiate(bytes, { __wbindgen_placeholder__: imports });

    return instance.exports;
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asm && asm.ext_blake2b) {
      return asm;
    }

    console.error(`ERROR: Unable to initialize ${pkg.name} ${pkg.version}`);
    console.error(error);

    return null;
  }
};
