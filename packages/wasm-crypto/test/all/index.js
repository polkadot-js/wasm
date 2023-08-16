// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global describe */

import { assert } from '@polkadot/util';

import * as bip39 from './bip39.js';
import * as ed25519 from './ed25519.js';
import * as hashing from './hashing.js';
import * as secp256k1 from './secp256k1.js';
import * as sr25519 from './sr25519.js';
import * as vrf from './vrf.js';

export const tests = {
  // We place secp256k1 first, this allows the interaction with it in the
  // hashing (specifically scrypt) test not be an issue (ASM.js only)
  // https://github.com/polkadot-js/wasm/issues/307
  secp256k1,
  // eslint-disable-next-line sort-keys
  bip39,
  ed25519,
  hashing,
  sr25519,
  vrf
};

/**
 * @param {string} name
 * @param {*} wasm
 */
export async function initRun (name, wasm) {
  const result = await wasm.waitReady();

  console.log(`*** waitReady()=${result} for ${wasm.bridge.type}`);

  assert(name.toLowerCase() === wasm.bridge.type, `Incorrect environment launched, expected ${name.toLowerCase()}, found ${wasm.bridge.type}`);

  return result;
}

/**
 * @param {string} name
 * @param {*} wasm
 */
export function runAll (name, wasm) {
  /** @type {string[]} */
  const failed = [];
  let count = 0;

  Object
    .entries(tests)
    .forEach(([describeName, tests]) => {
      describe(describeName, () => {
        Object
          .entries(tests)
          .forEach(([name, test]) => {
            const timerId = `\t${name}`;

            count++;

            try {
              console.time(timerId);
              console.log();

              test(wasm);

              console.timeEnd(timerId);
            } catch (error) {
              console.error();
              console.error(error);

              failed.push(name);
            }
          });
      });
    });

  if (failed.length) {
    throw new Error(`\n*** ${name}: FAILED: ${failed.length} of ${count}: ${failed.join(', ')}`);
  }
}

/**
 * @param {string} type
 * @param {*} wasm
 */
export function runUnassisted (type, wasm) {
  console.log(`\n*** ${type}: Running tests`);

  // For these we are pass-through describe and it handlers
  // @ts-expect-error We are hacking this, so expect TS to be unhappy...
  globalThis.describe = (name, fn) => {
    console.log('\n', name);

    // We expect this to be handled top-level, in the test itself
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fn();
  };

  // @ts-expect-error We are hacking this, so expect TS to be unhappy...
  globalThis.it = (name, fn) => {
    console.log(`\t${name}`);

    // We expect this to be handled top-level, in the test itself
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fn();
  };

  console.time(type);

  initRun(type, wasm)
    .then(() => {
      runAll(type, wasm);
      console.log(`\n*** ${type}: All passed`);
      console.timeEnd(type);
      console.log();
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n*** ${type}: FAILED:`, error.message, '\n');
      console.timeEnd(type);
      console.log();
      process.exit(-1);
    });
}
