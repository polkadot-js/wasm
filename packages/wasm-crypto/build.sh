#!/usr/bin/env bash

set -e

echo "*** Building package"
../../scripts/build-package.sh

# shortcuts for files
echo "*** Adjusting output"
SRC=build/wasm.js

# # we do not want the __ imports (used by WASM) to clutter up
# sed -i -e 's/var wasm;/const crypto = require('\''crypto'\''); let wasm; const requires = { crypto };/g' $SRC

# # this creates issues in both the browser and RN (@polkadot/util has a polyfill)
# sed -i -e 's/const TextDecoder = require('\''util'\'')\.TextDecoder;/const { u8aToString } = require('\''@polkadot\/util'\'');/g' $SRC

# # TextDecoder is not available on RN, so use the @polkadot/util replacement (with polyfill)
# sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC
# sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC

# # pull the requires from the imports and the `requires` object
# sed -i -e 's/return addHeapObject(require(varg0));/return addHeapObject(requires[varg0]);/g' $SRC
# # sed -i -e 's/return addHeapObject(require(varg0));/throw new Error(`Invalid require from WASM for ${varg0}`);/g' $SRC

echo "*** Testing package"
cargo test -- --nocapture
node ./test/wasm.js
yarn jest ./test/jest.spec.js
