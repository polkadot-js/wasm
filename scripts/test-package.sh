#!/usr/bin/env bash

set -e

echo "*** Testing package"

echo "*** Testing Rust"
RUST_BACKTRACE=full rustup run nightly cargo test --release -- --nocapture

echo "*** Testing WASM"
node ./test/wasm.js

echo "*** Testing via Jest"
yarn jest ./test/jest.spec.js
