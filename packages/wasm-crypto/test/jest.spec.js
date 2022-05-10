// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

import { beforeAll as beforeAllFn, tests, wasm } from './all/index.cjs';

describe('wasm-crypto', () => {
  beforeAll(async () => {
    await beforeAllFn();
  });

  Object.keys(tests).forEach((name) => {
    it(name, () => tests[name](wasm));
  });
});
