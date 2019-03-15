#!/usr/bin/env bash

# test packages
echo "*** Testing Rust packages"
cd packages
cd wasm-schnorrkel
cargo test -- --nocapture
cd ..
cd ..
