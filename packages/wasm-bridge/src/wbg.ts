// Copyright 2019-2022 @polkadot/wasm-bridge authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BridgeBase, WasmBaseInstance } from './types';

import { getRandomValues } from '@polkadot/x-randomvalues';

const DEFAULT_CRYPTO = { getRandomValues };
const DEFAULT_SELF = { crypto: DEFAULT_CRYPTO };

export class Wbg<C extends WasmBaseInstance> {
  #bridge: BridgeBase<C>;

  constructor (bridge: BridgeBase<C>) {
    this.#bridge = bridge;
  }

  abort = (): never => {
    throw new Error('abort');
  };

  __wbindgen_is_undefined = (idx: number): boolean => {
    return this.#bridge.getObject(idx) === undefined;
  };

  __wbindgen_throw = (ptr: number, len: number): boolean => {
    throw new Error(this.#bridge.getString(ptr, len));
  };

  __wbg_self_1b7a39e3a92c949c = (): number => {
    return this.#bridge.addObject(DEFAULT_SELF);
  };

  __wbg_require_604837428532a733 = (ptr: number, len: number): never => {
    throw new Error(`Unable to require ${this.#bridge.getString(ptr, len)}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_crypto_968f1772287e2df0 = (_idx: number): number => {
    return this.#bridge.addObject(DEFAULT_CRYPTO);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_getRandomValues_a3d34b4fee3c2869 = (_idx: number): number => {
    return this.#bridge.addObject(DEFAULT_CRYPTO.getRandomValues);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_getRandomValues_f5e14ab7ac8e995d = (_arg0: number, ptr: number, len: number): void => {
    DEFAULT_CRYPTO.getRandomValues(this.#bridge.getU8a(ptr, len));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_randomFillSync_d5bd2d655fdf256a = (_idx: number, _ptr: number, _len: number): never => {
    throw new Error('randomFillsync is not available');

    // getObject(idx).randomFillSync(getU8a(ptr, len));
  };

  __wbindgen_object_drop_ref = (idx: number): void => {
    this.#bridge.takeObject(idx);
  };
}

export function initWbg <C extends WasmBaseInstance> (bridge: BridgeBase<C>): Wbg<C> {
  return new Wbg(bridge);
}
