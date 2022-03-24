// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// use secp256k1::{ecdsa::{RecoverableSignature, RecoveryId}, Message, PublicKey, SecretKey, SECP256K1};
use secp256k1::{PublicKey, SecretKey, SECP256K1};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn ext_secp_from_seed(seed: &[u8]) -> Vec<u8> {
	match SecretKey::from_slice(seed) {
		Ok(s) => {
			let mut res = vec![];
			let pubkey = PublicKey::from_secret_key(SECP256K1, &s);

			res.extend_from_slice(&s.serialize_secret());
			res.extend_from_slice(&pubkey.serialize());

			res
		},
		_ => panic!("Invalid seed provided.")
	}
}

#[cfg(test)]
pub mod tests {
	use hex_literal::hex;
	use super::*;

	#[test]
	fn can_create_pair() {
		let seckey = hex!("4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae");
		let expected = hex!("4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae03fd8c74f795ced92064b86191cb2772b1e3a0947740aa0a5a6e379592471fd85b");
		let res = ext_secp_from_seed(&seckey);

		assert_eq!(res[..], expected[..]);
	}
}
