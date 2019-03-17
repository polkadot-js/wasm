#!/usr/bin/env bash

set -e

./deps.sh

PACKAGES=( "schnorrkel" )

echo "*** Testing packages"
cd packages

for PKG in "${PACKAGES[@]}"; do
  cd wasm-$PKG

  ./test.sh

  cd ..
done

cd ..
