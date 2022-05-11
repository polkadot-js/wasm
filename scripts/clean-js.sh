#!/usr/bin/env bash
# Copyright 2019-2022 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

# cleanup old
echo "*** Cleaning old builds"
rm -rf build packages/*/build*
