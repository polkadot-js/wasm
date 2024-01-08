// Copyright 2017-2024 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Do not edit, auto-generated by @polkadot/dev
// (packageInfo imports will be kept as-is, user-editable)

import { detectPackage } from '@polkadot/util';
import { packageInfo as bridgeInfo } from '@polkadot/wasm-bridge/packageInfo';
import { packageInfo as asmInfo } from '@polkadot/wasm-crypto-asmjs/packageInfo';
import { packageInfo as wasmInfo } from '@polkadot/wasm-crypto-wasm/packageInfo';

import { packageInfo } from './packageInfo.js';

detectPackage(packageInfo, null, [asmInfo, bridgeInfo, wasmInfo]);
