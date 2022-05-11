// Copyright 2019-2022 @polkadot/wasm-bridge authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { BridgeBase, CreatePromise, WasmBaseInstance } from './types';

import { stringToU8a, u8aToString } from '@polkadot/util';

export class Bridge<C extends WasmBaseInstance> implements BridgeBase<C> {
  #cachegetInt32: Int32Array | null;
  #cachegetUint8: Uint8Array | null;
  #defaultInit: (wbg: WebAssembly.ModuleImports) => CreatePromise<C>;
  #heap: unknown[];
  #heapNext: number;
  #wasm: C | null;
  #wasmPromise: CreatePromise<C> | null;
  #wbg: WebAssembly.ModuleImports;
  #type: 'asm' | 'wasm';

  constructor (createWbg: (bridge: Bridge<C>) => WebAssembly.ModuleImports, createWasm: (wbg: WebAssembly.ModuleImports) => CreatePromise<C>) {
    this.#defaultInit = createWasm;
    this.#cachegetInt32 = null;
    this.#cachegetUint8 = null;
    this.#heap = new Array(32)
      .fill(undefined)
      .concat(undefined, null, true, false);
    this.#heapNext = this.#heap.length;
    this.#type = 'wasm';
    this.#wasm = null;
    this.#wasmPromise = null;
    this.#wbg = createWbg(this);
  }

  get type (): 'asm' | 'wasm' {
    return this.#type;
  }

  get wbg (): WebAssembly.ModuleImports {
    return this.#wbg;
  }

  get wasm (): C | null {
    return this.#wasm;
  }

  async initWasm (initOverride?: (wbg: WebAssembly.ModuleImports) => CreatePromise<C>): Promise<C> {
    if (!this.#wasmPromise || initOverride) {
      this.#wasmPromise = (initOverride || this.#defaultInit)(this.#wbg);
    }

    const { type, wasm } = await this.#wasmPromise;

    this.#type = type;
    this.#wasm = wasm as C;

    return this.#wasm;
  }

  getObject (idx: number): unknown {
    return this.#heap[idx];
  }

  dropObject (idx: number) {
    if (idx < 36) {
      return;
    }

    this.#heap[idx] = this.#heapNext;
    this.#heapNext = idx;
  }

  takeObject (idx: number): unknown {
    const ret = this.getObject(idx);

    this.dropObject(idx);

    return ret;
  }

  addObject (obj: unknown): number {
    if (this.#heapNext === this.#heap.length) {
      this.#heap.push(this.#heap.length + 1);
    }

    const idx = this.#heapNext;

    this.#heapNext = this.#heap[idx] as number;
    this.#heap[idx] = obj;

    return idx;
  }

  getInt32 (): Int32Array {
    if (this.#cachegetInt32 === null || this.#cachegetInt32.buffer !== this.#wasm!.memory.buffer) {
      this.#cachegetInt32 = new Int32Array(this.#wasm!.memory.buffer);
    }

    return this.#cachegetInt32;
  }

  getUint8 (): Uint8Array {
    if (this.#cachegetUint8 === null || this.#cachegetUint8.buffer !== this.#wasm!.memory.buffer) {
      this.#cachegetUint8 = new Uint8Array(this.#wasm!.memory.buffer);
    }

    return this.#cachegetUint8;
  }

  getU8a (ptr: number, len: number): Uint8Array {
    return this.getUint8().subarray(ptr / 1, ptr / 1 + len);
  }

  getString (ptr: number, len: number): string {
    return u8aToString(this.getU8a(ptr, len));
  }

  allocU8a (arg: Uint8Array): [number, number] {
    const ptr = this.#wasm!.__wbindgen_malloc(arg.length * 1);

    this.getUint8().set(arg, ptr / 1);

    return [ptr, arg.length];
  }

  allocString (arg: string): [number, number] {
    return this.allocU8a(stringToU8a(arg));
  }

  resultU8a (): Uint8Array {
    const r0 = this.getInt32()[8 / 4 + 0];
    const r1 = this.getInt32()[8 / 4 + 1];
    const ret = this.getU8a(r0, r1).slice();

    this.#wasm!.__wbindgen_free(r0, r1 * 1);

    return ret;
  }

  resultString (): string {
    return u8aToString(this.resultU8a());
  }
}
