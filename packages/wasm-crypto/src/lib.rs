// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

extern crate blake2_rfc;
extern crate hmac;
extern crate pbkdf2;
extern crate sha2;
extern crate wasm_bindgen;
extern crate wee_alloc;

use blake2_rfc::blake2b::blake2b;
use hmac::Hmac;
use pbkdf2::pbkdf2;
use sha2::{Digest, Sha512};
use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// blake2b hash for the specified input
#[wasm_bindgen]
pub fn blake2b_hash(data: &[u8], key: &[u8], size: usize) -> Vec<u8> {
	blake2b(size, key, data).as_bytes().to_vec()
}

/// pbkdf2 hash from an input, salt for the number of specified rounds
#[wasm_bindgen]
pub fn pbkdf2_hash(data: &[u8], salt: &[u8], rounds: usize) -> Vec<u8> {
	let mut result = [0u8; 64];

	pbkdf2::<Hmac<Sha512>>(data, salt, rounds, &mut result);

	result.to_vec()
}

/// sha512 hash for the specified input
#[wasm_bindgen]
pub fn sha512_hash(data: &[u8]) -> Vec<u8> {
	let mut hasher = Sha512::new();

	hasher.input(data);

	hasher
		.result()
		.to_vec()
}

#[cfg(test)]
pub mod tests {
	use hex_literal::{hex, hex_impl};
	use super::*;

	#[test]
	fn can_blake2b_hash() {
		let data = b"abc";
		let expected_32 = hex!("bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319");
		let expected_64 = hex!("ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923");

		assert_eq!(blake2b_hash(data, &[], 32)[..], expected_32[..]);
		assert_eq!(blake2b_hash(data, &[], 64)[..], expected_64[..]);
	}

	#[test]
	fn can_pbkdf2_hash() {
		let salt = b"this is a salt";
		let data = b"hello world";
		let expected = hex!("5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270");

		assert_eq!(pbkdf2_hash(data, salt, 2048)[..], expected[..]);
	}

	#[test]
	fn can_sha512_hash() {
		let data = b"hello world";
		let expected = hex!("309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f");

		assert_eq!(sha512_hash(data)[..], expected[..]);
	}
}
