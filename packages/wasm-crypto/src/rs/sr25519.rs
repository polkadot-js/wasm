// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2019 Paritytech via https://github.com/paritytech/schnorrkel-js/
//
// Originally developed (as a fork) in https://github.com/polkadot-js/schnorrkel-js/
// which was adpated from the initial https://github.com/paritytech/schnorrkel-js/
// forked at commit eff430ddc3090f56317c80654208b8298ef7ab3f

use curve25519_dalek::scalar::Scalar;
use schnorrkel::{
	ExpansionMode, Keypair, MiniSecretKey, PublicKey, SecretKey, Signature,
	derive::{Derivation, ChainCode, CHAIN_CODE_LENGTH},
};
use wasm_bindgen::prelude::*;

// We must make sure that this is the same as declared in the substrate source code.
const CTX: &'static [u8] = b"substrate";

/// ChainCode construction helper
fn new_cc(data: &[u8]) -> ChainCode {
	let mut cc = [0u8; CHAIN_CODE_LENGTH];

	cc.copy_from_slice(&data);

	ChainCode(cc)
}

/// Perform a derivation on a secret
///
/// * secret: UIntArray with 64 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector the derived keypair as a array of 96 bytes
#[wasm_bindgen]
pub fn ext_sr_derive_keypair_hard(pair: &[u8], cc: &[u8]) -> Vec<u8> {
	match Keypair::from_half_ed25519_bytes(pair) {
		Ok(p) => p.secret
			.hard_derive_mini_secret_key(Some(new_cc(cc)), &[]).0
			.expand_to_keypair(ExpansionMode::Ed25519)
			.to_half_ed25519_bytes()
			.to_vec(),
		_ => panic!("Invalid pair provided.")
	}
}

/// Perform a derivation on a secret
///
/// * secret: UIntArray with 64 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector the derived keypair as a array of 96 bytes
#[wasm_bindgen]
pub fn ext_sr_derive_keypair_soft(pair: &[u8], cc: &[u8]) -> Vec<u8> {
	match Keypair::from_half_ed25519_bytes(pair) {
		Ok(p) => p
			.derived_key_simple(new_cc(cc), &[]).0
			.to_half_ed25519_bytes()
			.to_vec(),
		_ => panic!("Invalid pair provided.")
	}
}

/// Perform a derivation on a publicKey
///
/// * pubkey: UIntArray with 32 bytes
/// * cc: UIntArray with 32 bytes
///
/// returned vector is the derived publicKey as a array of 32 bytes
#[wasm_bindgen]
pub fn ext_sr_derive_public_soft(pubkey: &[u8], cc: &[u8]) -> Vec<u8> {
	match PublicKey::from_bytes(pubkey) {
		Ok(k) => k
			.derived_key_simple(new_cc(cc), &[]).0
			.to_bytes()
			.to_vec(),
		_ => panic!("Invalid pubkey provided.")
	}
}

/// Generate a key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (64 bytes)
/// followed by the public key (32) bytes.
#[wasm_bindgen]
pub fn ext_sr_from_seed(seed: &[u8]) -> Vec<u8> {
	match MiniSecretKey::from_bytes(seed) {
		Ok(s) => s
			.expand_to_keypair(ExpansionMode::Ed25519)
			.to_half_ed25519_bytes()
			.to_vec(),
		_ => panic!("Invalid seed provided.")
	}
}

/// Generate a key pair from a known pair. (This is not exposed via WASM)
///
/// * seed: UIntArray with 96 element
///
/// returned vector is the concatenation of first the private key (64 bytes)
/// followed by the public key (32) bytes.
pub fn ext_sr_from_pair(pair: &[u8]) -> Vec<u8> {
	match Keypair::from_half_ed25519_bytes(pair) {
		Ok(p) => p
			.to_half_ed25519_bytes()
			.to_vec(),
		_ => panic!("Invalid pair provided.")
	}
}

/// Sign a message
///
/// The combination of both public and private key must be provided.
/// This is effectively equivalent to a keypair.
///
/// * pubkey: UIntArray with 32 element
/// * private: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
///
/// * returned vector is the signature consisting of 64 bytes.
#[wasm_bindgen]
pub fn ext_sr_sign(pubkey: &[u8], secret: &[u8], message: &[u8]) -> Vec<u8> {
	match (SecretKey::from_ed25519_bytes(secret), PublicKey::from_bytes(pubkey)) {
		(Ok(s), Ok(k)) => s
			.sign_simple(CTX, message, &k)
			.to_bytes()
			.to_vec(),
		_ => panic!("Invalid secret or pubkey provided.")
	 }
}

/// Verify a message and its corresponding against a public key;
///
/// * signature: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
/// * pubkey: UIntArray with 32 element
#[wasm_bindgen]
pub fn ext_sr_verify(signature: &[u8], message: &[u8], pubkey: &[u8]) -> bool {
	match (Signature::from_bytes(signature), PublicKey::from_bytes(pubkey)) {
		(Ok(s), Ok(k)) => k
			.verify_simple(CTX, message, &s)
			.is_ok(),
		_ => false
	}
}

/// Key agreement between other's public key and self secret key.
///
/// * pubkey: UIntArray with 32 element
/// * secret: UIntArray with 64 element
///
/// * returned vector is the generated secret of 32 bytes.
#[wasm_bindgen]
pub fn ext_sr_agree(pubkey: &[u8], secret: &[u8]) -> Vec<u8> {
	match SecretKey::from_ed25519_bytes(secret) {
		Ok(s) => {
			// The first 32 bytes holds the canonical private key
			let mut key = [0u8; 32];

			key.copy_from_slice(&s.to_bytes()[0..32]);

			match (Scalar::from_canonical_bytes(key), PublicKey::from_bytes(pubkey)) {
				(Some(n), Ok(k)) => (&n * k.as_point())
					.compress().0
					.to_vec(),
				_ => panic!("Invalid scalar or pubkey provided.")
			}
		},
		_ => panic!("Invalid secret provided.")
	}
}

#[cfg(test)]
pub mod tests {
	extern crate rand;
	extern crate schnorrkel;

	use super::*;
	use hex_literal::hex;
	use schnorrkel::{SIGNATURE_LENGTH, KEYPAIR_LENGTH, SECRET_KEY_LENGTH};

	fn generate_random_seed() -> Vec<u8> {
		(0..32).map(|_| rand::random::<u8>()).collect()
	}

	#[test]
	fn can_new_keypair() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());

		assert!(keypair.len() == KEYPAIR_LENGTH);
	}

	#[test]
	fn creates_pair_from_known_seed() {
		let seed = hex!("fac7959dbfe72f052e5a0c3c8d6530f202b02fd8f9f5ca3580ec8deb7797479e");
		let expected = hex!("46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
		let keypair = ext_sr_from_seed(&seed);
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(public, expected);
	}

	#[test]
	fn new_pair_from_known_pair() {
		let input = hex!("28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca3446ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
		let keypair = ext_sr_from_pair(&input);
		let expected = hex!("46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a");
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
		let message = b"I hereby verify that I control 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
		let public = hex!("d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d");
		let signature = hex!("1037eb7e51613d0dcf5930ae518819c87d655056605764840d9280984e1b7063c4566b55bf292fcab07b369d01095879b50517beca4d26e6a65866e25fec0d83");
		let is_valid = ext_sr_verify(&signature, message, &public);

		assert!(is_valid);
	}

	#[test]
	fn can_verify_known_wrapped_message() {
		let message = b"<Bytes>message to sign</Bytes>";
		let public = hex!("f84d048da2ddae2d9d8fd6763f469566e8817a26114f39408de15547f6d47805");
		let signature = hex!("48ce2c90e08651adfc8ecef84e916f6d1bb51ebebd16150ee12df247841a5437951ea0f9d632ca165e6ab391532e75e701be6a1caa88c8a6bcca3511f55b4183");
		let is_valid = ext_sr_verify(&signature, message, &public);

		assert!(is_valid);
	}

	#[test]
	fn can_verify_known_wrapped_message_fail() {
		let message = b"message to sign";
		let public = hex!("f84d048da2ddae2d9d8fd6763f469566e8817a26114f39408de15547f6d47805");
		let signature = hex!("48ce2c90e08651adfc8ecef84e916f6d1bb51ebebd16150ee12df247841a5437951ea0f9d632ca165e6ab391532e75e701be6a1caa88c8a6bcca3511f55b4183");
		let is_valid = ext_sr_verify(&signature, message, &public);

		assert!(!is_valid);
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

	#[test]
	fn key_agreement() {
		let self_seed = hex!("98b3d305d5a5eace562387e47e59badd4d77e3f72cabfb10a60f8a197059f0a8");
		let other_seed = hex!("9732eea001851ff862d949a1699c9971f3a26edbede2ad7922cbbe9a0701f366");
		let expected = hex!("b03a0b198c34c16f35cae933d88b16341b4cef3e84e851f20e664c6a30527f4e");
		let self_pair = ext_sr_from_seed(&self_seed);
		let self_sk = &self_pair[0..SECRET_KEY_LENGTH];
		let self_pk = &self_pair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let other_pair = ext_sr_from_seed(&other_seed);
		let other_sk = &other_pair[0..SECRET_KEY_LENGTH];
		let other_pk = &other_pair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(ext_sr_agree(self_pk, other_sk), expected);
		assert_eq!(ext_sr_agree(other_pk, self_sk), expected);

		let seed = generate_random_seed();
		let self_pair = ext_sr_from_seed(seed.as_slice());
		let self_sk = &self_pair[0..SECRET_KEY_LENGTH];
		let self_pk = &self_pair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		let seed = generate_random_seed();
		let other_pair = ext_sr_from_seed(seed.as_slice());
		let other_sk = &other_pair[0..SECRET_KEY_LENGTH];
		let other_pk = &other_pair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];

		assert_eq!(ext_sr_agree(self_pk, other_sk), ext_sr_agree(other_pk, self_sk));
	}
}
