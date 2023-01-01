// Copyright 2019-2023 @polkadot/wasm-bridge authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Use non-strong types instead of WasmImports which may not
// be available as part of the TS environment types (it needs dom)
export type WasmImports = Record<string, (...args: never[]) => unknown>;

// Use non-strong types instead of WebAssembly.Memory which may not
// be available as part of the TS environment types (it needs dom)
export type WasmMemory = { buffer: ArrayBuffer };

export declare interface InitResult<C extends WasmBaseInstance> {
  error: string | null;
  type: 'asm' | 'wasm' | 'none';
  wasm: C | null;
}

export type InitPromise <C extends WasmBaseInstance> = Promise<InitResult<C>>;

export type InitFn <C extends WasmBaseInstance> = (wbg: WasmImports) => InitPromise<C>;

export interface BridgeBase<C extends WasmBaseInstance> extends InitResult<C> {
  init (createWasm?: InitFn<C>): Promise<C | null>;
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
  memory: WasmMemory;

  // wbindgen functions (required and used internally)

  __wbindgen_exn_store (a: number): void;
  __wbindgen_free (a: number, b: number): void;
  __wbindgen_malloc (a: number): number;
  __wbindgen_realloc (a: number, b: number, c: number): number;
}
