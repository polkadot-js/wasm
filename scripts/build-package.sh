#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

BGJ=build/wasm_bg.js
SRC_WASM=build/wasm.js
DEF=build/wasm.d.ts
WSM=build/wasm_bg.wasm
OPT=build/wasm_opt.wasm
ASM=build/wasm_asm.js

echo "*** Building package"

# cleanup old
echo "*** Cleaning old builds"
rm -rf ./build ./pkg

# build new via wasm-pack
echo "*** Building WASM output"
wasm-pack build --release --scope polkadot --target nodejs
mv pkg build

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
echo "const wbindgenEnv = require('./wbindgen-env');
$(cat $ASM)" > $ASM
sed -i -e 's/{abort.*},memasmFunc/wbindgenEnv, memasmFunc/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM

# copy our package interfaces
echo "*** Copying package sources"
cp src/js/* build/
