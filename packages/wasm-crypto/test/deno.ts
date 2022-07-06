// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createRequire } from 'https://deno.land/std@0.107.0/node/module.ts';

import * as wasm from '../build-deno/mod.ts';

declare const globalThis: Record<string, unknown>;
declare const require: (name: string) => any;

globalThis.require = createRequire(import.meta.url);

const exp = require('./all/index.js');

await exp.beforeAll('wasm', wasm);

Object.keys(exp.tests).forEach((name) => {
  Deno.test(name, () => exp.tests[name](wasm));
});
