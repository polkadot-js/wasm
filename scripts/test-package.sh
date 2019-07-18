#!/usr/bin/env bash

set -e

echo "*** Testing package"

echo "*** Testing Rust"
RUST_BACKTRACE=full rustup run nightly cargo test --release -- --nocapture

echo "*** Testing WASM"
node ./test/wasm.js

echo "*** Testing ASM.js"
CRYPTO_ASM=1 node ./test/asm.js

echo "*** Testing via Jest"
yarn jest ./test/jest.spec.js
