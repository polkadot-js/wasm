// Copyright 2019 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

extern crate hmac;
extern crate pbkdf2;
extern crate wasm_bindgen;
extern crate wee_alloc;
extern crate sha2;

use hmac::Hmac;
use pbkdf2::pbkdf2;
use sha2::Sha512;
use wasm_bindgen::prelude::*;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Hash an input with the salt for the number of specified rounds
#[wasm_bindgen]
pub fn pbkdf2_hash(data: &[u8], salt: &[u8], rounds: usize) -> Vec<u8> {
	let mut result = [0u8; 64];

	pbkdf2::<Hmac<Sha512>>(data, salt, rounds, &mut result);

	result.to_vec()
}

#[cfg(test)]
pub mod tests {
	use hex_literal::{hex, hex_impl};
	use super::*;

	#[test]
	fn can_pbkdf2_hash() {
		let salt = b"this is a salt";
		let data = b"hello world";
		let expected = hex!("5fcbe04f05300a3ecc5c35d18ea0b78f3f6853d2ae5f3fca374f69a7d1f78b5def5c60dae1a568026c7492511e0c53521e8bb6e03a650e1263265fee92722270");

		assert_eq!(pbkdf2_hash(data, salt, 2048)[..], expected[..64]);
	}
}
