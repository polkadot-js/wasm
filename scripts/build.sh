#!/usr/bin/env bash
# Copyright 2019-2025 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

echo "*** Building JavaScript"
./scripts/build-js.sh

echo "*** Building WASM"
cd packages

unamestr=`uname`

# For Mac we set extra paths for clang
if [[ "$unamestr" == "Darwin" ]]; then
  if [ ! -f "/opt/homebrew/opt/llvm/bin/clang" ]; then
    echo "FATAL: Ensure you have clang installed via homebrew"
    exit 1
  fi

  PATH="/opt/homebrew/opt/llvm/bin:$PATH" CC=/opt/homebrew/opt/llvm/bin/clang AR=/opt/homebrew/opt/llvm/bin/llvm-ar PKG_NAME=wasm-crypto ../scripts/build-wasm.sh
else
  PKG_NAME=wasm-crypto ../scripts/build-wasm.sh
fi

if [ -z "$WITH_DENO" ]; then
  yarn test:wasm-crypto:js
else
  yarn test:wasm-crypto:deno
fi

# echo ""
# echo "*** wasm-crypto"
# ls -alR wasm-crypto/build
# echo ""
# echo "*** wasm-crypto-asmjs"
# ls -alR wasm-crypto-asmjs/build
# echo ""
# echo "*** wasm-crypto-wasm"
# ls -alR wasm-crypto-wasm/build

cd ..

if [ -z "$WITH_DENO" ]; then
  yarn build:rollup
fi
