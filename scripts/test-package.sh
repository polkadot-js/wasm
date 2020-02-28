#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

echo "*** Testing package"

echo "*** Testing WASM"
node ./test/wasm.js

echo "*** Testing ASM.js"
node ./test/asm.js

echo "*** Testing via Jest"
yarn polkadot-dev-run-test ./test/jest.spec.js
