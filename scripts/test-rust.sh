#!/usr/bin/env bash

set -e

echo "*** Testing packages"
cd packages

PACKAGES=( $(ls -1d *) )

for PKG in "${PACKAGES[@]}"; do
  if [ -f "$PKG/package.json" ]; then
    echo "*** Testing $PKG"
    cd $PKG

    echo "*** Testing Rust"
    RUST_BACKTRACE=full rustup run nightly cargo test --release -- --nocapture

    cd ..
  fi
done

cd ..
