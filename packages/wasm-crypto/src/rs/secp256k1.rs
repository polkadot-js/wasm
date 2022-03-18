// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use libsecp256k1::{Message, PublicKey, RecoveryId, SecretKey, Signature, recover, sign};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn ext_secp_pub_compress(pubkey: &[u8]) -> Vec<u8> {
	match PublicKey::parse_slice(&pubkey, None) {
		Ok(p) => p
			.serialize_compressed()
			.to_vec(),
		_ => panic!("Invalid pubkey provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_pub_expand(pubkey: &[u8]) -> Vec<u8> {
	match PublicKey::parse_slice(&pubkey, None) {
		Ok(p) => p
			.serialize()
			.to_vec(),
		_ => panic!("Invalid pubkey provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_from_seed(seed: &[u8]) -> Vec<u8> {
	match SecretKey::parse_slice(seed) {
		Ok(s) => {
			let mut res = vec![];
			let pubkey = PublicKey::from_secret_key(&s);

			res.extend_from_slice(&s.serialize());
			res.extend_from_slice(&pubkey.serialize_compressed());

			res
		},
		_ => panic!("Invalid seed provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_recover(hash: &[u8], sig: &[u8], rec: u8) -> Vec<u8> {
	match (Message::parse_slice(hash), Signature::parse_standard_slice(sig), RecoveryId::parse(rec)) {
		(Ok(m), Ok(s), Ok(r)) =>
			match recover(&m, &s, &r) {
				Ok(k) => k
					.serialize_compressed()
					.to_vec(),
				_ => panic!("Invalid message provided.")
			},
		_ => panic!("Invalid recovery data provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_sign(hash: &[u8], seckey: &[u8]) -> Vec<u8> {
	match (Message::parse_slice(hash), SecretKey::parse_slice(seckey)) {
		(Ok(m), Ok(s)) => {
			let mut res = vec![];
			let (sig, rec) = sign(&m, &s);

			res.extend_from_slice(&sig.serialize());
			res.push(rec.into());

			res
		},
		_ => panic!("Invalid message or secret provided.")
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

	#[test]
	fn can_pub_compress_full() {
		let pubkey = hex!("04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af");
		let expected = hex!("03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077");
		let res = ext_secp_pub_compress(&pubkey);

		assert_eq!(res[..], expected[..]);
	}

	#[test]
	fn can_pub_expand_comp() {
		let pubkey = hex!("03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077");
		let expected = hex!("04b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb1307763fe926c273235fd979a134076d00fd1683cbd35868cb485d4a3a640e52184af");
		let res = ext_secp_pub_expand(&pubkey);

		assert_eq!(res[..], expected[..]);
	}

	#[test]
	fn can_recover() {
		let expected = hex!("028d13da15a02f3a70677339d51b14177ee9b49657662b35e56a9d9dee17db1d30");
		let sig = hex!("7505f2880114da51b3f5d535f8687953c0ab9af4ab81e592eaebebf53b728d2b6dfd9b5bcd70fee412b1f31360e7c2774009305cb84fc50c1d0ff8034dfa5fff");
    	let msg = hex!("a30b64ce1eedf409c8afb801d72c05234e64849ea538c15dd3c8cf4ffcf166c9");
		let res = ext_secp_recover(&msg, &sig, 0);

		assert_eq!(res[..], expected[..]);
	}

	#[test]
	fn can_sign() {
		// JS expectation - doesn't match?
		// let expected = hex!("df92f73d9f060cefacf187b5414491cb992998ace017fa48839b5cda3e264ba8c4efa521361678d9b8582744d77aa4b8d886d7380b7808a683174afad9c4700300");
		let expected = hex!("df92f73d9f060cefacf187b5414491cb992998ace017fa48839b5cda3e264ba83b105adec9e9872647a7d8bb28855b45e22805aea3d097953cbb1391f671d13e01");
		let seckey = hex!("4380de832af797688026ce24f85204d508243f201650c1a134929e5458b7fbae");
		let msg = hex!("68c731589a583d08b70861683b59ce3dd56284cb2f0da5b6cd83e6641dac3aab");
		let res = ext_secp_sign(&msg, &seckey);

		assert_eq!(res[..], expected[..]);
	}
}
