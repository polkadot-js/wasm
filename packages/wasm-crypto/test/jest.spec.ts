// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import * as wasm from '../build/index.js';
import { initRun, tests } from './all/index.js';

describe('wasm-crypto', (): void => {
  beforeAll(() => initRun('wasm', wasm));

  for (const name of Object.keys(tests)) {
    describe(name, (): void => {
      Object
        .values<(wasm: unknown) => void>(tests[name])
        .forEach((fn) => fn(wasm));
    });
  }
});
