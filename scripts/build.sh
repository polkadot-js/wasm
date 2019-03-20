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

    ../../scripts/build-package.sh
    ./adjust.sh

    rm -rf build/*-e build/package.json build/README.md
    ls -al build

    ../../scripts/test-package.sh

    cd ..
  fi
done

cd ..
