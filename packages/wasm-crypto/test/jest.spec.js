// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

require('../build/crypto-polyfill');

const { beforeAll, tests } = require('./all');

describe('schnorrkel-js', () => {
  beforeEach(beforeAll);

  Object.keys(tests).forEach((name) => {
    it(name, tests[name]);
  });
});
