// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  ...secp256k1,
  ...ed25519,
  ...sr25519,
  ...vrf,
  ...bip39,
  ...hashing
};

export async function beforeAll (name, wasm) {
  const result = await wasm.waitReady();

  console.log(`*** waitReady()=${result} for ${wasm.bridge.type}`);

  assert(name.toLowerCase() === wasm.bridge.type, `Incorrect environment launched, expected ${name.toLowerCase()}, found ${wasm.bridge.type}`);

  return result;
}

export function runAll (name, wasm) {
  const failed = [];
  let count = 0;

  Object
    .entries(tests)
    .forEach(([name, test]) => {
      const timerId = `\t${name}`;

      count++;

      try {
        console.time(timerId);
        console.log();
        console.log(timerId);

        test(wasm);

        console.timeEnd(timerId);
      } catch (error) {
        console.error();
        console.error(error);

        failed.push(name);
      }
    });

  if (failed.length) {
    throw new Error(`\n*** ${name}: FAILED: ${failed.length} of ${count}: ${failed.join(', ')}`);
  }
}

export function runUnassisted (name, wasm) {
  console.log(`\n*** ${name}: Running tests`);

  beforeAll(name, wasm)
    .then(() => runAll(name, wasm))
    .then(() => {
      console.log(`\n*** ${name}: All passed`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message, '\n');
      process.exit(-1);
    });
}
