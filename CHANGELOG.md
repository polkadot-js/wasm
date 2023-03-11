# CHANGELOG

## 7.0.3 Mar 11, 2023

Changes:

- Use consistent `.js` imports in source files (TS moduleResolution)


## 7.0.2 Mar 4, 2023

Changes:

- Update to latest `@polkadot/dev` (w/ tsc jsx detection output changes)


## 7.0.1 Mar 4, 2023

Changes:

- Swap TS -> JS compiler to use tsc (from babel)
- Adjust all tests to use `node:test` runner (ESM & CJS variants)


## 6.4.1 Dec 3, 2022

Changes:

- Add `/*#__PURE__*/` annotations for specific `export const something = someFunction(...)`


## 6.3.1 Jul 21, 2022

Changes:

- Optimize packed WASM base64 decoding loop
- Adjust test environment (no duplication)
- Adjust CI check steps, align with other org repos
- Remove unneeded `import_map.in.json` for Deno tests


## 6.2.3 Jul 7, 2022

Changes:

- Optimize WASM init with pre-allocated buffers
- Additional platform-specific tests


## 6.2.2 Jul 4, 2022

Changes:

- Protect against potential low-level double-sign leak in dalek-ed25519 (Don't use provided input pubKey, see https://github.com/MystenLabs/ed25519-unsafe-libs)


## 6.2.1 Jul 1, 2022

Changes:

- Add missing `peerDependencies` to `wasm-crypto` (`bridge` requirement)
- Adjust `WebAssembly.{Memory, ModuleImports}` usage to cater for non-dom TS


## 6.1.5 Jun 23, 2022

Changes:

- Adjust build outputs for Deno targets


## 6.1.4 Jun 22, 2022

Changes:

- Adjust build outputs for Deno targets


## 6.1.3 Jun 21, 2022

Changes:

- Fix bundle publish (from dev bump)


## 6.1.2 Jun 21, 2022

Changes:

- Adjust assert usage in all internal non-test code
- Additional comments where missing


## 6.1.1 May 13, 2022

Changes:

- Adjust init, allow RN with default ASM.js-only fallback
- Split `wasm-{bridge, util}` packages for internal re-use


## 6.0.1 Apr 9, 2022

- **Breaking change** In this major version the commonjs outputs are moved to a sub-folder. Since the `export` map and `main` field in `package.json` does reflect this change, there should be no usage changes. However the packages here will all need to be on the same version for internal linkage.

Changes:

- Update ed25519 secret key format return description
- Output commonjs files under the `cjs/**` root


## 5.1.1 Mar 27, 2022

Changes:

- Swap from `libsecp256k1` to `secp256k1` (this aligns with the Substrate use)
- Adjust `wasm-crypto/init*` to also export `initWasm(): Promise<void>` (optional manual init)
- Allow for `wasm-crypto/initNone` with no defined Wasm or Asm interfaces
- Fix initialization on React Native with only ASM


## 5.0.1 Mar 19, 2022

- **Breaking change** For users of React Native, you are now required to add `import '@polkadot/wasm-crypto/initOnlyAsm'` at your project top-level to ensure that asm.js is initialized. (Or alternatively `import '@polkadot/wasm-crypto/initWasmAsm'` to future-proof when WASM does become available)
- **Breaking change** For users who used to map the `data` and `empty` of the internal `wasm-crypto-{wasm, asmjs}` packages in their bundlers, swap to one of the `@polkadot/wasm-crypto/init*` top-level imports to set the type of interfaces you would prefer. A full writeup of the rationale and other options can be found [in the FAQ](https://polkadot.js.org/docs/util-crypto/FAQ#i-dont-have-wasm-available-in-my-environment)

Changes:

- Add (optional) `@polkadot/wasm-crypto/init{OnlyAsm, OnlyWasm, WasmAsm}` to allow specific interface types
- Add work-around for lazy secp256k1 init in asm.js environments
- Optimize asm.js output size
- Use latest `wasm-bindgen`, `binaryen` & `wabt` packages in build
- Additional workaround for Vite bundling


## 4.6.1 Mar 12, 2022

Changes:

- Adjust ed25519 internals, consistency in code
- Ensure package path is available under ESM & CJS
- JS wrapped bytes interoperability test
- Adjust for bundlers where `import.meta.url` is undefined


## 4.5.1 Dec 3, 2021

Changes:

- Add `secp256k1{Compress, Expand, Recover, Sign}` functions
- Remove all occurences of `.unwrap()` (match everywhere)
- Adjust and optimize WASM function JS interface construction
- Simplify base64 bytes decoding on construction


## 4.4.1 Nov 22, 2021

Changes:

- Add `hmacSha256` & `hmacSha512` functions


## 4.3.1 Nov 19, 2021

Contributed:

- Updated package.json to include repo (Thanks to https://github.com/v-zhzhou)

Changes:

- Add `keccak512` function
- Add `sha256` function


## 4.2.1 Aug 28, 2021

Contributed:

- Add sr25519 agreement external (Thanks to https://github.com/shelvenzhou)

Changes:

- Adjust tests to align with JS coding standards
- Allow for optional build with Rust stable bootstrap


## 4.1.2 Jul 9, 2021

Changes:

- Bump `@polkadot/dev` to allow for bundles with new-format


## 4.1.1 Jul 7, 2021

Changes:

- Add an explicit `engines` field to `package.json`
- Allow building as a completely stand-alone browser bundle (experimental)


## 4.0.2 Mar 5, 2021

Changes:

- Add import indirection for both CJS & ESM (where generated source file is commonjs)


## 4.0.1 Mar 4, 2021

**Important** In the 4.0 version the default package type has been changed to ESM modules by default. This should not affect usage, however since the output formats changed, a new major version is required.

Changes:

- Build to ESM by default (with cjs versions via export map)


## 3.2.4 Feb 24, 2021

Changes:

- Cleanup implicit dependencies, perform base64 decoding using base64-js


## 3.2.3 Feb 16, 2021

Changes:

- Change package detect import to use `.js` source, not `.json`


## 3.2.2 Jan 24, 2021

Changes:

- Remove `module` field in `package.json`


## 3.2.1 Jan 22, 2021

Contributed:

- Expose sr25519 `ext_vrf_{sign, verify}` methods (Thanks to https://github.com/stiiifff)

Changes:

- Add explicit `.editorconfig` for Rust sources
- Remove unused code bundles (`vrf_{sign,verify}_extra`, `secp256k1` with tests)
- Test run wrapper cleanups


## 3.1.1 Dec 19, 2020

Changes:

- Single-instance package detection
- Adjust WASM inflate with localized methods


## 3.0.1 Dec 13, 2020

**Important** This assumes `@polkadot/util` 5+ peerDependencies
**Important** While this package contains no external interface changes, it doe now compile and ship both cjs and esm modules. This means that modern bundlers will have more information for tree-shaking available. Additionally when using Node with `.mjs` extensions, the esm version imports will be used on recent Node versions. Adding an export map, as here, may have some impacts so a major semver bump is advised. There may be (small) dragons hiding in the dark corners...

Changes:

- Build and expose both cjs and esm via exports map
- Split wasm and asmjs files into the `@polkadot/wasm-crypto-{wasm,asmjs}` packages
- Add fflate WASM compression, with 180K raw savings (37K over-the-wire)
- Convert the package to full TypeScript sources


## 2.0.1 Nov 8, 2020

Changes:

- Rework generation of WASM interfaces (proper cross-platform JS support)
- Remove explicit `crypto` dependency, this is now applied by `@polkadot/x-randomvalues`
- Build via xargo for panic abort, an overall small sizes without stack (Pinned nightly)
- Move Rust library sources in to `rs/` subfolder


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
