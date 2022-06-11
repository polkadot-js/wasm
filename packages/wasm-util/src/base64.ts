// Copyright 2019-2022 @polkadot/wasm-util authors & contributors
// SPDX-License-Identifier: Apache-2.0

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * @name base64Decode
 * @description
 * A fail-safe base64Decoding function that operates in all environments. Unlike
 * decoding from Buffer (Node.js only) or atob (browser-only) this implementation
 * is slightly slower, but it is platform independent.
 */
export function base64Decode (data: string): Uint8Array {
  // TODO: For Node.js speedups, we could add an explicit base64Node.ts implementation
  // that would be (via export maps) be available in that environment only
  const bytes = [];
  let byte = 0;
  let bits = 0;

  for (let i = 0; i < data.length && data[i] !== '='; i++) {
    // each character represents 6 bits
    byte = (byte << 6) | chars.indexOf(data[i]);

    // each byte needs to contain 8 bits
    if ((bits += 6) >= 8) {
      bytes.push((byte >>> (bits -= 8)) & 0xff);
    }
  }

  return Uint8Array.from(bytes);
}
