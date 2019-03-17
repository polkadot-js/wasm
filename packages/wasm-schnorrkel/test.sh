#!/usr/bin/env bash

set -e

./build.sh

echo "*** Running cargo tests"
cargo test --release -- --nocapture

echo "*** Running wasm tests"
node ./test/wasm.js

echo "*** Running jest tests"
yarn jest ./test/jest.spec.js
