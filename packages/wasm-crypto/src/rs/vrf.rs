// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
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
pub const VRF_OUTPUT_SIZE: usize = 32;

/// Size of VRF proof, bytes
pub const VRF_PROOF_SIZE: usize = 64;

/// Size of VRF raw output, bytes
pub const VRF_RAW_OUTPUT_SIZE: usize = 16;

/// Size of VRF limit, bytes
pub const VRF_THRESHOLD_SIZE: usize = 16;

/// Size of the final full output
pub const VRF_RESULT_SIZE: usize = VRF_OUTPUT_SIZE + VRF_PROOF_SIZE;

pub fn create_transcript(extra: &[u8]) -> Transcript {
	let mut transcript = Transcript::new(b"VRF");

	// if is important that we don't append when empty, since the
	// append in merging encodes length information
	if extra.len() > 0 {
		transcript.append_message(b"", extra);
	}

	transcript
}

// We don't use the non-extra vrf_sign and vrf_verify internally  since in sr25519 they only wrap -
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
pub fn ext_vrf_sign(secret: &[u8], context: &[u8], message: &[u8], extra: &[u8]) -> Vec<u8> {
	let (io, proof, _) = SecretKey::from_ed25519_bytes(secret)
		.unwrap()
		.to_keypair()
		.vrf_sign_extra(
			signing_context(context).bytes(message),
			create_transcript(extra)
		);
	let mut result: [u8; VRF_RESULT_SIZE] = [0u8; VRF_RESULT_SIZE];

	result[..VRF_OUTPUT_SIZE].copy_from_slice(io.as_output_bytes());
	result[VRF_OUTPUT_SIZE..].copy_from_slice(&proof.to_bytes());

	result.to_vec()
}

/// Verify VRF proof for one single input transcript, and an extra message transcript,
/// and corresponding output.
///
/// * pubkey: UIntArray with 32 element
/// * context: Arbitrary length UIntArray
/// * message: Arbitrary length UIntArray
/// * extra: Arbitrary length UIntArray
/// * out_and_proof: 96-byte output & proof array from the ext_vrf_sign function.
#[wasm_bindgen]
pub fn ext_vrf_verify(pubkey: &[u8], context: &[u8], message: &[u8], extra: &[u8], out_and_proof: &[u8]) -> bool {
	match (
		PublicKey::from_bytes(pubkey),
		VRFOutput::from_bytes(&out_and_proof[..VRF_OUTPUT_SIZE]),
		VRFProof::from_bytes(&out_and_proof[VRF_OUTPUT_SIZE..VRF_RESULT_SIZE])
	) {
		(Ok(public), Ok(out), Ok(proof)) =>
			public
				.vrf_verify_extra(
					signing_context(context).bytes(message),
					&out,
					&proof,
					create_transcript(extra)
				)
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
	fn vrf_sign_extra_and_verify() {
		let seed = generate_random_seed();
		let keypair = ext_sr_from_seed(seed.as_slice());
		let private = &keypair[0..SECRET_KEY_LENGTH];
		let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
		let context = b"my VRF context";
		let message = b"this is a message";
		let extra = b"this is an extra";

		// Perform multiple vrf_sign_extra calls w/ same context, message, extra args
		let out_and_proof1 = ext_vrf_sign(private, context, message, extra);
		let out_and_proof2 = ext_vrf_sign(private, context, message, extra);

		// Basic size checks
		assert!(out_and_proof1.len() == VRF_RESULT_SIZE);
		assert!(out_and_proof2.len() == VRF_RESULT_SIZE);

		// Given the same context, message & extra, output should be deterministic
		let out1 = &out_and_proof1[..VRF_OUTPUT_SIZE];
		let out2 = &out_and_proof2[..VRF_OUTPUT_SIZE];
		assert_eq!(out1, out2);

		// But proof is non-deterministic
		let proof1 = &out_and_proof1[VRF_OUTPUT_SIZE..];
		let proof2 = &out_and_proof2[VRF_OUTPUT_SIZE..];
		assert_ne!(proof1, proof2);

		// VRF outputs can verified w/ original context, message & extra args
		assert!(ext_vrf_verify(
			public,
			context,
			message,
			extra,
			&out_and_proof1
		));
		assert!(ext_vrf_verify(
			public,
			context,
			message,
			extra,
			&out_and_proof2
		));
	}
}
