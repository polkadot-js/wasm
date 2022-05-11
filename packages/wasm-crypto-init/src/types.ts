// Copyright 2019-2022 @polkadot/wasm-crypto-init authors & contributors
// SPDX-License-Identifier: Apache-2.0

export declare interface InitResult {
  type: 'wasm' | 'asm';
  wasm: unknown;
}

export type InitFn = (wbg: WebAssembly.ModuleImports) => Promise<InitResult>;
