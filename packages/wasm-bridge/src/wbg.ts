// Copyright 2019-2023 @polkadot/wasm-bridge authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BridgeBase, WasmBaseInstance } from './types';

import { getRandomValues } from '@polkadot/x-randomvalues';

const DEFAULT_CRYPTO = { getRandomValues };
const DEFAULT_SELF = { crypto: DEFAULT_CRYPTO };

/**
 * @name Wbg
 * @description
 * This defines the internal interfaces that wasm-bindgen used to communicate
 * with the host layer. None of these functions are available to the user, rather
 * they are called internally from the WASM code itself.
 *
 * The interfaces here are exposed in the imports on the created WASM interfaces.
 *
 * Internally the implementation does a thin layer into the supplied bridge.
 */
export class Wbg<C extends WasmBaseInstance> {
  #bridge: BridgeBase<C>;

  constructor (bridge: BridgeBase<C>) {
    this.#bridge = bridge;
  }

  /** @internal */
  abort = (): never => {
    throw new Error('abort');
  };

  /** @internal */
  __wbindgen_is_undefined = (idx: number): boolean => {
    return this.#bridge.getObject(idx) === undefined;
  };

  /** @internal */
  __wbindgen_throw = (ptr: number, len: number): boolean => {
    throw new Error(this.#bridge.getString(ptr, len));
  };

  /** @internal */
  __wbg_self_1b7a39e3a92c949c = (): number => {
    return this.#bridge.addObject(DEFAULT_SELF);
  };

  /** @internal */
  __wbg_require_604837428532a733 = (ptr: number, len: number): never => {
    throw new Error(`Unable to require ${this.#bridge.getString(ptr, len)}`);
  };

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_crypto_968f1772287e2df0 = (_idx: number): number => {
    return this.#bridge.addObject(DEFAULT_CRYPTO);
  };

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_getRandomValues_a3d34b4fee3c2869 = (_idx: number): number => {
    return this.#bridge.addObject(DEFAULT_CRYPTO.getRandomValues);
  };

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_getRandomValues_f5e14ab7ac8e995d = (_arg0: number, ptr: number, len: number): void => {
    DEFAULT_CRYPTO.getRandomValues(this.#bridge.getU8a(ptr, len));
  };

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __wbg_randomFillSync_d5bd2d655fdf256a = (_idx: number, _ptr: number, _len: number): never => {
    throw new Error('randomFillsync is not available');

    // getObject(idx).randomFillSync(getU8a(ptr, len));
  };

  /** @internal */
  __wbindgen_object_drop_ref = (idx: number): void => {
    this.#bridge.takeObject(idx);
  };
}
