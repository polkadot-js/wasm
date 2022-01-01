#!/usr/bin/env bash
# Copyright 2019-2022 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

./scripts/clean-js.sh

echo "*** Cleaning wasm"
cd packages/wasm-crypto

cargo clean

cd ../..
