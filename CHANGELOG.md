# CHANGELOG

## 2.0.0-x

- **Breaking change** `crypto.getRandomValues` is not a polyfill anymore. Generally in libraries these should always be supplied by the user to ensure control and non-conflicts. This could affect environments such as Jest, for those see https://stackoverflow.com/questions/52612122/how-to-use-jest-to-test-functions-using-crypto-or-window-mscrypto. On React Native, ensure you do have the required crypto polyfills, browser and Node.js is not affected.

Changes:

- Rework generation of WASM interfaces (proper cross-platform support)
- Remove application of `getRandomValues` polyfill. Generally these should be supplied by the user.
- Build via xargo for panic abort (Pinned nightly)


## 1.4.1 Aug 27, 2020

Changes:

- Re-add the BTC/ETH compatible `bip39ToSeed` dropped in the previous version (ETH-compatible pairs)


## 1.3.1 Aug 9, 2020

Changes:

- Add `scrypt` function for KDF generation
- Remove `bip39ToSeed`, we only use the `bip39ToMiniSecret` variant in Substrate
- Update ed25519-dalek to 1.0.0-pre.4
- Rework generation based on latest wasm-pack generator


## 1.2.1 Feb 29, 2020

Changes:

- Adjust build process for smaller wasm bundle outputs (~50K dropped from base bundle)
- Unpin nightly from nightly-2020-02-17 version
- Swap to yarn 2 and add support for use by yarn 2 projects


## 1.1.1 Feb 24, 2020

- **Important** The sr25519 interface dropped the use of `verify_simple_preaudit_deprecated` for signature verification, instead it now uses `verify_simple`. Only schnorrkel 0.8+ signatures will now pass verification. This is a follow-up of the 0.1 signing support that was dropped in a previous version.

Changes:

- Rework schnorrkel signatures test vectors based on the above change (Rust, WASM and ASM.js tests)
- Rust nightly pinned to last-known-working 2020-02-17 on CI (compiler issues, should to be reverted in a future release)


## 1.0.1 Feb 15, 2020

Changes:

- No functionality changes from 0.20.1. The interfaces here are stable in the current iteration.


## 0.20.1 Jan 30, 2020

Changes:

- Pull in schnorrkel 0.8.5 for full Substrate 2.x compatibility


## 0.14.1 Sep 09, 2019

Changes:

- No functionality changes at all, everything done is "under the hood" to give the codebase better maintainability


## 0.13.1 Jul 20, 2019

Changes:

- Added an asm.js fallback which is active for React Native via the `"react-native"` entry in `package.json`. Ensure that you run the build step with the `NODE_OPTIONS=--max_old_space_size=8192` flags, since the asm.js bundle is large. (For RN the full command would therefore be `NODE_OPTIONS=--max_old_space_size=8192 npm start`)


## 0.12.1 Jul 17, 2019

Changes:

- Remove deprecated `@polkadot/wasm-schnorrkel` & `@polkadot/wasm-dalek-ed25519` source (all combined in `@polkadot/wasm-crypto`, was kept for historical purposes)
- Security dependency bumps
- Updated Rust `hex-literal` for recent versions of the compiler (used in tests only)


## 0.11.1 May 31, 2019

Changes:

- Security dependency bumps


## 0.10.1 May 09, 2019

Changes:

- w3f/schnorrkel updated to 0.1.1 as per substrate
- Added known subkey signature test (Rust & JS)


## 0.9.1 Apr 29, 2019

Changes:

- Dependency bumps


## 0.8.1 Mar 31, 2019

Changes:

- Pull ed25519 & sr25519 into `@polkadot/wasm-crypto` as well (smaller final size)
- Disable build/publish of `wasm-dalek-ed25519` & `wasm-schnorrkel`
- Improve error messaging, instead of `__wasm_malloc of null`


## 0.7.1 Mar 30, 2019

Changes:

- Fix build scripts to properly attach errors in the log (dropped in 0.6.1)


## 0.6.1 Mar 27, 2019

Changes:

- Log init errors for both non-WebAssembly usage as well as WebAssembly errors


## 0.5.1 Mar 23, 2019

Changes:

- Add password argument to bip39ToSeed


## 0.4.1 Mar 23, 2019

Changes:

- Add bip39ToSeed


## 0.3.1 Mar 23, 2019

Changes:

- Add wasm-dalek-ed25519 for all used crypto there
- Add keccak256
- Try secp256k1 (bloating code, not used atm)


## 0.2.1 Mar 20, 2019

Changes:

- Add basic crypto functions, creation of wasm-crypto package
- blake2, bip39, sha2, xxhash


## 0.1.1 Mar 18, 2019

Changes:

- Initial release
