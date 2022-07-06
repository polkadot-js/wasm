// Copyright 2019-2022 @polkadot/wasm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, stringToU8a, u8aToHex } from 'https://deno.land/x/polkadot/util/mod.ts';
import { bip39Generate, bip39Validate, sr25519KeypairFromSeed, waitReady } from 'https://deno.land/x/polkadot/wasm-crypto/mod.ts';

await waitReady();

Deno.test('bip39Validate', () => {
  const m = bip39Generate(12);
  const v = bip39Validate(m);

  assert(m.split(' ').length === 12, 'Invalid created mnemonic');
  assert(v, 'Unable to validate created mnemonic');
});

Deno.test('sr25519KeypairFromSeed', () => {
  const p = sr25519KeypairFromSeed(stringToU8a('12345678901234567890123456789012'));

  assert(u8aToHex(p) === '0xf0106660c3dda23f16daa9ac5b811b963077f5bc0af89f85804f0de8e424f050f98d66f39442506ff947fd911f18c7a7a5da639a63e8d3b4e233f74143d951c1741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63', 'ERROR: pairFromSeed() does not match');
});
