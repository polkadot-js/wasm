/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const bip39 = require('./bip39');
const ed25519 = require('./ed25519');
const hashing = require('./hashing');
const sr25519 = require('./sr25519');

module.exports = function (wasm) {
  const tests = {
    ...bip39(wasm),
    ...ed25519(wasm),
    ...hashing(wasm),
    ...sr25519(wasm)
  };

  return {
    beforeAll: async function beforeAll () {
      return wasm.waitReady();
    },
    runAll: function runAll () {
      const failed = [];
      let count = 0;

      Object.keys(tests).forEach((name) => {
        count++;

        try {
          console.time(name);
          console.log();
          console.log(name);

          tests[name]();

          console.timeEnd(name);
        } catch (error) {
          console.error(error);
          failed.push(name);
        }
      });

      if (failed.length) {
        throw new Error(`Failed: ${failed.length} of ${count}: ${failed.concat(', ')}`);
      }
    },
    tests
  };
};
