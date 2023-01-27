#!/usr/bin/env bash
# Copyright 2019-2023 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

yarn polkadot-dev-clean-build

cd packages/wasm-crypto
cargo clean
cd ../..
