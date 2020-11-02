// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { assert, stringToU8a, u8aToString } = require('@polkadot/util');

const pkg = require('./package.json');

let wasm;
let cachegetInt32 = null;
let cachegetUint8 = null;

async function initWasm (wasmBytes, asmFallback, wbg) {
  try {
    assert(typeof WebAssembly !== 'undefined', 'WebAssembly is not available in your environment');

    const source = await WebAssembly.instantiate(wasmBytes, { wbg });

    wasm = source.instance.exports;
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asmFallback && asmFallback.ext_blake2b) {
      wasm = asmFallback;
    } else {
      console.error(`ERROR: Unable to initialize ${pkg.name} ${pkg.version}`);
      console.error(error);

      wasm = null;
    }
  }
}

function getInt32 () {
  if (cachegetInt32 === null || cachegetInt32.buffer !== wasm.memory.buffer) {
    cachegetInt32 = new Int32Array(wasm.memory.buffer);
  }

  return cachegetInt32;
}

function getUint8 () {
  if (cachegetUint8 === null || cachegetUint8.buffer !== wasm.memory.buffer) {
    cachegetUint8 = new Uint8Array(wasm.memory.buffer);
  }

  return cachegetUint8;
}

function getU8a (ptr, len) {
  return getUint8().subarray(ptr / 1, ptr / 1 + len);
}

function getString (ptr, len) {
  return u8aToString(getUint8().subarray(ptr, ptr + len));
}

function passString (arg) {
  const buf = stringToU8a(arg);
  const ptr = wasm.__wbindgen_malloc(buf.length);

  getUint8().subarray(ptr, ptr + buf.length).set(buf);

  return [ptr, buf.length];
}

function passU8a (arg) {
  const ptr = wasm.__wbindgen_malloc(arg.length * 1);

  getUint8().set(arg, ptr / 1);

  return [ptr, arg.length];
}

function getWasm () {
  return wasm;
}

module.exports = {
  getInt32,
  getString,
  getU8a,
  getWasm,
  initWasm,
  passString,
  passU8a
};
