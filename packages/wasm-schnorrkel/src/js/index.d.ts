// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function deriveKeypairHard (pair: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function deriveKeypairSoft (pair: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function derivePublicSoft (publicKey: Uint8Array, chainCode: Uint8Array): Uint8Array;
export function keypairFromSeed (seed: Uint8Array): Uint8Array;
export function sign (publicKey: Uint8Array, secretKey: Uint8Array, message: Uint8Array): Uint8Array;
export function verify (signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean;

export function isReady (): boolean;
export function waitReady (): Promise<boolean>;
