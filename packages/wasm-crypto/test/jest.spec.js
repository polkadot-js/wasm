// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

const { beforeAll, tests } = require('./all.js');

describe('schnorrkel-js', () => {
  beforeEach(async () => {
    await beforeAll();
  });

  Object.keys(tests).forEach((name) => {
    const test = tests[name];

    it(name, () => {
      test();
    });
  });
});
