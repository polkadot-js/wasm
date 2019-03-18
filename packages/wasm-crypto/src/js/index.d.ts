// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function blake2bHash (data: Uint8Array, key: Uint8Array, byteSize: number): Uint8Array;
export function pbkdf2Hash (data: Uint8Array, salt: Uint8Array, rounds: number): Uint8Array;
export function sha512Hash (data: Uint8Array): Uint8Array;
export function twoxHash (data: Uint8Array, rounds: number): Uint8Array;

export function isReady (): boolean;
export function waitReady (): Promise<boolean>;
