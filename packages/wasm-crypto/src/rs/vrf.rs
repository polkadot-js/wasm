// Copyright 2019-2021 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2019 Paritytech via https://github.com/paritytech/schnorrkel-js/
//
// Originally developed (as a fork) in https://github.com/polkadot-js/schnorrkel-js/
// which was adpated from the initial https://github.com/paritytech/schnorrkel-js/
// forked at commit eff430ddc3090f56317c80654208b8298ef7ab3f

use merlin::Transcript;
use schnorrkel::{signing_context, SecretKey};
use wasm_bindgen::prelude::*;

/// Size of VRF output, bytes
pub const VRF_OUTPUT_SIZE: usize = 32;

/// Size of VRF proof, bytes
pub const VRF_PROOF_SIZE: usize = 64;

/// Size of VRF raw output, bytes
pub const VRF_RAW_OUTPUT_SIZE: usize = 16;

/// Size of VRF limit, bytes
pub const VRF_THRESHOLD_SIZE: usize = 16;

/// Run VRF on one single input transcript and an extra message transcript,
/// producing the output and corresponding short proof.
#[wasm_bindgen]
pub fn ext_vrf_sign_extra(secret: &[u8], context: &[u8], message: &[u8], extra: &[u8]) -> Vec<u8> {
    let keypair = SecretKey::from_ed25519_bytes(secret).unwrap().to_keypair();
    let mut transcript = Transcript::new(b"VRF");
    transcript.append_message(b"", extra);
    let (io, proof, _) =
        keypair.vrf_sign_extra(signing_context(context).bytes(message), transcript);

    let mut result: [u8; VRF_OUTPUT_SIZE + VRF_PROOF_SIZE] =
        [0u8; VRF_OUTPUT_SIZE + VRF_PROOF_SIZE];
    result[..VRF_OUTPUT_SIZE].copy_from_slice(io.as_output_bytes());
    result[VRF_OUTPUT_SIZE..].copy_from_slice(&proof.to_bytes());
    result.to_vec()
}

#[cfg(test)]
pub mod tests {
    extern crate rand;
    extern crate schnorrkel;

    use super::*;
    use crate::sr25519::ext_sr_from_seed;
    use schnorrkel::{
        vrf::{VRFOutput, VRFProof},
        PublicKey, KEYPAIR_LENGTH, SECRET_KEY_LENGTH,
    };

    fn generate_random_seed() -> Vec<u8> {
        (0..32).map(|_| rand::random::<u8>()).collect()
    }

    #[test]
    fn vrf_sign_extra_is_deterministic() {
        let seed = generate_random_seed();
        let keypair = ext_sr_from_seed(seed.as_slice());
        let private = &keypair[0..SECRET_KEY_LENGTH];
        let public = &keypair[SECRET_KEY_LENGTH..KEYPAIR_LENGTH];
        let context = b"my VRF context";
        let message = b"this is a message";
        let extra = b"this is an extra";

        // Perform multiple vrf_sign_extra calls w/ same context, message, extra args
        let out_and_proof1 = ext_vrf_sign_extra(private, context, message, extra);
        let out_and_proof2 = ext_vrf_sign_extra(private, context, message, extra);

        // Basic size checks
        assert!(out_and_proof1.len() == VRF_OUTPUT_SIZE + VRF_PROOF_SIZE);
        assert!(out_and_proof2.len() == VRF_OUTPUT_SIZE + VRF_PROOF_SIZE);

        // Given the same context, message & extra, output should be deterministic
        let out1 = &out_and_proof1[..VRF_OUTPUT_SIZE];
        let out2 = &out_and_proof2[..VRF_OUTPUT_SIZE];
        assert_eq!(out1, out2);

        // But proof is non-deterministic
        let proof1 = &out_and_proof1[VRF_OUTPUT_SIZE..];
        let proof2 = &out_and_proof2[VRF_OUTPUT_SIZE..];
        assert_ne!(proof1, proof2);

        // VRF outputs can verified w/ original context, message & extra args
        let pubkey = PublicKey::from_bytes(public).unwrap();
        let mut transcript = Transcript::new(b"VRF");
        transcript.append_message(b"", extra);

        let result1 = pubkey.vrf_verify_extra(
            signing_context(context).bytes(message),
            &VRFOutput::from_bytes(out1).unwrap(),
            &VRFProof::from_bytes(proof1).unwrap(),
            transcript.clone(),
        );
        assert!(result1.is_ok());

        let result2 = pubkey.vrf_verify_extra(
            signing_context(context).bytes(message),
            &VRFOutput::from_bytes(out2).unwrap(),
            &VRFProof::from_bytes(proof2).unwrap(),
            transcript,
        );
        assert!(result2.is_ok());
    }
}
