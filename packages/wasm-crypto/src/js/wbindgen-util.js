// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const crypto = require('crypto');
const { u8aToString } = require('@polkadot/util');

const REQUIRES = { crypto };
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject (idx) {
  return heap[idx];
}

let heapNext = heap.length;

function dropObject (idx) {
  if (idx < 36) return;

  heap[idx] = heapNext;
  heapNext = idx;
}

function takeObject (idx) {
  const ret = getObject(idx);

  dropObject(idx);

  return ret;
}

function addHeapObject (obj) {
  if (heapNext === heap.length) {
    heap.push(heap.length + 1);
  }

  const idx = heapNext;

  heapNext = heap[idx];
  heap[idx] = obj;

  return idx;
}

function handleError (f) {
  return function () {
    try {
      return f.apply(this, arguments);
    } catch (e) {
      wasm.__wbindgen_exn_store(addHeapObject(e));
    }
  };
}

let cachegetInt32Memory0 = null;

function getInt32Memory0 () {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }

  return cachegetInt32Memory0;
}

let cachegetUint8Memory0 = null;

function getUint8Memory0 () {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }

  return cachegetUint8Memory0;
}

function getStringFromWasm0 (ptr, len) {
  return u8aToString(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetNodeBufferMemory0 = null;

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

function requires (key) {
  return REQUIRES[key];
}

function getWasm () {
  return wasm;
}

function setWasm (_wasm) {
  wasm = _wasm;
}

module.exports = {
  addHeapObject,
  getArrayU8FromWasm0,
  getInt32Memory0,
  getObject,
  getStringFromWasm0,
  getWasm,
  handleError,
  passArray8ToWasm0,
  passStringToWasm0,
  requires,
  setWasm,
  takeObject
};
