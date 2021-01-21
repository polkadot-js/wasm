// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use blake2_rfc::blake2b::blake2b;
use byteorder::{ByteOrder, LittleEndian};
use hmac::Hmac;
use pbkdf2::pbkdf2;
use scrypt::{ScryptParams, scrypt};
use sha2::{Digest, Sha512};
use tiny_keccak::{Hasher, Keccak};
use twox_hash::XxHash;
use wasm_bindgen::prelude::*;

/// helper function for a single twox round with a seed
fn create_twox(data: &[u8], seed: u64) -> [u8; 8] {
	use ::std::hash::Hasher;
	let mut hasher = XxHash::with_seed(seed);

	hasher.write(data);

	let hash64 = hasher.finish();
	let mut result = [0u8; 8];

	LittleEndian::write_u64(&mut result, hash64);

	result
}

/// blake2b hash for the specified input
///
/// * data: Arbitrary data to be hashed
/// * key: Key to add to the hashing (normally empty)
/// * size: Size in bytes of the resulting output
///
/// Returns a vector with the hash result
#[wasm_bindgen]
pub fn ext_blake2b(data: &[u8], key: &[u8], size: u32) -> Vec<u8> {
	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	blake2b(size as usize, key, data)
		.as_bytes()
		.to_vec()
}

/// Create a keccak256 hash for the specified input
///
// * data: Arbitrary data to be hashed
///
/// Returns the hash as a vector
#[wasm_bindgen]
pub fn ext_keccak256(data: &[u8]) -> Vec<u8> {
	let mut keccak = Keccak::v256();
	let mut result = [0u8; 32];

	keccak.update(data);
	keccak.finalize(&mut result);

	result.to_vec()
}

/// pbkdf2 kdf from an input, salt for the number of specified rounds
///
/// * data: Arbitrary data to be hashed
/// * salt: Salt for this hash
/// * rounds: The number of rounds to perform
///
/// Returns a vector with the hashed result
#[wasm_bindgen]
pub fn ext_pbkdf2(data: &[u8], salt: &[u8], rounds: u32) -> Vec<u8> {
	let mut result = [0u8; 64];

	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	pbkdf2::<Hmac<Sha512>>(data, salt, rounds as usize, &mut result);

	result.to_vec()
}

/// scrypt kdf from input, salt and config
///
/// * password: Password to hash
/// * salt: Salt for this hash
/// * log2_n: log2(n)
/// * r: r
/// * p: p
///
/// Returns vector with the hashed result
#[wasm_bindgen]
pub fn ext_scrypt(password: &[u8], salt: &[u8], log2_n: u8, r: u32, p: u32) -> Vec<u8> {
	let params = ScryptParams::new(log2_n, r, p).unwrap();
	let mut result = [0u8; 64];

	match scrypt(password, salt, &params, &mut result) {
		Ok(_) => return result.to_vec(),
		Err(_) => panic!("Invalid scrypt hash.")
	}
}

/// sha512 hash for the specified input
///
/// * data: Arbitrary data to be hashed
///
/// Returns a vector with the hash result
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
/// Returns a vector with the hash result
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
	use hex_literal::hex;
	use super::*;

	#[test]
	fn can_blake2b() {
		let data = b"abc";
		let expected_32 = hex!("bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319");
		let expected_64 = hex!("ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923");
		let hash_32 = ext_blake2b(data, &[], 32);
		let hash_64 = ext_blake2b(data, &[], 64);

		assert_eq!(hash_32[..], expected_32[..]);
		assert_eq!(hash_64[..], expected_64[..]);
	}

	#[test]
	fn can_keccak256() {
		let data = b"test value";
		let expected = hex!("2d07364b5c231c56ce63d49430e085ea3033c750688ba532b24029124c26ca5e");
		let hash = ext_keccak256(data);

		assert_eq!(hash[..], expected[..]);
	}

	#[test]
	fn can_pbkdf2() {
		let salt = b"this is a salt";
		let data = b"hello world";
		let expected = hex!("5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270");
		let hash = ext_pbkdf2(data, salt, 2048);

		assert_eq!(hash[..], expected[..]);
	}

	#[test]
	fn can_scrypt() {
		let password = b"password";
		let salt = b"salt";
		let expected = hex!("745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6");
		let hash = ext_scrypt(password, salt, 14, 8, 1);

		assert_eq!(hash[..], expected[..]);
	}

	#[test]
	fn can_sha512() {
		let data = b"hello world";
		let expected = hex!("309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f");
		let hash = ext_sha512(data);

		assert_eq!(hash[..], expected[..]);
	}

	#[test]
	fn can_twox() {
		let data = b"abc";
		let expected_64 = hex!("990977adf52cbc44");
		let expected_256 = hex!("990977adf52cbc440889329981caa9bef7da5770b2b8a05303b75d95360dd62b");
		let hash_64 = ext_twox(data, 1);
		let hash_256 = ext_twox(data, 4);

		assert_eq!(hash_64[..], expected_64[..]);
		assert_eq!(hash_256[..], expected_256[..]);
	}
}
