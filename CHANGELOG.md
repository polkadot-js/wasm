# 0.13.x

- Added a build-time optional asm.js fallback for the WASM libraries when WebAssembly is not available, i.e. on React Native. To enable this, add `CRYPTO_ASM=1` to your environment config. (i.e. `CRYPTO_ASM=1 yarn build`)

# 0.12.1

- Remove deprecated `@polkadot/wasm-schnorrkel` & `@polkadot/wasm-dalek-ed25519` source (all combined in `@polkadot/wasm-crypto`, was kept for historical purposes)
- Security dependency bumps
- Updated Rust `hex-literal` for recent versions of the compiler (used in tests only)

# 0.11.1

- Security dependency bumps

# 0.10.1

- w3f/schnorrkel updated to 0.1.1 as per substrate
- Added known subkey signature test (Rust & JS)

# 0.9.1

- Dependency bumps

# 0.8.1

- Pull ed25519 & sr25519 into `@polkadot/wasm-crypto` as well (smaller final size)
- Disable build/publish of `wasm-dalek-ed25519` & `wasm-schnorrkel`
- Improve error messaging, instead of `__wasm_malloc of null`

# 0.7.1

- Fix build scripts to properly attach errors in the log (dropped in 0.6.1)

# 0.6.1

- Log init errors for both non-WebAssembly usage as well as WebAssembly errors

# 0.5.1

- Add password argument to bip39ToSeed

# 0.4.1

- Add bip39ToSeed

# 0.3.1

- Add wasm-dalek-ed25519 for all used crypto there
- Add keccak256
- Try secp256k1 (bloating code, not used atm)

# 0.2.1

- Add basic crypto functions, creation of wasm-crypto package
- blake2, bip39, sha2, xxhash

# 0.1.1

- Initial release
