// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as wasm from '../build-deno/mod.ts';
import { beforeAll, tests } from './all/index.js';

declare const Deno: {
  test: (name: string, test: () => unknown) => unknown;
}

await beforeAll('wasm', wasm);

Object
  .entries<(wasm: unknown) => void>(tests)
  .forEach(([name, test]) => {
    Deno.test(name, () => test(wasm));
  });
