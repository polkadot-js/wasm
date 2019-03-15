# @polkadot/schnorrkel-js

A fork of [@parity/schnorrkel-js](https://github.com/paritytech/schnorrkel-js) that allows proper operation against all the environments that the `@polkadot/api` supports. Changes from the base repo -

- WASM initialisation is done async, via Promise (this allows for clear operation in webpack environments without additional workers)
- TextDecoder is polyfilled by using the version from `@polkadot/util` (consistent support, even on mobile)
- WASM outputs are optimised via `wasm-opt` from the [binayen](https://github.com/WebAssembly/binaryen) project
- Output bundle is wrapped with camelCase names (not including the `__***` internal functions) and includes full named TypeScript definitions
- Requires for crypto is wrapped, allowing no "on-demand" require warnings in webpack environments
- WASM output is done via a base-64 encoded string, supporting both Node.js and browser environments
- Attempt at asm.js support (not active, commented in pre-publish.sh)

# Schnorrkel-js

Provides a Javascript wrapper for some of the high-level functionality provided by [schnorrkel](https://github.com/w3f/schnorrkel).


# How to Use

### Install

```
npm install @parity/schnorrkel-js
```

### API

The functions exposed via wasm are explained [here(rust)]() or [here(js)]. You can clone the repo and run the following to see the details:

```
cargo docs --open
```

# Build

Current experimental setup is created using [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/) and [`webpack/node/npm`](https://www.npmjs.com/get-npm). Make sure to have both of them, alongside the latest **nightly** version of Rust installed.

In the root of the project run:

```bash
wasm-pack build --target browser
```

A directory named `pkg` should be created. Then:

```bash
cd pkg
npm link
```

This creates a local binding to npm, instructing it to use this folder whenever `schnorrkel-js` was imported as an npm module using `require()` or `import`.

Next, create head to the provided `www` folder (experimental test folder created via npm: `npm init wasm-app www`) and:

```
# Run just once
npm link schnorrkel-js
npm install
npm run start
```

The current `index.js` does absolutely nothing. It just binds the compiled wasm blob as a parsed object to the `window` object so that it can be easily tested in the console.

```javascript
import * as schnorrkel from 'schnorrkel-js'

window.schnorrkel = schnorrkel
```

To make any further changes, given that the linking with `npm link` is correct, just re-compile with `wasm-pack build` and let the `npm run start` be running in a separate process. It should automatically reload.

The default webpage


# Tests

Run the tests in Node.Js environment via

```
wasm-pack test --node
```

or to run them directly in the browser:

add this line to the tests module in lib.rs

```
wasm_bindgen_test_configure!(run_in_browser);
```

Then

```
wasm-pack test --chrome
```
