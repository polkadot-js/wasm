#!/usr/bin/env bash

set -e

echo "*** Testing package"

echo "*** Testing Rust"
cargo test --release

echo "*** Testing WASM"
node ./test/wasm.js

echo "*** Testing via Jest"
yarn jest ./test/jest.spec.js
