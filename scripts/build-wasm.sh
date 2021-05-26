#!/usr/bin/env bash
# Copyright 2019-2021 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

# also change in install-build-deps
# RUST_VER=nightly-2020-10-25
# We use RUSTC_BOOTSTRAP=1 below to switch on unstable features
RUST_VER=stable

WSM=bytes/wasm_bg.wasm
OPT=bytes/wasm_opt.wasm
ASM=wasm-crypto-asmjs/build/cjs/data.js

# build new via wasm-pack
echo "*** Building Rust sources"
cd wasm-crypto
RUSTC_BOOTSTRAP=1 rustup run $RUST_VER xargo build --target wasm32-unknown-unknown --release
# rustup run $RUST_VER cargo build --target wasm32-unknown-unknown --release -Z build-std=std,panic_abort
cd ..

echo "*** Converting to WASM"
../bindgen/wasm-bindgen wasm-crypto/target/wasm32-unknown-unknown/release/wasm.wasm --out-dir bytes --target web
# wasm-pack build --release --scope polkadot --target web

# optimise
echo "*** Optimising WASM output"
# ../../wabt/bin/wasm-strip $WSM
../binaryen/bin/wasm-opt $WSM -Os -o $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into baseX"
node ../scripts/pack-wasm-base.cjs

# build asmjs version from the input (optimised) WASM
echo "*** Building asm.js version"
../binaryen/bin/wasm2js --output $ASM $OPT

# cleanup the generated asm, converting to cjs
sed -i -e '/import {/d' $ASM
sed -i -e '/export var /d' $ASM
sed -i -e 's/{abort.*},memasmFunc/wbg, memasmFunc/g' $ASM
sed -i -e 's/var retasmFunc = /const asmJsInit = (wbg) => /' $ASM
echo "module.exports = { asmJsInit };" >> $ASM

# cleanups
rm -rf wasm-crypto-asmjs/build/cjs/*-e
rm -rf wasm-crypto-wasm/build/cjs/*-e
