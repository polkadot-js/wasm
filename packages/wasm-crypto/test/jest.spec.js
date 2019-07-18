/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

// @ts-ignore
require('../build/crypto-polyfill');

// @ts-ignore
const wasm = require('../build/index');
const { beforeAll, tests } = require('./all')(wasm);

describe('schnorrkel-js', () => {
  beforeEach(beforeAll);

  Object.keys(tests).forEach((name) => {
    it(name, tests[name]);
  });
});
