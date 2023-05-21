// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

// NOTE We don't use ts-expect-error here since the build folder may or may
// not exist (so the error may or may not be there)
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This should only run against the compiled ouput, where this should exist
import * as wasm from '../build/index.js';
import { initRun, tests } from './all/index.js';

describe('wasm-crypto', (): void => {
  beforeAll(() => initRun('wasm', wasm));

  for (const name of Object.keys(tests)) {
    describe(`${name}`, (): void => {
      Object
        .values<(wasm: unknown) => void>(tests[name as keyof typeof tests])
        .forEach((fn) => fn(wasm));
    });
  }
});
