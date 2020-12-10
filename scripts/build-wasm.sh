#!/usr/bin/env bash
# Copyright 2019-2020 @polkadot/wasm authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

set -e

# also change in install-build-deps
RUST_VER=nightly-2020-10-25

WSM=bytes/wasm_bg.wasm
OPT=bytes/wasm_opt.wasm
ASM=bytes-asmjs-crypto/build/data.js

# build new via wasm-pack
echo "*** Building Rust sources"
cd wasm-crypto
rustup run $RUST_VER xargo build --target wasm32-unknown-unknown --release
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
node ../scripts/pack-wasm-base.js

# build asmjs version from the input (optimised) WASM
echo "*** Building asm.js version"
../binaryen/bin/wasm2js --output $ASM $OPT

# cleanup the generated asm, converting to cjs
sed -i -e '/import {/d' $ASM
sed -i -e '/export var /d' $ASM
sed -i -e 's/{abort.*},memasmFunc/wbg, memasmFunc/g' $ASM
sed -i -e 's/var retasmFunc = /module.exports = (wbg) => /' $ASM

# cleanups
rm -rf bytes-asmjs-crypto/build/*-e
rm -rf bytes-wasm-crypto/build/*-e
