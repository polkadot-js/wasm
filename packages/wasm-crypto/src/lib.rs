// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

use bip39::{Mnemonic, MnemonicType, Language, Seed};
use blake2_rfc::blake2b::blake2b;
use byteorder::{ByteOrder, LittleEndian};
use hmac::Hmac;
use pbkdf2::pbkdf2;
// use secp256k1;
use sha2::{Digest, Sha512};
use std::hash::Hasher;
use tiny_keccak::keccak256;
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
	let mnemonic = Mnemonic::from_phrase(phrase, Language::English).unwrap();
	let mut result = [0u8; 64];

	pbkdf2::<Hmac<Sha512>>(mnemonic.entropy(), salt.as_bytes(), 2048, &mut result);

	result[..32].to_vec()
}

/// Creates a see from a bip-39 phrase
///
/// @phrase: mnemonic phrase
///
/// Returns a 32-byte seed
#[wasm_bindgen]
pub fn ext_bip39_to_seed(phrase: &str, password: &str) -> Vec<u8> {
	let mnemonic = Mnemonic::from_phrase(phrase, Language::English).unwrap();

	Seed::new(&mnemonic, password)
		.as_bytes()[..32]
		.to_vec()
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
	keccak256(data)
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

// /// Checks for the recoverability of a signature from message
// ///
// /// * message: The message
// /// * signature: The signature
// ///
// /// Returns 0 on success, or a specific error code
// #[wasm_bindgen]
// pub fn ext_secp256k1_is_recoverable(message: &[u8], signature: &[u8]) -> u32 {
// 	let rs = match secp256k1::Signature::parse_slice(&signature[0..64]) {
// 		Ok(rs) => rs,
// 		_ => return 1
// 	};
// 	let v = match secp256k1::RecoveryId::parse(if signature[64] > 26 { signature[64] - 27 } else { signature[64] } as u8) {
// 		Ok(v) => v,
// 		_ => return 2
// 	};
// 	let mut msg = [0u8; 32];

// 	msg.copy_from_slice(&message);

// 	match secp256k1::recover(&secp256k1::Message::parse(&msg), &rs, &v) {
// 		Ok(_) => 0,
// 		_ => 3
// 	}
// }

// /// Recovers the secp256k1 signature from the input
// ///
// /// * message: The message
// /// * signature: The signature
// ///
// /// Returns a vector with the recovered public key
// #[wasm_bindgen]
// pub fn ext_secp256k1_recover(message: &[u8], signature: &[u8]) -> Vec<u8> {
// 	let rs = match secp256k1::Signature::parse_slice(&signature[0..64]) {
// 		Ok(rs) => rs,
// 		_ => panic!("Unable to recover r,s")
// 	};
// 	let v = match secp256k1::RecoveryId::parse(if signature[64] > 26 { signature[64] - 27 } else { signature[64] } as u8) {
// 		Ok(v) => v,
// 		_ => panic!("Unable to recover v")
// 	};
// 	let mut msg = [0u8; 32];

// 	msg.copy_from_slice(&message);

// 	match secp256k1::recover(&secp256k1::Message::parse(&msg), &rs, &v) {
// 		Ok(pk) => return pk.serialize()[1..65].to_vec(),
// 		_ => panic!("Unable to recover publickey")
// 	}
// }

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

	// // Constructs the message that Ethereum RPC's `personal_sign` and `eth_sign` would sign.
	// fn ethereum_signable_message(data: &[u8]) -> Vec<u8> {
	// 	let prefix = b"Pay DOTs to the Polkadot account:";
	// 	let mut l = prefix.len() + data.len();
	// 	let mut rev = Vec::new();
	// 	let mut v = b"\x19Ethereum Signed Message:\n".to_vec();

	// 	while l > 0 {
	// 		rev.push(b'0' + (l % 10) as u8);
	// 		l /= 10;
	// 	}

	// 	v.extend(rev.into_iter().rev());
	// 	v.extend_from_slice(&prefix[..]);
	// 	v.extend_from_slice(data);
	// 	v
	// }

	#[test]
	fn can_bip39_entropy() {
		let phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
		let entropy = hex!("7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f");
		let result = ext_bip39_to_entropy(phrase);

		assert_eq!(result, entropy);
	}

	#[test]
	fn can_bip39_mini_secret() {
		let phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
		let password = "Substrate";
		let mini = hex!("4313249608fe8ac10fd5886c92c4579007272cb77c21551ee5b8d60b78041685");
		let result = ext_bip39_to_mini_secret(phrase, password);

		assert_eq!(result[..], mini[..]);
	}

	#[test]
	fn can_bip39_seed() {
		let phrase = "seed sock milk update focus rotate barely fade car face mechanic mercy";
		let seed = hex!("3c121e20de068083b49c2315697fb59a2d9e8643c24e5ea7628132c58969a027");
		let result = ext_bip39_to_seed(phrase, "");

		assert_eq!(result[..], seed[..]);
	}

	#[test]
	fn can_bip39_generate() {
		let phrase = ext_bip39_generate(12);
		let is_valid = ext_bip39_validate(&phrase);

		assert!(is_valid);
	}

	#[test]
	fn can_bip39_validate() {
		let is_valid = ext_bip39_validate("seed sock milk update focus rotate barely fade car face mechanic mercy");
		let is_invalid = ext_bip39_validate("wine photo extra cushion basket dwarf humor cloud truck job boat submit");

		assert_eq!(is_valid, true);
		assert_eq!(is_invalid, false);
	}

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

	// #[test]
	// fn can_secp256k1_real_eth_sig() {
	// 	let sig = hex!("7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff1c");
	// 	let pk = hex!("DF67EC7EAe23D2459694685257b6FC59d1BAA1FE");
	// 	let data = [42, 0, 0, 0, 0, 0, 0, 0];
	// 	let msg = ext_keccak256(&ethereum_signable_message(&data));
	// 	let result = ext_keccak256(&ext_secp256k1_recover(&msg[..], &sig[..]));

	// 	assert_eq!(result[12..], pk[..]);
	// }

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
