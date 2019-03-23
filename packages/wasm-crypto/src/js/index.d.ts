// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function bip39Generate (words: 12 | 15 | 18 | 21 | 24): string;
export function bip39ToEntropy (phrase: string): Uint8Array;
export function bip39ToMiniSecret (phrase: string, password: string): Uint8Array;
export function bip39ToSeed (phrase: string): Uint8Array;
export function bip39Validate (phrase: string): boolean;
export function blake2b (data: Uint8Array, key: Uint8Array, byteSize: number): Uint8Array;
export function keccak256 (data: Uint8Array): Uint8Array;
export function pbkdf2 (data: Uint8Array, salt: Uint8Array, rounds: number): Uint8Array;
// export function secp256k1IsRecoverable (message: Uint8Array, signature: Uint8Array): number;
// export function secp256k1Recover (message: Uint8Array, signature: Uint8Array): Uint8Array;
export function sha512 (data: Uint8Array): Uint8Array;
export function twox (data: Uint8Array, rounds: number): Uint8Array;

export function isReady (): boolean;
export function waitReady (): Promise<boolean>;
