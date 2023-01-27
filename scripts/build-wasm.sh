#!/usr/bin/env bash
# Copyright 2019-2023 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

source ../scripts/rust-version.sh

WSM=$PKG_NAME/build-wasm/wasm_bg.wasm
OPT=$PKG_NAME/build-wasm/wasm_opt.wasm
ASM=$PKG_NAME-asmjs/build/cjs/data.js
DENO_DIR=$PKG_NAME-asmjs/build-deno/deno
DENO_ASM=$DENO_DIR/data.js

# build new via wasm-pack
echo "*** Building Rust sources"
cd $PKG_NAME
if [ "$RUST_VER" == "stable" ]; then
  RUSTC_BOOTSTRAP=1 cargo build --target wasm32-unknown-unknown --release -Z build-std=std,panic_abort
else
  rustup run $RUST_VER xargo build --target wasm32-unknown-unknown --release
fi
cd ..

echo "*** Converting to WASM"
../bindgen/wasm-bindgen $PKG_NAME/target/wasm32-unknown-unknown/release/wasm.wasm --out-dir $PKG_NAME/build-wasm --target web

# optimise
echo "*** Optimising WASM output"
../binaryen/bin/wasm-opt $WSM -Oz -o $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into baseX"
node ../scripts/pack-wasm-base.mjs

# build asmjs version from the input (optimised) WASM
echo "*** Building asm.js version"
../binaryen/bin/wasm2js -Oz --output $ASM $OPT

# copy the deno version
mkdir -p $DENO_DIR
cp $ASM $DENO_ASM

# cleanup the generated asm, converting to cjs
sed -i -e '/import {/d' $ASM
sed -i -e '1,/var retasmFunc = /!d' $ASM
sed -i -e 's/var retasmFunc = .*/const asmJsInit = (wbg) => asmFunc(wbg);\n\nmodule.exports = { asmJsInit };/g' $ASM

# same as the cjs version, this time for deno
sed -i -e '/import {/d' $DENO_ASM
sed -i -e '1,/var retasmFunc = /!d' $DENO_ASM
sed -i -e 's/var retasmFunc = .*/export const asmJsInit = (wbg) => asmFunc(wbg);/g' $DENO_ASM

# cleanups
rm -rf $PKG_NAME-asmjs/build/cjs/*-e
rm -rf $PKG_NAME-asmjs/build-deno/deno/*-e
rm -rf $PKG_NAME-wasm/build/cjs/*-e
rm -rf $PKG_NAME-wasm/build-deno/deno/*-e
