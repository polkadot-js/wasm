#!/usr/bin/env bash
# Copyright 2019-2021 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

echo "*** Building JavaScript"
./scripts/build-js.sh

echo "*** Building WASM"
cd packages

../scripts/build-wasm.sh

yarn test:wasm:js

echo ""
echo "*** wasm-crypto"
ls -alR wasm-crypto/build
echo ""
echo "*** wasm-crypto-asmjs"
ls -alR wasm-crypto-asmjs/build
echo ""
echo "*** wasm-crypto-wasm"
ls -alR wasm-crypto-wasm/build

cd ..

yarn build:rollup
