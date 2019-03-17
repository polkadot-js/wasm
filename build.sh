#!/usr/bin/env bash

set -e

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

# build wasm2js as required
# if [ ! -f "binaryen/bin/wasm2js" ]; then
#   echo "*** Building wasm2js"
#   cd binaryen
#   cmake .
#   make wasm2js
#   cd ..
# fi

# build wasm-opt as required
if [ ! -f "binaryen/bin/wasm-opt" ]; then
  echo "*** Building wasm-opt"
  cd binaryen
  cmake .
  make wasm-opt
  cd ..
fi

# install deps
echo "*** Installing JS dependencies"
yarn

# build packages
echo "*** Building packages"
cd packages
cd wasm-schnorrkel
./build.sh
cd ..
cd ..
