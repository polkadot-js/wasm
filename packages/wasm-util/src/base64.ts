// Copyright 2019-2022 @polkadot/wasm-util authors & contributors
// SPDX-License-Identifier: Apache-2.0

const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const map: Record<string, number> = {};

for (let i = 0; i < chr.length; i++) {
  map[chr[i]] = i;
}

/**
 * @name base64Decode
 * @description
 * A base64Decoding function that operates in all environments. Unlike decoding
 * from Buffer (Node.js only) or atob (browser-only) this implementation is
 * slightly slower, but it is platform independent.
 *
 * For our usage, since we have access to the static final size (where used), we
 * decode to a specified output buffer.
 */
export function base64Decode (data: string, out: Uint8Array): Uint8Array {
  let byte = 0;
  let bits = 0;
  let pos = -1;

  for (let i = 0; i < data.length && data[i] !== '='; i++) {
    // each character represents 6 bits
    byte = (byte << 6) | map[data[i]];

    // each byte needs to contain 8 bits
    if ((bits += 6) >= 8) {
      out[++pos] = (byte >>> (bits -= 8)) & 0xff;
    }
  }

  return out;
}
