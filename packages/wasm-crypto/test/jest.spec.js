// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

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
