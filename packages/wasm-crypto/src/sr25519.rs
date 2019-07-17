// Copyright 2019 Paritytech via https://github.com/paritytech/schnorrkel-js/
// Copyright 2019 @polkadot/wasm-schnorrkel authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Originally developed (as a fork) in https://github.com/polkadot-js/schnorrkel-js/
// which was adpated from the initial https://github.com/paritytech/schnorrkel-js/
// forked at commit eff430ddc3090f56317c80654208b8298ef7ab3f

use schnorrkel::{
	Keypair, MiniSecretKey, PublicKey, SecretKey, Signature,
	derive::{Derivation, ChainCode, CHAIN_CODE_LENGTH},
};
use wasm_bindgen::prelude::*;

// We must make sure that this is the same as declared in the substrate source code.
const SIGNING_CTX: &'static [u8] = b"substrate";

/// ChainCode construction helper
fn create_cc(data: &[u8]) -> ChainCode {
	let mut cc = [0u8; CHAIN_CODE_LENGTH];

	cc.copy_from_slice(&data);

	ChainCode(cc)
}

/// Keypair helper function.
fn create_from_seed(seed: &[u8]) -> Keypair {
	match MiniSecretKey::from_bytes(seed) {
		Ok(mini) => return mini.expand_to_keypair(),
		Err(_) => panic!("Provided seed is invalid.")
	}
}

/// Keypair helper function.
fn create_from_pair(pair: &[u8]) -> Keypair {
	match Keypair::from_bytes(pair) {
		Ok(pair) => return pair,
		Err(_) => panic!("Provided pair is invalid.")
	}
}

/// PublicKey helper
fn create_public(public: &[u8]) -> PublicKey {
	match PublicKey::from_bytes(public) {
		Ok(public) => return public,
		Err(_) => panic!("Provided public key is invalid.")
	}
}

/// SecretKey helper
fn create_secret(secret: &[u8]) -> SecretKey {
	match SecretKey::from_bytes(secret) {
		Ok(secret) => return secret,
		Err(_) => panic!("Provided private key is invalid.")
	}
}

/// Perform a derivation on a secret
///
/// * secret: UIntArray with 64 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector the derived keypair as a array of 96 bytes
#[wasm_bindgen]
pub fn ext_sr_derive_keypair_hard(pair: &[u8], cc: &[u8]) -> Vec<u8> {
	create_from_pair(pair).secret
		.hard_derive_mini_secret_key(Some(create_cc(cc)), &[]).0
		.expand_to_keypair()
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
pub fn ext_sr_derive_keypair_soft(pair: &[u8], cc: &[u8]) -> Vec<u8> {
	create_from_pair(pair)
		.derived_key_simple(create_cc(cc), &[]).0
		.to_bytes()
		.to_vec()
}

/// Perform a derivation on a publicKey
///
/// * pubkey: UIntArray with 32 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector is the derived publicKey as a array of 32 bytes
#[wasm_bindgen]
pub fn ext_sr_derive_public_soft(public: &[u8], cc: &[u8]) -> Vec<u8> {
	create_public(public)
		.derived_key_simple(create_cc(cc), &[]).0
		.to_bytes().to_vec()
}

/// Generate a key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (64 bytes)
/// followed by the public key (32) bytes.
#[wasm_bindgen]
pub fn ext_sr_from_seed(seed: &[u8]) -> Vec<u8> {
	create_from_seed(seed)
		.to_bytes()
		.to_vec()
}

/// Sign a message
///
/// The combination of both public and private key must be provided.
/// This is effectively equivalent to a keypair.
///
/// * public: UIntArray with 32 element
/// * private: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
///
/// * returned vector is the signature consisting of 64 bytes.
#[wasm_bindgen]
pub fn ext_sr_sign(public: &[u8], secret: &[u8], message: &[u8]) -> Vec<u8> {
	create_secret(secret)
		.sign_simple(SIGNING_CTX, message, &create_public(public))
		.to_bytes()
		.to_vec()
}

/// Verify a message and its corresponding against a public key;
///
/// * signature: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
/// * pubkey: UIntArray with 32 element
#[wasm_bindgen]
pub fn ext_sr_verify(signature: &[u8], message: &[u8], public: &[u8]) -> bool {
	let signature = match Signature::from_bytes(signature) {
		Ok(signature) => signature,
		Err(_) => return false
	};

	create_public(public)
		.verify_simple(SIGNING_CTX, message, &signature)
}

#[cfg(test)]
pub mod tests {
	extern crate rand;
	extern crate schnorrkel;

	use hex_literal::hex;
	use super::*;
	use schnorrkel::{SIGNATURE_LENGTH, KEYPAIR_LENGTH, SECRET_KEY_LENGTH};

	fn generate_random_seed() -> Vec<u8> {
		(0..32).map(|_| rand::random::<u8>() ).collect()
	}

	#[test]
	fn can_create_keypair() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());

		assert!(keypair.len() == KEYPAIR_LENGTH);
	}

	#[test]
	fn creates_pair_from_known() {
		let seed = hex!("fac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e");
		let expected = hex!("46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
		let keypair = ext_sr_from_seed(&seed);
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(public, expected);
	}

	#[test]
	fn can_sign_message() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let message = b"this is a message";
		let signature = ext_sr_sign(public, private, message);

		assert!(signature.len() == SIGNATURE_LENGTH);
	}

	#[test]
	fn can_verify_message() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let message = b"this is a message";
		let signature = ext_sr_sign(public, private, message);
		let is_valid = ext_sr_verify(&signature[..], message, public);

		assert!(is_valid);
	}

	#[test]
	fn can_verify_known_message() {
		let message = b"Verifying that I am the owner of 5G9hQLdsKQswNPgB499DeA5PkFBbgkLPJWkkS6FAM6xGQ8xD. Hash: 221455a3\n";
		let public = hex!("b4bfa1f7a5166695eb75299fd1c4c03ea212871c342f2c5dfea0902b2c246918");
		let signature = hex!("5a9755f069939f45d96aaf125cf5ce7ba1db998686f87f2fb3cbdea922078741a73891ba265f70c31436e18a9acd14d189d73c12317ab6c313285cd938453202");
		let is_valid = ext_sr_verify(&signature, message, &public);

		assert!(is_valid);
	}

	#[test]
	fn soft_derives_pair() {
		let cc = hex!("0c666f6f00000000000000000000000000000000000000000000000000000000"); // foo
		let seed = hex!("fac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e");
		let expected = hex!("40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a");
		let keypair = ext_sr_from_seed(&seed);
		let derived = ext_sr_derive_keypair_soft(&keypair, &cc);
		let public = &derived[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(public, expected);
	}

	#[test]
	fn soft_derives_public() {
		let cc = hex!("0c666f6f00000000000000000000000000000000000000000000000000000000"); // foo
		let public = hex!("46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
		let expected = hex!("40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a");
		let derived = ext_sr_derive_public_soft(&public, &cc);

		assert_eq!(derived, expected);
	}

	#[test]
	fn hard_derives_pair() {
		let cc = hex!("14416c6963650000000000000000000000000000000000000000000000000000"); // Alice
		let seed = hex!("fac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e");
		let expected = hex!("d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d");
		let keypair = ext_sr_from_seed(&seed);
		let derived = ext_sr_derive_keypair_hard(&keypair, &cc);
		let public = &derived[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(public, expected);
	}
}
