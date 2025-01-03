// Copyright 2017-2025 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Do not edit, auto-generated by @polkadot/dev
// (packageInfo imports will be kept as-is, user-editable)

import { detectPackage } from '@polkadot/util';
import { packageInfo as bridgeInfo } from '@polkadot/wasm-bridge/packageInfo';
import { packageInfo as asmInfo } from '@polkadot/wasm-crypto-asmjs/packageInfo';
import { packageInfo as initInfo } from '@polkadot/wasm-crypto-init/packageInfo';
import { packageInfo as wasmInfo } from '@polkadot/wasm-crypto-wasm/packageInfo';
import { packageInfo as utilInfo } from '@polkadot/wasm-util/packageInfo';

import { packageInfo } from './packageInfo.js';

detectPackage(packageInfo, null, [asmInfo, bridgeInfo, initInfo, utilInfo, wasmInfo]);
