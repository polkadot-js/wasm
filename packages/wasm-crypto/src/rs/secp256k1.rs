// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use libsecp256k1::{Message, PublicKey, RecoveryId, Signature};
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

#[wasm_bindgen]
pub fn ext_secp_recover(message: &[u8], signature: &[u8], recovery: u8) -> Vec<u8> {
	match libsecp256k1::recover(
		&Message::parse_slice(message).unwrap(),
		&Signature::parse_standard_slice(signature).unwrap(),
		&RecoveryId::parse(recovery).unwrap()
	) {
		Ok(pubkey) => pubkey.serialize_compressed().to_vec(),
		Err(_) => panic!("Invalid message provided.")
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

	#[test]
	fn can_recover() {
		let expected = hex!("028d13da15a02f3a70677339d51b14177ee9b49657662b35e56a9d9dee17db1d30");
		let sig = hex!("7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff");
    	let msg = hex!("a30b64ce1eedf409c8afb801d72c05234e64849ea538c15dd3c8cf4ffcf166c9");
		let result = ext_secp_recover(&msg, &sig, 0);

		assert_eq!(result[..], expected[..]);
	}
}
