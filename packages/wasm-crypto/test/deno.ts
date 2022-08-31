// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createRequire } from 'https://deno.land/std@0.107.0/node/module.ts';

import * as wasm from '../build-deno/mod.ts';

declare const globalThis: Record<string, unknown>;
declare const Deno: {
  test: (name: string, test: () => unknown) => unknown;
}

// ensure we set require on globalThis, it is used is all/*.js
const require = globalThis.require = createRequire(import.meta.url);
const { beforeAll, tests } = require('./all/index.js');

await beforeAll('wasm', wasm);

Object
  .entries<(wasm: unknown) => void>(tests)
  .forEach(([name, test]) => {
    Deno.test(name, () => test(wasm));
  });
