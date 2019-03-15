// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function isReady (): boolean;
export function keypairFromSeed (seed: Uint8Array): Uint8Array;
export function secretFromSeed (seed: Uint8Array): Uint8Array;
export function sign (publicKey: Uint8Array, secretKey: Uint8Array, message: Uint8Array): Uint8Array;
export function softDeriveKeypair (pair: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function softDerivePublic (publicKey: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function softDeriveSecret (secretKey: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function verify (signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean;
export function waitReady (): Promise<boolean>;
