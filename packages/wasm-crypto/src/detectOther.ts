// Copyright 2017-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { packageInfo as initInfo } from '@polkadot/wasm-crypto-init/packageInfo';
import { packageInfo as asmInfo } from '@polkadot/wasm-data-asmjs/packageInfo';
import { packageInfo as wasmInfo } from '@polkadot/wasm-data-wasm/packageInfo';

export default [initInfo, asmInfo, wasmInfo];
