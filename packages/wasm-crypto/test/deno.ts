// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This is a Deno file, so we can allow .ts imports
/* eslint-disable import/extensions */

// NOTE We don't use ts-expect-error here since the build folder may or may
// not exist (so the error may or may not be there)
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This should only run against the compiled ouput, where this should exist
import * as wasm from '../build-deno/mod.ts';
import { initRun, tests } from './all/index.js';

interface Tests {
  [key: string]: (wasm: unknown) => void;
}

declare const globalThis: {
  it: (name: string, fn: () => void) => unknown;
};
declare const Deno: {
  test: (name: string, test: () => unknown) => unknown;
};

await initRun('wasm', wasm);

// We use it to denote the tests
globalThis.it = (name: string, fn: () => void) => Deno.test(name, () => fn());

Object
  .entries<Tests>(tests)
  .forEach(([describeName, tests]) => {
    console.log('***', describeName);

    Object
      .values(tests)
      .forEach((test) => test(wasm));
  });
