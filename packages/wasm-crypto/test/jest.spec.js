/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

// @ts-ignore
require('../build/crypto-polyfill');

// @ts-ignore
const { beforeAll, tests, wasm } = require('./all');

describe('schnorrkel-js', () => {
  beforeEach(async () => beforeAll());

  Object.keys(tests).forEach((name) => {
    it(name, () => tests[name](wasm));
  });
});
