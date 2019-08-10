[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=for-the-badge)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?label=&logo=apache&style=for-the-badge)
[![npm](https://img.shields.io/npm/v/@polkadot/wasm-crypto?label=&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@polkadot/wasm-crypto)
[![beta](https://img.shields.io/npm/v/@polkadot/wasm-crypto/beta?label=&logo=npm&&style=for-the-badge)](https://www.npmjs.com/package/@polkadot/wasm-crypto)
[![travis](https://img.shields.io/travis/polkadot-js/wasm?label=&logo=travis&style=for-the-badge)](https://travis-ci.com/polkadot-js/wasm)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/wasm?label=&logo=code-climate&style=for-the-badge)](https://codeclimate.com/github/polkadot-js/wasm/maintainability)
[![greenkeeper](https://img.shields.io/badge/greenkeeper-enabled-brightgreen?label=&logo=greenkeeper&style=for-the-badge)](https://greenkeeper.io/)

# @polkadot/wasm

Various WASM wrappers around Rust crates

## overview

It is split up into a number of internal packages, namely utilities -

- [wasm-crypto](packages/wasm-crypto/) Various hashing functions, sr25519 & ed25519 crypto

These are split from the `polkadot-js/util` repo where it is heavily used as part of `@polkadot/util-crypto`. (There JS fallbacks are available for some interfaces, e.g. hashing, but for sr25519 WASM is the only interface). Since these don't undergo massive changes on a daily basis and has a build overhead (WASM compilation & optimisation), it is better managed as a seperate repo with a specific CI configuration.

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organise the code. As such, after cloning, its dependencies _should_ be installed via `yarn`, not via npm; the latter will result in broken dependencies.
