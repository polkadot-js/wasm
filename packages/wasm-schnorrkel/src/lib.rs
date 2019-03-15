// Copyright 2019 Paritytech & @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Adpated from the initial version at https://github.com/paritytech/schnorrkel-js/
// Forked at commit eff430ddc3090f56317c80654208b8298ef7ab3f

extern crate schnorrkel;
extern crate wasm_bindgen;
extern crate wee_alloc;

use sha2::Sha512;
use schnorrkel::{
	Keypair, MiniSecretKey, PublicKey, SecretKey, signing_context,
	derive::{Derrivation, ChainCode, CHAIN_CODE_LENGTH},
	sign::{Signature},
};
use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// We must make sure that this is the same as declared in the substrate source code.
const SIGNING_CTX: &[u8] = b"substrate";

/// ChainCode construction helper
fn create_cc(cc: &[u8]) -> ChainCode {
	let mut data = [0u8; CHAIN_CODE_LENGTH];

	data.copy_from_slice(&cc);

	ChainCode(data)
}

/// Keypair constructor (via suuplied pair)
fn create_from_pair(pair: &[u8]) -> Keypair {
	match Keypair::from_bytes(pair) {
		Ok(result) => return result,
		Err(_) => panic!("Provided keypair is invalid")
	}
}

/// Keypair constructor (via seed)
fn create_from_seed(seed: &[u8]) -> Keypair {
	match MiniSecretKey::from_bytes(seed) {
		Ok(result) => return result.expand_to_keypair::<Sha512>(),
		Err(_) => panic!("Provided seed is invalid.")
	}
}

/// PublicKey constructor
fn create_public(public: &[u8]) -> PublicKey {
	match PublicKey::from_bytes(public) {
		Ok(result) => return result,
		Err(_) => panic!("Provided public key is invalid")
	}
}

/// SecretKey constructor
fn create_secret(secret: &[u8]) -> SecretKey {
	match SecretKey::from_bytes(secret) {
		Ok(result) => return result,
		Err(_) => panic!("Provided private key is invalid")
	}
}

/// Generate a key pair. .
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (64 bytes)
/// followed by the public key (32) bytes.
#[wasm_bindgen]
pub fn keypair_from_seed(seed: &[u8]) -> Vec<u8> {
	create_from_seed(seed)
		.to_bytes()
		.to_vec()
}

/// Perform a derivation on a secret
///
/// * secret: UIntArray with 64 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector the derived keypair as a array of 96 bytes
#[wasm_bindgen]
pub fn soft_derive_keypair(pair: &[u8], cc: &[u8]) -> Vec<u8> {
	create_from_pair(pair)
		.derived_key_simple(create_cc(cc), &[])
		.0
		.to_bytes()
		.to_vec()
}

/// Perform a derivation on a publicKey
///
/// * public: UIntArray with 32 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector is the derived publicKey as a array of 32 bytes
#[wasm_bindgen]
pub fn soft_derive_public(public: &[u8], cc: &[u8]) -> Vec<u8> {
	create_public(public)
		.derived_key_simple(create_cc(cc), &[])
		.0
		.to_bytes()
		.to_vec()
}

/// Perform a derivation on a secret
///
/// * secret: UIntArray with 64 bytes
/// * junction: UIntArray with 32 bytes
///
/// returned vector the derived secret as a array of 64 bytes
#[wasm_bindgen]
pub fn soft_derive_secret(secret: &[u8], cc: &[u8]) -> Vec<u8> {
	create_secret(secret)
		.derived_key_simple(create_cc(cc), &[])
		.0
		.to_bytes()
		.to_vec()
}

/// Generate a secret key (aka. private key) from a seed phrase.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the private key consisting of 64 bytes.
#[wasm_bindgen]
pub fn secret_from_seed(seed: &[u8]) -> Vec<u8> {
	create_from_seed(seed)
		.secret
		.to_bytes()
		.to_vec()
}

/// Sign a message
///
/// The combination of both public and private key must be provided.
/// This is effectively equivalent to a keypair.
///
/// * public: UIntArray with 32 element
/// * secret: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
///
/// * returned vector is the signature consisting of 64 bytes.
#[wasm_bindgen]
pub fn sign(public: &[u8], secret: &[u8], message: &[u8]) -> Vec<u8> {
	let public = create_public(public);

	create_secret(secret)
		.sign(signing_context(SIGNING_CTX).bytes(message), &public)
		.to_bytes()
		.to_vec()
}

/// Verify a message and its corresponding against a public key;
///
/// * signature: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
/// * pubkey: UIntArray with 32 element
#[wasm_bindgen]
pub fn verify(signature: &[u8], message: &[u8], public: &[u8]) -> bool {
	match Signature::from_bytes(signature) {
		Ok(sig) => return create_public(public).verify_simple(SIGNING_CTX, message, &sig),
		Err(_) => return false
	};
}

#[cfg(test)]
pub mod tests {
	// extern crate wasm_bindgen_test;
	extern crate rand;
	extern crate schnorrkel;

	use hex_literal::{hex, hex_impl};
	use schnorrkel::{SIGNATURE_LENGTH, KEYPAIR_LENGTH, SECRET_KEY_LENGTH};
	// use wasm_bindgen_test::*;
	use super::*;

	fn generate_random_seed() -> Vec<u8> {
		(0..32).map(|_| rand::random::<u8>() ).collect()
	}

	// #[wasm_bindgen_test]
	#[test]
	fn can_create_keypair() {
		let seed = generate_random_seed();
		let keypair = keypair_from_seed(seed.as_slice());

		assert!(keypair.len() == KEYPAIR_LENGTH);
	}

	#[test]
	fn can_create_secret() {
		let seed = generate_random_seed();
		let secret = secret_from_seed(seed.as_slice());

		assert!(secret.len() == SECRET_KEY_LENGTH);
	}

	#[test]
	fn can_sign_message() {
		let seed = generate_random_seed();
		let keypair = keypair_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let message = b"this is a message";
		let signature = sign(public, private, message);

		assert!(signature.len() == SIGNATURE_LENGTH);
	}

	#[test]
	fn can_verify_message() {
		let seed = generate_random_seed();
		let keypair = keypair_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let message = b"this is a message";
		let signature = sign(public, private, message);

		assert!(verify(&signature[..], message, public));
	}

	#[test]
	fn soft_derives_public_keys() {
		// "foo" with compact length added
		let cc = hex!("0c666f6f00000000000000000000000000000000000000000000000000000000");
		let public = hex!("46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
		let expected = hex!("40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a");

		assert_eq!(soft_derive_public(&public, &cc), expected);
	}

	#[test]
	fn soft_derives_pairs() {
		// "foo" with compact length added
		let cc = hex!("0c666f6f00000000000000000000000000000000000000000000000000000000");
		let seed = hex!("fac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e");
		let keypair = keypair_from_seed(&seed);
		let expected = hex!("40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a");
		let derived = soft_derive_keypair(&keypair, &cc);
		let public = &derived[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(public, expected);
	}
}
