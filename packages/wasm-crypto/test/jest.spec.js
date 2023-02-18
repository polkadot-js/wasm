// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as wasm from '../build';
import { beforeAll as beforeAllFn, tests } from './all/index.js';

describe('wasm-crypto', () => {
  beforeAll(async () => {
    await beforeAllFn('wasm', wasm);
  });

  it.each(Object.keys(tests))('%s', (name) =>
    tests[name](wasm)
  );
});
