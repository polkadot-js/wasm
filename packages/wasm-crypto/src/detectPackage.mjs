// Copyright 2017-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { detectPackage } from '@polkadot/util';

import packageInfo from './package-info.json';

// eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
detectPackage(packageInfo, () => new Function('import()') && import.meta.url);

export { packageInfo };
