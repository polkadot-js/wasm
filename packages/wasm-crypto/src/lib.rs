// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

extern crate bip39;
extern crate blake2_rfc;
extern crate hmac;
extern crate pbkdf2;
extern crate sha2;
extern crate twox_hash;
extern crate wasm_bindgen;
extern crate wee_alloc;

use bip39::{Mnemonic, MnemonicType, Language};
use blake2_rfc::blake2b::blake2b;
use byteorder::{ByteOrder, LittleEndian};
use hmac::Hmac;
use pbkdf2::pbkdf2;
use sha2::{Digest, Sha512};
use std::hash::Hasher;
use twox_hash::XxHash;
use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// helper function for a single twox round with a seed
fn create_twox(data: &[u8], seed: u64) -> [u8; 8] {
	let mut hasher = XxHash::with_seed(seed);

	hasher.write(data);

	let hash64 = hasher.finish();
	let mut result = [0u8; 8];

	LittleEndian::write_u64(&mut result, hash64);

	result
}

/// Generate a bip39 phrase
///
/// words: number of words, either 12, 15, 18 21 or 24
///
/// Returns the bip 39 phrase
#[wasm_bindgen]
pub fn ext_bip39_generate(words: u32) -> String {
	Mnemonic::new(MnemonicType::for_word_count(words as usize).unwrap(), Language::English)
		.into_phrase()
}

/// Create entropy from a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the entropy
#[wasm_bindgen]
pub fn ext_bip39_to_entropy(phrase: &str) -> Vec<u8> {
	Mnemonic::from_phrase(phrase, Language::English)
		.unwrap()
		.entropy()
		.to_vec()
}

/// Create a mini-secret from a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the 32-byte mini-secret via entropy
#[wasm_bindgen]
pub fn ext_bip39_to_mini_secret(phrase: &str, password: &str) -> Vec<u8> {
	let salt = format!("mnemonic{}", password);
	let mnemonic = Mnemonic::from_phrase(phrase, Language::English);
	let mut result = [0u8; 64];

	pbkdf2::<Hmac<Sha512>>(mnemonic.unwrap().entropy(), salt.as_bytes(), 2048, &mut result);

	result[..32].to_vec()
}

/// Validates a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the true/false
#[wasm_bindgen]
pub fn ext_bip39_validate(phrase: &str) -> bool {
	match Mnemonic::validate(phrase, Language::English) {
		Err(_) => false,
		_ => true
	}
}

/// blake2b hash for the specified input
///
/// * data: Arbitrary data to be hashed
/// * key: Key to add to the hashing (normally empty)
/// * size: Size in bytes of the resulting output
///
/// Returns a vecor with the hash result
#[wasm_bindgen]
pub fn ext_blake2b(data: &[u8], key: &[u8], size: u32) -> Vec<u8> {
	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	blake2b(size as usize, key, data)
		.as_bytes()
		.to_vec()
}

/// pbkdf2 hash from an input, salt for the number of specified rounds
///
/// * data: Arbitrary data to be hashed
/// * salt: Salt for this hash
/// * rounds: The number of rounds to perform
///
/// Returns a vecor with the hash result
#[wasm_bindgen]
pub fn ext_pbkdf2(data: &[u8], salt: &[u8], rounds: u32) -> Vec<u8> {
	let mut result = [0u8; 64];

	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	pbkdf2::<Hmac<Sha512>>(data, salt, rounds as usize, &mut result);

	result.to_vec()
}

/// sha512 hash for the specified input
///
/// * data: Arbitrary data to be hashed
///
/// Returns a vecor with the hash result
#[wasm_bindgen]
pub fn ext_sha512(data: &[u8]) -> Vec<u8> {
	let mut hasher = Sha512::new();

	hasher.input(data);

	hasher
		.result()
		.to_vec()
}

/// twox hash for the specified input and rounds
///
/// * data: Arbitrary data to be hashed
/// * rounds: Number of 8-byte rounds to add to the output
///
/// Returns a vecor with the hash result
#[wasm_bindgen]
pub fn ext_twox(data: &[u8], rounds: u32) -> Vec<u8> {
	let mut vec = vec![];

	for round in 0..rounds {
		// we cast to u64 here - due to the WASM, we'd rather have u32 inputs
		vec.extend_from_slice(&create_twox(data, round as u64));
	}

	vec
}

#[cfg(test)]
pub mod tests {
	use hex_literal::{hex, hex_impl};
	use super::*;

	#[test]
	fn can_bip39_entropy() {
		let phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
		let entropy = hex!("7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f");

		assert_eq!(ext_bip39_to_entropy(phrase), entropy);
	}

	#[test]
	fn can_bip39_mini_secret() {
		let phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
		let password = "Substrate";
		let mini = hex!("4313249608fe8ac10fd5886c92c4579007272cb77c21551ee5b8d60b78041685");

		assert_eq!(ext_bip39_to_mini_secret(phrase, password)[..], mini[..]);
	}

	#[test]
	fn can_bip39_generate() {
		assert!(ext_bip39_validate(&ext_bip39_generate(12)));
	}

	#[test]
	fn can_bip39_validate() {
		assert_eq!(ext_bip39_validate("seed sock milk update focus rotate barely fade car face mechanic mercy"), true);
		assert_eq!(ext_bip39_validate("wine photo extra cushion basket dwarf humor cloud truck job boat submit"), false);
	}

	#[test]
	fn can_blake2b() {
		let data = b"abc";
		let expected_32 = hex!("bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319");
		let expected_64 = hex!("ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923");

		assert_eq!(ext_blake2b(data, &[], 32)[..], expected_32[..]);
		assert_eq!(ext_blake2b(data, &[], 64)[..], expected_64[..]);
	}

	#[test]
	fn can_pbkdf2() {
		let salt = b"this is a salt";
		let data = b"hello world";
		let expected = hex!("5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270");

		assert_eq!(ext_pbkdf2(data, salt, 2048)[..], expected[..]);
	}

	#[test]
	fn can_sha512() {
		let data = b"hello world";
		let expected = hex!("309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f");

		assert_eq!(ext_sha512(data)[..], expected[..]);
	}

	#[test]
	fn can_twox() {
		let data = b"abc";
		let expected_64 = hex!("990977adf52cbc44");
		let expected_256 = hex!("990977adf52cbc440889329981caa9bef7da5770b2b8a05303b75d95360dd62b");

		assert_eq!(ext_twox(data, 1)[..], expected_64[..]);
		assert_eq!(ext_twox(data, 4)[..], expected_256[..]);
	}
}
