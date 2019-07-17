[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![travis](https://img.shields.io/travis/polkadot-js/wasm.svg?style=flat-square)](https://travis-ci.com/polkadot-js/wasm)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/wasm.svg?style=flat-square)](https://codeclimate.com/github/polkadot-js/wasm/maintainability)
[![greenkeeper](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)

# @polkadot/wasm

Various WASM wrappers around Rust crates

## overview

It is split up into a number of internal packages, namely utilities -

- [wasm-crypto](packages/wasm-crypto/) Various hashing functions, sr25519 & ed25519 crypto

These are split from the `polkadot-js/util` repo where it is heavily used as part of `@polkadot/util-crypto`. (There JS fallbacks are available for some interfaces, e.g. hashing, but for sr25519 WASM is the only interface). Since these don't undergo massive changes on a daily basis and has a build overhead (WASM compilation & optimisation), it is better managed as a seperate repo with a specific CI configuration.

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organise the code. As such, after cloning, its dependencies _should_ be installed via `yarn`, not via npm; the latter will result in broken dependencies.
