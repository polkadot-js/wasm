// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2019 Paritytech via https://github.com/paritytech/schnorrkel-js/
//
// Originally developed (as a fork) in https://github.com/polkadot-js/schnorrkel-js/
// which was adpated from the initial https://github.com/paritytech/schnorrkel-js/
// forked at commit eff430ddc3090f56317c80654208b8298ef7ab3f

use merlin::Transcript;
use schnorrkel::{signing_context, vrf::{VRFOutput, VRFProof}, PublicKey, SecretKey};
use wasm_bindgen::prelude::*;

/// Size of VRF output, bytes
pub const OUTPUT_SIZE: usize = 32;

/// Size of VRF proof, bytes
pub const PROOF_SIZE: usize = 64;

/// Size of VRF raw output, bytes
pub const RAW_OUTPUT_SIZE: usize = 16;

/// Size of VRF limit, bytes
pub const THRESHOLD_SIZE: usize = 16;

/// Size of the final full output
pub const RESULT_SIZE: usize = OUTPUT_SIZE + PROOF_SIZE;

pub fn new_transcript(extra: &[u8]) -> Transcript {
	let mut transcript = Transcript::new(b"VRF");

	// if is important that we don't append when empty, since the
	// append in merging encodes length information
	if extra.len() > 0 {
		transcript.append_message(b"", extra);
	}

	transcript
}

// We don't use the non-extra sign and verify internally  since in sr25519 they only wrap -
//
// https://github.com/w3f/schnorrkel/blob/8fa2ad3e9fbf0b652c724df6a87a4b3c5500f759/src/vrf.rs#L660

/// Run a Random Verifiable Function (VRF) on one single input
/// (message) transcript, and an extra message transcript,
/// producing the output signature and corresponding short proof.
///
/// * secret: UIntArray with 64 element
/// * context: Arbitrary length UIntArray
/// * message: Arbitrary length UIntArray
/// * extra: Arbitrary length UIntArray
///
/// * returned vector is the 32-byte output (signature) and 64-byte proof.
#[wasm_bindgen]
pub fn ext_vrf_sign(secret: &[u8], ctx: &[u8], msg: &[u8], extra: &[u8]) -> Vec<u8> {
	match SecretKey::from_ed25519_bytes(secret) {
		Ok(s) => {
			let mut res: [u8; RESULT_SIZE] = [0u8; RESULT_SIZE];
			let (io, proof, _) = s
				.to_keypair()
				.vrf_sign_extra(signing_context(ctx).bytes(msg), new_transcript(extra));

			res[..OUTPUT_SIZE].copy_from_slice(io.as_output_bytes());
			res[OUTPUT_SIZE..].copy_from_slice(&proof.to_bytes());

			res.to_vec()
		},
		_ => panic!("Invalid secret provided.")
	}
}

/// Verify VRF proof for one single input transcript, and an extra message transcript,
/// and corresponding output.
///
/// * pubkey: UIntArray with 32 element
/// * context: Arbitrary length UIntArray
/// * message: Arbitrary length UIntArray
/// * extra: Arbitrary length UIntArray
/// * out_and_proof: 96-byte output & proof array from the ext_sign function.
#[wasm_bindgen]
pub fn ext_vrf_verify(pubkey: &[u8], ctx: &[u8], msg: &[u8], extra: &[u8], out: &[u8]) -> bool {
	match (PublicKey::from_bytes(pubkey), VRFOutput::from_bytes(&out[..OUTPUT_SIZE]), VRFProof::from_bytes(&out[OUTPUT_SIZE..RESULT_SIZE])) {
		(Ok(k), Ok(o), Ok(p)) => k
			.vrf_verify_extra(signing_context(ctx).bytes(msg), &o, &p, new_transcript(extra))
			.is_ok(),
		_ => false,
	}
}

#[cfg(test)]
pub mod tests {
	extern crate rand;
	extern crate schnorrkel;

	use super::*;
	use crate::sr25519::ext_sr_from_seed;
	use schnorrkel::{KEYPAIR_LENGTH, SECRET_KEY_LENGTH};

	fn generate_random_seed() -> Vec<u8> {
		(0..32).map(|_| rand::random::<u8>()).collect()
	}

	#[test]
	fn sign_extra_and_verify() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let context = b"my VRF context";
		let message = b"this is a message";
		let extra = b"this is an extra";

		// Perform multiple sign_extra calls w/ same context, message, extra args
		let out1 = ext_vrf_sign(private, context, message, extra);
		let out2 = ext_vrf_sign(private, context, message, extra);

		// Basic size checks
		assert!(out1.len() == RESULT_SIZE);
		assert!(out2.len() == RESULT_SIZE);

		// Given the same context, message & extra, output should be deterministic
		assert_eq!(&out1[..OUTPUT_SIZE], &out2[..OUTPUT_SIZE]);

		// But proof is non-deterministic
		assert_ne!(&out1[OUTPUT_SIZE..], &out2[OUTPUT_SIZE..]);

		// VRF outputs can verified w/ original context, message & extra args
		assert!(ext_vrf_verify(
			public,
			context,
			message,
			extra,
			&out1
		));
		assert!(ext_vrf_verify(
			public,
			context,
			message,
			extra,
			&out2
		));
	}
}
