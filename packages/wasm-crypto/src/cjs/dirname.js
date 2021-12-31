// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

module.exports = typeof __dirname === 'string'
  ? __dirname.replace('/cjs', '')
  : undefined;
