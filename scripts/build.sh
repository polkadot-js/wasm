#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

rustup toolchain install nightly-2020-05-15
./scripts/install-build-deps.sh

echo "*** Building packages"
cd packages

PACKAGES=( $(ls -1d *) )

for PKG in "${PACKAGES[@]}"; do
  if [ -f "$PKG/package.json" ]; then
    echo "*** Building $PKG"
    cd $PKG

    ../../scripts/build-package.sh
    ../../scripts/test-package.sh

    rm -rf build/*-e build/package.json build/README.md
    ls -al build

    cd ..
  fi
done

cd ..
