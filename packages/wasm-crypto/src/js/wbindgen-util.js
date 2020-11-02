// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { u8aToString } = require('@polkadot/util');

let wasm;
let cachegetInt32Memory0 = null;
let cachegetNodeBufferMemory0 = null;
let cachegetUint8Memory0 = null;

function getInt32Memory0 () {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }

  return cachegetInt32Memory0;
}

function getUint8Memory0 () {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }

  return cachegetUint8Memory0;
}

function getStringFromWasm0 (ptr, len) {
  return u8aToString(getUint8Memory0().subarray(ptr, ptr + len));
}

function getNodeBufferMemory0 () {
  if (cachegetNodeBufferMemory0 === null || cachegetNodeBufferMemory0.buffer !== wasm.memory.buffer) {
    cachegetNodeBufferMemory0 = Buffer.from(wasm.memory.buffer);
  }

  return cachegetNodeBufferMemory0;
}

function passStringToWasm0 (arg) {
  const len = Buffer.byteLength(arg);
  const ptr = wasm.__wbindgen_malloc(len);

  getNodeBufferMemory0().write(arg, ptr, len);

  return [ptr, len];
}

function getArrayU8FromWasm0 (ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0 (arg) {
  const ptr = wasm.__wbindgen_malloc(arg.length * 1);

  getUint8Memory0().set(arg, ptr / 1);

  return [ptr, arg.length];
}

function getWasm () {
  return wasm;
}

function setWasm (_wasm) {
  wasm = _wasm;
}

module.exports = {
  getArrayU8FromWasm0,
  getInt32Memory0,
  getStringFromWasm0,
  getWasm,
  passArray8ToWasm0,
  passStringToWasm0,
  setWasm
};
