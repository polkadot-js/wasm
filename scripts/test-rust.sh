#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

echo "*** Testing packages"
cd packages

PACKAGES=( $(ls -1d *) )

for PKG in "${PACKAGES[@]}"; do
  if [ -f "$PKG/package.json" ]; then
    echo "*** Testing $PKG"
    cd $PKG

    echo "*** Testing Rust"
    RUST_BACKTRACE=full rustup run nightly-2020-02-17 cargo test --release -- --nocapture

    cd ..
  fi
done

cd ..
