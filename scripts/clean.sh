#!/usr/bin/env bash

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
