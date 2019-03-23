[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![travis](https://img.shields.io/travis/polkadot-js/wasm.svg?style=flat-square)](https://travis-ci.com/polkadot-js/wasm)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/wasm.svg?style=flat-square)](https://codeclimate.com/github/polkadot-js/wasm/maintainability)
[![coverage](https://img.shields.io/coveralls/polkadot-js/wasm.svg?style=flat-square)](https://coveralls.io/github/polkadot-js/wasm?branch=master)
[![greenkeeper](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)

# @polkadot/wasm

Various WASM wrappers around Rust crates

## overview

It is split up into a number of internal packages, namely utilities -

- [wasm-crypto](packages/wasm-crypto/) Various hashing functions
- [wasm-dalek-ed25519](packages/wasm-dalek-ed25519/) ed25519
- [wasm-schnorrkel](packages/wasm-schnorrkel/) sr25519

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organise the code. As such, after cloning, its dependencies _should_ be installed via `yarn`, not via npm; the latter will result in broken dependencies.
