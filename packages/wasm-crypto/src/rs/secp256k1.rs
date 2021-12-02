// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use libsecp256k1::{PublicKey};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn ext_secp_pub_compress(data: &[u8]) -> Vec<u8> {
	let mut input = [0u8; 65];

	input.copy_from_slice(&data);

	match PublicKey::parse(&input) {
		Ok(pubkey) => pubkey.serialize_compressed().to_vec(),
		Err(_) => panic!("Invalid pubkey provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_pub_expand(data: &[u8]) -> Vec<u8> {
	let mut input = [0u8; 33];

	input.copy_from_slice(&data);

	match PublicKey::parse_compressed(&input) {
		Ok(pubkey) => pubkey.serialize().to_vec(),
		Err(_) => panic!("Invalid pubkey provided.")
	}
}

#[cfg(test)]
pub mod tests {
	use hex_literal::hex;
	use super::*;

	#[test]
	fn can_pub_compress_full() {
		let pubkey = hex!("04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af");
		let expected = hex!("03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077");
		let result = ext_secp_pub_compress(&pubkey);

		assert_eq!(result[..], expected[..]);
	}

	#[test]
	fn can_pub_expand_comp() {
		let pubkey = hex!("03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077");
		let expected = hex!("04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af");
		let result = ext_secp_pub_expand(&pubkey);

		assert_eq!(result[..], expected[..]);
	}
}
