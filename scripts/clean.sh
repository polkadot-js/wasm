#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

./scripts/install-build-deps.sh

echo "*** Cleaning packages"
cd packages

PACKAGES=( $(ls -1d *) )

for PKG in "${PACKAGES[@]}"; do
  if [ -f "$PKG/package.json" ]; then
    echo "*** Cleaning $PKG"
    cd $PKG

    rm -rf build
    cargo clean

    cd ..
  fi
done

cd ..
