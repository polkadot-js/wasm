// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { beforeAll, tests, wasm } = require('./all');

describe('schnorrkel-js', () => {
  beforeEach(async () => {
    await beforeAll();
  });

  Object.keys(tests).forEach((name) => {
    it(name, () => tests[name](wasm));
  });
});
