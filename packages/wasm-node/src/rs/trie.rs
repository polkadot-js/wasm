// Copyright 2019-2022 @polkadot/wasm-node authors & contributors
// SPDX-License-Identifier: Apache-2.0

use reference_trie::ReferenceTrieStream;
use wasm_bindgen::prelude::*;

pub mod blake2 {
	use crate::hash::H256;
	use hash256_std_hasher::Hash256StdHasher;
	use hash_db::Hasher;
	use blake2_rfc::blake2b::blake2b;

	pub struct Blake2Hasher;

	impl Hasher for Blake2Hasher {
		type Out = H256;
		type StdHasher = Hash256StdHasher;
		const LENGTH: usize = 32;

		fn hash(x: &[u8]) -> Self::Out {
			blake2b(LENGTH, &[], x).into()
		}
	}
}

pub mod keccak {
	use crate::hash::H256;
	use hash256_std_hasher::Hash256StdHasher;
	use hash_db::Hasher;
	use tiny_keccak::Keccak;

	#[derive(Debug)]
	pub struct KeccakHasher;

	impl Hasher for KeccakHasher {
		type Out = H256;
		type StdHasher = Hash256StdHasher;
		const LENGTH: usize = 32;

		fn hash(x: &[u8]) -> Self::Out {
			let mut keccak = Keccak::v256();
			let mut res = [0u8; 32];

			keccak.update(data);
			keccak.finalize(&mut res);

			res.into()
		}
	}
}

#[wasm_bindgen]
pub fn ext_trie_root_ref_keccak(phrase: &([u8], [u8])) -> bool {
	trie_root::<KeccakHasher, ReferenceTrieStream, _, _, _>(v)
}

#[cfg(test)]
pub mod tests {
	use super::*;
	use hex_literal::hex;
	use trie_root::trie_root;

	#[test]
	fn can_trie_root_ref_keccak() {
		let v = vec![
			("doe", "reindeer"),
			("dog", "puppy"),
			("dogglesworth", "cat"),
		];
		let root = hex!["0807d5393ae7f349481063ebb5dbaf6bda58db282a385ca97f37dccba717cb79"];

		assert_eq!(ext_trie_root_ref_keccak(v), root);
	}
}
