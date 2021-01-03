// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

// override-require in jest.config.js

const { beforeAll, tests, wasm } = require('./all');

describe('wasm-crypto', () => {
  beforeEach(async () => {
    await beforeAll();
  });

  Object.keys(tests).forEach((name) => {
    it(name, () => tests[name](wasm));
  });
});
