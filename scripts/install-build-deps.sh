#!/usr/bin/env bash

set -e

# wasm2js for wasm -> asm.js
BINARYEN=( "wasm-opt" )

# install wasm-pack as required
if ! [ -x "$(command -v wasm-pack)" ]; then
  echo "*** Installing wasm-pack"
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# install binaryen as required
if [ ! -d "binaryen" ]; then
  echo "*** Installing binaryen"
  git clone --recursive https://github.com/WebAssembly/binaryen.git
  rm -rf binaryen/test
fi

for BIN in "${BINARYEN[@]}"; do
  if [ ! -f "binaryen/bin/$BIN" ]; then
    echo "*** Building $BIN"
    cd binaryen
    cmake . && make $BIN
    cd ..
  fi
done
