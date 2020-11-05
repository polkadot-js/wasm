#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

# also change in build-package
RUST_VER=nightly-2020-10-25

BINARYEN_TOOLS=( "wasm-opt" "wasm2js" )
BINARYEN_REPO=https://github.com/WebAssembly/binaryen
BINARYEN_VER=version_97
BINARYEN_ZIP=

BINDGEN_REPO=https://github.com/rustwasm/wasm-bindgen
BINDGEN_VER=0.2.65
BINDGEN_ZIP=

WABT_REPO=https://github.com/WebAssembly/wabt
WABT_VER=1.0.19
WABT_ZIP=

unamestr=`uname`

# toolchain with rust-src (for panic overrdides) and the right wasm32 toolchain
rustup toolchain install $RUST_VER -c rust-src -t wasm32-unknown-unknown

# if ! [ -x "$(command -v wasm-pack)" ]; then
#   echo "*** Installing wasm-pack"
#   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
# fi

if [[ "$unamestr" == 'Linux' ]]; then
  echo "*** Detected Linux"
  BINARYEN_ZIP=binaryen-$BINARYEN_VER-x86_64-linux
  BINDGEN_ZIP=wasm-bindgen-$BINDGEN_VER-x86_64-unknown-linux-musl
  WABT_ZIP=wabt-$WABT_VER-ubuntu
elif [[ "$unamestr" == "Darwin" ]]; then
  echo "*** Detected Mac"
  BINARYEN_ZIP=binaryen-$BINARYEN_VER-x86_64-macos
  BINDGEN_ZIP=wasm-bindgen-$BINDGEN_VER-x86_64-apple-darwin
  WABT_ZIP=wabt-$WABT_VER-macos
fi

if [ ! -z "$BINDGEN_ZIP" ]; then
  if [ ! -d "wasm-bindgen" ]; then
    echo "*** Downloading binaryen"
    curl -L $BINDGEN_REPO/releases/download/$BINDGEN_VER/$BINDGEN_ZIP.tar.gz | tar xz
    mv $BINDGEN_ZIP wasm-bindgen
  fi
else
  echo "*** Unable to extract binaryen"
fi

if [ ! -z "$WABT_ZIP" ]; then
  if [ ! -d "wabt" ]; then
    echo "*** Downloading wabt"
    curl -L $WABT_REPO/releases/download/$WABT_VER/$WABT_ZIP.tar.gz | tar xz
    mv wabt-$WABT_VER wabt
  fi
else
  echo "*** Unable to extract wabt"
fi

if [ ! -z "$WABT_ZIP" ]; then
  if [ ! -d "wabt" ]; then
    echo "*** Downloading wabt"
    curl -L $WABT_REPO/releases/download/$WABT_VER/$WABT_ZIP.tar.gz | tar xz
    mv wabt-$WABT_VER wabt
  fi
else
  echo "*** Unable to extract wabt"
fi
