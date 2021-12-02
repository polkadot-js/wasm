// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { assert, hexToU8a, u8aToHex } = require('@polkadot/util');

function secp256k1Compress (wasm) {
  const pubkey = '0x04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af';
  const result = u8aToHex(wasm.secp256k1Compress(hexToU8a(pubkey)));

  console.log('\tRES', result);

  assert(result === '0x03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077', 'ERROR: secp256k1Compress does not match');
}

function secp256k1Expand (wasm) {
  const pubkey = '0x03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077';
  const result = u8aToHex(wasm.secp256k1Expand(hexToU8a(pubkey)));

  console.log('\tRES', result);

  assert(result === '0x04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af', 'ERROR: secp256k1Expand does not match');
}

function secp256k1Recover (wasm) {
  const sig = '0x7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff';
  const msg = '0xa30b64ce1eedf409c8afb801d72c05234e64849ea538c15dd3c8cf4ffcf166c9';
  const result = u8aToHex(wasm.secp256k1Recover(hexToU8a(msg), hexToU8a(sig), 0));

  console.log('\tRES', result);

  assert(result === '0x028d13da15a02f3a70677339d51b14177ee9b49657662b35e56a9d9dee17db1d30', 'ERROR: secp256k1Recover does not match');
}

module.exports = {
  secp256k1Compress,
  secp256k1Expand,
  secp256k1Recover
};
