// Copyright 2017-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { detectPackage } from '@polkadot/util';

import packageInfo from './package-info.json';

function getPath () {
  return import.meta.url;
}

detectPackage(packageInfo, getPath);

export { packageInfo };
