// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as wasm from '../build/index.js';
import { initRun, tests } from './all/index.js';

describe('wasm-crypto', (): void => {
  beforeAll(() => initRun('wasm', wasm));

  describe.each(Object.keys(tests))('%s', (name): void => {
    Object
      .values(tests[name])
      .forEach((fn) => (fn as (wasm: unknown) => void)(wasm));
  });
});
