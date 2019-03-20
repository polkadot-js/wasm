#!/usr/bin/env bash

set -e

echo "*** Building package"
../../scripts/build-package.sh

# shortcuts for files
echo "*** Adjusting output"
SRC=build/wasm.js

# We don't want inline requires
sed -i -e 's/var wasm;/const crypto = require('\''crypto'\''); let wasm; const requires = { crypto };/g' $SRC
sed -i -e 's/return addHeapObject(require(varg0));/return addHeapObject(requires[varg0]);/g' $SRC

# this creates issues in both the browser and RN (@polkadot/util has a polyfill)
sed -i -e 's/const TextEncoder = require('\''util'\'')\.TextEncoder;/const { stringToU8a } = require('\''@polkadot\/util'\'');/g' $SRC
sed -i -e 's/let cachedTextEncoder = new /\/\/ let cachedTextEncoder = new /g' $SRC
sed -i -e 's/cachedTextEncoder\.encode/stringToU8a/g' $SRC

echo "*** Testing package"
cargo test -- --nocapture
node ./test/wasm.js
yarn jest ./test/jest.spec.js
