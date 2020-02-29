# 1.2.1 Feb 29, 2020

- Adjust build process for smaller wasm bundle outputs (~50K dropped from base bundle)
- Unpin nightly from nightly-2020-02-17 version
- Swap to yarn 2 and add support for use by yarn 2 projects

# 1.1.1 Feb 24, 2020

- **Important** The sr25519 interface dropped the use of `verify_simple_preaudit_deprecated` for signature verification, instead it now uses `verify_simple`. Only schnorrkel 0.8+ signatures will now pass verification. This is a follow-up of the 0.1 signing support that was dropped in a previous version.
- Rework schnorrkel signatures test vectors based on the above change (Rust, WASM and ASM.js tests)
- Rust nightly pinned to last-known-working 2020-02-17 on CI (compiler issues, should to be reverted in a future release)

# 1.0.1 Feb 15, 2020

- No functionality changes from 0.20.1. The interfaces here are stable in the current iteration.

# 0.20.1 Jan 30, 2020

- Pull in schnorrkel 0.8.5 for full Substrate 2.x compatibility

# 0.14.1 Sep 09, 2019

- No functionality changes at all, everything done is "under the hood" to give the codebase better maintainability

# 0.13.1 Jul 20, 2019

- Added an asm.js fallback which is active for React Native via the `"react-native"` entry in `package.json`. Ensure that you run the build step with the `NODE_OPTIONS=--max_old_space_size=8192` flags, since the asm.js bundle is large. (For RN the full command would therefore be `NODE_OPTIONS=--max_old_space_size=8192 npm start`)

# 0.12.1 Jul 17, 2019

- Remove deprecated `@polkadot/wasm-schnorrkel` & `@polkadot/wasm-dalek-ed25519` source (all combined in `@polkadot/wasm-crypto`, was kept for historical purposes)
- Security dependency bumps
- Updated Rust `hex-literal` for recent versions of the compiler (used in tests only)

# 0.11.1 May 31, 2019

- Security dependency bumps

# 0.10.1 May 09, 2019

- w3f/schnorrkel updated to 0.1.1 as per substrate
- Added known subkey signature test (Rust & JS)

# 0.9.1 Apr 29, 2019

- Dependency bumps

# 0.8.1 Mar 31, 2019

- Pull ed25519 & sr25519 into `@polkadot/wasm-crypto` as well (smaller final size)
- Disable build/publish of `wasm-dalek-ed25519` & `wasm-schnorrkel`
- Improve error messaging, instead of `__wasm_malloc of null`

# 0.7.1 Mar 30, 2019

- Fix build scripts to properly attach errors in the log (dropped in 0.6.1)

# 0.6.1 Mar 27, 2019

- Log init errors for both non-WebAssembly usage as well as WebAssembly errors

# 0.5.1 Mar 23, 2019

- Add password argument to bip39ToSeed

# 0.4.1 Mar 23, 2019

- Add bip39ToSeed

# 0.3.1 Mar 23, 2019

- Add wasm-dalek-ed25519 for all used crypto there
- Add keccak256
- Try secp256k1 (bloating code, not used atm)

# 0.2.1 Mar 20, 2019

- Add basic crypto functions, creation of wasm-crypto package
- blake2, bip39, sha2, xxhash

# 0.1.1 Mar 18, 2019

- Initial release
