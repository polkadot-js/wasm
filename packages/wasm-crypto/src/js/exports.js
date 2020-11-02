// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const asmFallback = require('./wasm_asm_stub');
const wasmBytes = require('./wasm_wasm');

const { getInt32, getString, getU8a, getWasm, initWasm, passString, passU8a } = require('./bridge');
const imports = require('./imports');

const wasmPromise = initWasm(wasmBytes, asmFallback, imports).catch(() => null);

module.exports.bip39_generate = function (words) {
  getWasm().ext_bip39_generate(8, words);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getString(r0, r1);

  getWasm().__wbindgen_free(r0, r1);

  return ret;
};

module.exports.bip39_to_entropy = function (phrase) {
  const [ptr0, len0] = passString(phrase);

  getWasm().ext_bip39_to_entropy(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.bip39_to_mini_secret = function (phrase, password) {
  const [ptr0, len0] = passString(phrase);
  const [ptr1, len1] = passString(password);

  getWasm().ext_bip39_to_mini_secret(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.bip39_to_seed = function (phrase, password) {
  const [ptr0, len0] = passString(phrase);
  const [ptr1, len1] = passString(password);

  getWasm().ext_bip39_to_seed(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.bip39_validate = function (phrase) {
  const [ptr0, len0] = passString(phrase);
  const ret = getWasm().ext_bip39_validate(ptr0, len0);

  return ret !== 0;
};

module.exports.ed_from_seed = function (seed) {
  const [ptr0, len0] = passU8a(seed);

  getWasm().ext_ed_from_seed(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.ed_sign = function (pubkey, seckey, message) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(seckey);
  const [ptr2, len2] = passU8a(message);

  getWasm().ext_ed_sign(8, ptr0, len0, ptr1, len1, ptr2, len2);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.ed_verify = function (signature, message, pubkey) {
  const [ptr0, len0] = passU8a(signature);
  const [ptr1, len1] = passU8a(message);
  const [ptr2, len2] = passU8a(pubkey);
  const ret = getWasm().ext_ed_verify(ptr0, len0, ptr1, len1, ptr2, len2);

  return ret !== 0;
};

module.exports.blake2b = function (data, key, size) {
  const [ptr0, len0] = passU8a(data);
  const [ptr1, len1] = passU8a(key);

  getWasm().ext_blake2b(8, ptr0, len0, ptr1, len1, size);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.keccak256 = function (data) {
  const [ptr0, len0] = passU8a(data);

  getWasm().ext_keccak256(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.pbkdf2 = function (data, salt, rounds) {
  const [ptr0, len0] = passU8a(data);
  const [ptr1, len1] = passU8a(salt);

  getWasm().ext_pbkdf2(8, ptr0, len0, ptr1, len1, rounds);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.scrypt = function (password, salt, log2_n, r, p) {
  const [ptr0, len0] = passU8a(password);
  const [ptr1, len1] = passU8a(salt);

  getWasm().ext_scrypt(8, ptr0, len0, ptr1, len1, log2_n, r, p);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sha512 = function (data) {
  const [ptr0, len0] = passU8a(data);

  getWasm().ext_sha512(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.twox = function (data, rounds) {
  const [ptr0, len0] = passU8a(data);

  getWasm().ext_twox(8, ptr0, len0, rounds);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_derive_keypair_hard = function (pair, cc) {
  const [ptr0, len0] = passU8a(pair);
  const [ptr1, len1] = passU8a(cc);

  getWasm().ext_sr_derive_keypair_hard(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_derive_keypair_soft = function (pair, cc) {
  const [ptr0, len0] = passU8a(pair);
  const [ptr1, len1] = passU8a(cc);

  getWasm().ext_sr_derive_keypair_soft(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_derive_public_soft = function (pubkey, cc) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(cc);

  getWasm().ext_sr_derive_public_soft(8, ptr0, len0, ptr1, len1);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_from_seed = function (seed) {
  const [ptr0, len0] = passU8a(seed);

  getWasm().ext_sr_from_seed(8, ptr0, len0);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_sign = function (pubkey, secret, message) {
  const [ptr0, len0] = passU8a(pubkey);
  const [ptr1, len1] = passU8a(secret);
  const [ptr2, len2] = passU8a(message);

  getWasm().ext_sr_sign(8, ptr0, len0, ptr1, len1, ptr2, len2);

  const r0 = getInt32()[8 / 4 + 0];
  const r1 = getInt32()[8 / 4 + 1];
  const ret = getU8a(r0, r1).slice();

  getWasm().__wbindgen_free(r0, r1 * 1);

  return ret;
};

module.exports.sr_verify = function (signature, message, pubkey) {
  const [ptr0, len0] = passU8a(signature);
  const [ptr1, len1] = passU8a(message);
  const [ptr2, len2] = passU8a(pubkey);
  const ret = getWasm().ext_sr_verify(ptr0, len0, ptr1, len1, ptr2, len2);

  return ret !== 0;
};

module.exports.isReady = function () {
  return !!getWasm();
};

module.exports.waitReady = function () {
  return wasmPromise.then(() => !!getWasm());
};
