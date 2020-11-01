// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { assert } = require('@polkadot/util');

const pkg = require('./package.json');
const asm = require('./wasm_asm_stub');
const bytes = require('./wasm_wasm');
const imports = require('./wasm');

module.exports = async function createExportPromise () {
  try {
    assert(typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function', 'Global crypto.getRandomValues is not available. Provide the proper polyfills for this function in your environment.');
  } catch (error) {
    console.error(`ERROR: Unable to initialize ${pkg.name} ${pkg.version}`);
    console.error(error);

    throw error;
  }

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
