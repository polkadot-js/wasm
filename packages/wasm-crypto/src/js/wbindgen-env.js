// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const crypto = require('crypto');

const { getArrayU8FromWasm0, getStringFromWasm0, getWasm } = require('./wbindgen-util');

const requires = { crypto };
const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject (idx) {
  return heap[idx];
}

let heapNext = heap.length;

function dropObject (idx) {
  if (idx < 36) {
    return;
  }

  heap[idx] = heapNext;
  heapNext = idx;
}

function takeObject (idx) {
  const ret = getObject(idx);

  dropObject(idx);

  return ret;
}

function addObject (obj) {
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
      getWasm().__wbindgen_exn_store(addObject(e));
    }
  };
}

module.exports.__wbindgen_is_undefined = function (arg0) {
  return getObject(arg0) === undefined;
};

module.exports.__wbg_self_1b7a39e3a92c949c = handleError(function () {
  return addObject(self.self);
});

module.exports.__wbg_require_604837428532a733 = function (arg0, arg1) {
  return addObject(requires[getStringFromWasm0(arg0, arg1)]);
};

module.exports.__wbg_crypto_968f1772287e2df0 = function (arg0) {
  return addObject(getObject(arg0).crypto);
};

module.exports.__wbg_getRandomValues_a3d34b4fee3c2869 = function (arg0) {
  return addObject(getObject(arg0).getRandomValues);
};

module.exports.__wbg_getRandomValues_f5e14ab7ac8e995d = function (arg0, arg1, arg2) {
  getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
};

module.exports.__wbg_randomFillSync_d5bd2d655fdf256a = function (arg0, arg1, arg2) {
  getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

module.exports.__wbindgen_object_drop_ref = function (arg0) {
  takeObject(arg0);
};

module.exports.abort = function () {
  throw new Error('abort');
};
