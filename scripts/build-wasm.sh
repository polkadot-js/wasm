#!/usr/bin/env bash
# Copyright 2019-2025 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -ex

source ../scripts/rust-version.sh

WSM=$PKG_NAME/build-wasm/wasm_bg.wasm
OPT=$PKG_NAME/build-wasm/wasm_opt.wasm
DENO_DIR=$PKG_NAME-asmjs/build-deno/deno
DENO_ASM=$DENO_DIR/data.js

# build new via wasm-pack
echo "*** Building Rust sources"
cd $PKG_NAME
RUSTC_BOOTSTRAP=1 cargo build --target wasm32-unknown-unknown --release -Z build-std=std,panic_abort
cd ..

echo "*** Converting to WASM"
../bindgen/wasm-bindgen $PKG_NAME/target/wasm32-unknown-unknown/release/wasm.wasm --out-dir $PKG_NAME/build-wasm --target web

# optimise
echo "*** Optimising WASM output"
../binaryen/bin/wasm-opt $WSM -Oz -o $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into baseX"
node ../scripts/pack-wasm-base.mjs



# copy the deno version
mkdir -p $DENO_DIR

rm -rf $PKG_NAME-wasm/build/cjs/*-e
rm -rf $PKG_NAME-wasm/build-deno/deno/*-e
