// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as wasm from '../build-deno/mod.ts';
import { initRun, tests } from './all/index.js';

declare const globalThis;
declare const Deno: {
  test: (name: string, test: () => unknown) => unknown;
}

await initRun('wasm', wasm);

// We use it to denote the tests
globalThis.it = (name: string, fn: () => void) => Deno.test(name, () => fn());

Object
  .entries<{ [key: string]: (wasm: unknown) => void }>(tests)
  .forEach(([describeName, tests]) => {
    console.log('***', describeName);

    Object
      .values(tests)
      .forEach((test) => test(wasm));
  });
