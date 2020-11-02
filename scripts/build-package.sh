#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

WSM=pkg/wasm_bg.wasm
OPT=pkg/wasm_opt.wasm
ASM=build/wasm/asm.js

echo "*** Building package"

# cleanup old
echo "*** Cleaning old builds"
rm -rf ./build ./pkg
mkdir -p build/js build/wasm

# copy our package interfaces
echo "*** Copying package sources"
cp package.json build/
cp src/index.d.ts src/index.js build/
cp src/js/* build/js/
cp src/wasm/* build/wasm/

# build new via wasm-pack
echo "*** Building WASM output"
wasm-pack build --release --scope polkadot --target web

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt $WSM -Os -o $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into baseX"
node ../../scripts/pack-wasm-base.js

# build asmjs version from the input (optimised) WASM
echo "*** Building asm.js version"
../../binaryen/bin/wasm2js --output $ASM $OPT

# cleanup the generated asm, converting to cjs
sed -i -e '/import {/d' $ASM
echo "const imports = require('../js/imports');
$(cat $ASM)" > $ASM
sed -i -e 's/{abort.*},memasmFunc/imports, memasmFunc/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM
rm -rf build/wasm/*-e
