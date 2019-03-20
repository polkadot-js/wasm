#!/usr/bin/env bash

set -e

./scripts/install-build-deps.sh

echo "*** Building packages"
cd packages

PACKAGES=( $(ls -1d *) )

for PKG in "${PACKAGES[@]}"; do
  if [ -f "$PKG/package.json" ]; then
    echo "*** Building $PKG"
    cd $PKG

    ./build.sh
    rm -rf build/*-e build/package.json build/README.md
    ls -al build

    cd ..
  fi
done

cd ..
