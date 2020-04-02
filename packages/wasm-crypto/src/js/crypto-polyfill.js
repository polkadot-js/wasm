// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const crypto = require('crypto');

if (!global.crypto) {
  global.crypto = {};
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = function (arr) {
    const buffer = crypto.randomBytes(arr.length);

    return buffer.reduce((arr, value, index) => {
      arr[index] = value;

      return arr;
    }, arr);
  };
}
