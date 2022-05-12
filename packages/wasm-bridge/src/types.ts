// Copyright 2019-2022 @polkadot/wasm-bridge authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

export type CreatePromise <C extends WasmBaseInstance> = Promise<{ type: 'asm' | 'wasm'; wasm: C | null }>;

export type CreatePromiseFn <C extends WasmBaseInstance> = (wgb: WebAssembly.ModuleImports) => CreatePromise<C>;

export declare interface InitResult<C extends WasmBaseInstance> {
  type: 'wasm' | 'asm';
  wasm: C | null;
}

export type InitFn <C extends WasmBaseInstance> = (wbg: WebAssembly.ModuleImports) => Promise<InitResult<C>>;

export interface BridgeBase<C extends WasmBaseInstance> {
  type: 'asm' | 'wasm';
  wbg: WebAssembly.ModuleImports;
  wasm: C | null;

  init (initOverride?: CreatePromiseFn<C>): Promise<C | null>;
  getObject (idx: number): unknown;
  dropObject (idx: number): void;
  takeObject (idx: number): unknown;
  addObject (obj: unknown): number;
  getInt32 (): Int32Array;
  getUint8 (): Uint8Array;
  getU8a (ptr: number, len: number): Uint8Array;
  getString (ptr: number, len: number): string;
  allocU8a (arg: Uint8Array): [number, number];
  allocString (arg: string): [number, number];
  resultU8a (): Uint8Array;
  resultString (): string;
}

export interface WasmBaseInstance {
  memory: WebAssembly.Memory;

  // wbindgen functions (required and used internally)

  __wbindgen_exn_store (a: number): void;
  __wbindgen_free (a: number, b: number): void;
  __wbindgen_malloc (a: number): number;
  __wbindgen_realloc (a: number, b: number, c: number): number;
}
