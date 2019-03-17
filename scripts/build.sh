#!/usr/bin/env bash

set -e

./scripts/install-build-deps.sh

PACKAGES=( "crypto" "schnorrkel" )

echo "*** Building packages"
cd packages

for PKG in "${PACKAGES[@]}"; do
  echo "*** Building wasm-$PKG"
  cd wasm-$PKG

  ./build.sh
  rm -rf build/*-e build/package.json build/README.md
  ls -al build

  cd ..
done

cd ..
