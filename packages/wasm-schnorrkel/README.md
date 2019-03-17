# @polkadot/wasm-schnorrkel

A fork of [@parity/schnorrkel-js](https://github.com/polkadot-js/schnorrkel-js/tree/b1a1bf25be7397d3c21bba5ddde14286a58b269c) that allows proper operation against all the environments that the `@polkadot/api` supports. Changes from the base repo -

- WASM initialisation is done async, via Promise (this allows for clear operation in webpack environments without additional workers)
- WASM outputs are optimised via `wasm-opt` from the [binaryen](https://github.com/WebAssembly/binaryen) project
- Output bundle is wrapped with camelCase names (not including the `__***` internal functions)
- Full named functions and parameter TypeScript definitions
- Requires for crypto is wrapped, removing "on-demand-require" warnings in webpack environment
- WASM output is done via a base-64 encoded string, supporting both Node.js and browser environments
- Extensive code cleanups and addition of functions required for all sr25519 operations
- Extended tests to cover Rust, wasm (via Node) and wasm (via jest), remove (here unused) www interfaces
- TextDecoder is polyfilled by using the version from `@polkadot/util` (consistent support, alos on React Native)
- Polyfill for crypto functions that are not available in some environments (e.g. Jest & React Native)

## development

1. Build can be done via `./build.sh`
2. Tests can be done via `./test.sh`

## future work

Support asm.js for environments (like React Native) that doesn't have WASM support. Initial attempts made at this, but not active.
