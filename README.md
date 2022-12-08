# @polkadot/wasm

Various WASM wrappers around Rust crates

## overview

It is split up into a number of internal packages, namely utilities -

- [wasm-crypto](packages/wasm-crypto/) Various hashing functions, sr25519 & ed25519 crypto

These are split from the `polkadot-js/util` repo where it is heavily used as part of `@polkadot/util-crypto`. (There JS fallbacks are available for some interfaces, e.g. hashing, but for sr25519 WASM is the only interface). Since these don't undergo massive changes on a daily basis and has a build overhead (WASM compilation & optimisation), it is better managed as a seperate repo with a specific CI configuration.

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organise the code. As such, after cloning, its dependencies _should_ be installed via `yarn`, not via npm; the latter will result in broken dependencies.
