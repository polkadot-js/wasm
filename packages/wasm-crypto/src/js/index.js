// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { assert } = require('@polkadot/util');

const { getInt32, getString, getU8a, getWasm, initWasm, passString, passU8a } = require('./bridge');
const imports = require('./imports');
const asmFallback = require('./wasm_asm_stub');
const wasmBytes = require('./wasm_wasm');

const wasmPromise = initWasm(wasmBytes, asmFallback, imports).catch(() => null);

function wrapReady (fn) {
  return (...params) => {
    const wasm = getWasm();

    assert(wasm, 'The WASM interface has not been initialized. Ensure that you wait for the initialization Promise with waitReady() from @polkadot/wasm-crypto (or cryptoWaitReady() from @polkadot/util-crypto) before attempting to use WASM-only interfaces.');

    return fn(wasm, ...params);
  };
}

module.exports.bip39Generate = wrapReady(function (wasm, words) {
  wasm.ext_bip39_generate(8, words);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getString(r0, r1);

  wasm.__wbindgen_free(r0, r1);

  return ret;
});

module.exports.bip39ToEntropy = wrapReady(function (wasm, phrase) {
  const [ptr0, len0] = passString(phrase);

  wasm.ext_bip39_to_entropy(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.bip39ToMiniSecret = wrapReady(function (wasm, phrase, password) {
  const [ptr0, len0] = passString(phrase);
  const [ptr1, len1] = passString(password);

  wasm.ext_bip39_to_mini_secret(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.bip39ToSeed = wrapReady(function (wasm, phrase, password) {
  const [ptr0, len0] = passString(phrase);
  const [ptr1, len1] = passString(password);

  wasm.ext_bip39_to_seed(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.bip39Validate = wrapReady(function (wasm, phrase) {
  const [ptr0, len0] = passString(phrase);
  const ret = wasm.ext_bip39_validate(ptr0, len0);

  return ret !== 0;
});

module.exports.ed25519KeypairFromSeed = wrapReady(function (wasm, seed) {
  const [ptr0, len0] = passU8a(seed);

  wasm.ext_ed_from_seed(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.ed25519Sign = wrapReady(function (wasm, pubkey, seckey, message) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(seckey);
  const [ptr2, len2] = passU8a(message);

  wasm.ext_ed_sign(8, ptr0, len0, ptr1, len1, ptr2, len2);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.ed25519Verify = wrapReady(function (wasm, signature, message, pubkey) {
  const [ptr0, len0] = passU8a(signature);
  const [ptr1, len1] = passU8a(message);
  const [ptr2, len2] = passU8a(pubkey);
  const ret = wasm.ext_ed_verify(ptr0, len0, ptr1, len1, ptr2, len2);

  return ret !== 0;
});

module.exports.blake2b = wrapReady(function (wasm, data, key, size) {
  const [ptr0, len0] = passU8a(data);
  const [ptr1, len1] = passU8a(key);

  wasm.ext_blake2b(8, ptr0, len0, ptr1, len1, size);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.keccak256 = wrapReady(function (wasm, data) {
  const [ptr0, len0] = passU8a(data);

  wasm.ext_keccak256(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.pbkdf2 = wrapReady(function (wasm, data, salt, rounds) {
  const [ptr0, len0] = passU8a(data);
  const [ptr1, len1] = passU8a(salt);

  wasm.ext_pbkdf2(8, ptr0, len0, ptr1, len1, rounds);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.scrypt = wrapReady(function (wasm, password, salt, log2n, r, p) {
  const [ptr0, len0] = passU8a(password);
  const [ptr1, len1] = passU8a(salt);

  wasm.ext_scrypt(8, ptr0, len0, ptr1, len1, log2n, r, p);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sha512 = wrapReady(function (wasm, data) {
  const [ptr0, len0] = passU8a(data);

  wasm.ext_sha512(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.twox = wrapReady(function (wasm, data, rounds) {
  const [ptr0, len0] = passU8a(data);

  wasm.ext_twox(8, ptr0, len0, rounds);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519DeriveKeypairHard = wrapReady(function (wasm, pair, cc) {
  const [ptr0, len0] = passU8a(pair);
  const [ptr1, len1] = passU8a(cc);

  wasm.ext_sr_derive_keypair_hard(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519DeriveKeypairSoft = wrapReady(function (wasm, pair, cc) {
  const [ptr0, len0] = passU8a(pair);
  const [ptr1, len1] = passU8a(cc);

  wasm.ext_sr_derive_keypair_soft(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519DerivePublicSoft = wrapReady(function (wasm, pubkey, cc) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(cc);

  wasm.ext_sr_derive_public_soft(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519KeypairFromSeed = wrapReady(function (wasm, seed) {
  const [ptr0, len0] = passU8a(seed);

  wasm.ext_sr_from_seed(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519Sign = wrapReady(function (wasm, pubkey, secret, message) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(secret);
  const [ptr2, len2] = passU8a(message);

  wasm.ext_sr_sign(8, ptr0, len0, ptr1, len1, ptr2, len2);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 1);

  return ret;
});

module.exports.sr25519Verify = wrapReady(function (wasm, signature, message, pubkey) {
  const [ptr0, len0] = passU8a(signature);
  const [ptr1, len1] = passU8a(message);
  const [ptr2, len2] = passU8a(pubkey);
  const ret = wasm.ext_sr_verify(ptr0, len0, ptr1, len1, ptr2, len2);

  return ret !== 0;
});

module.exports.isReady = function () {
  return !!getWasm();
};

module.exports.waitReady = function () {
  return wasmPromise.then(() => !!getWasm());
};
