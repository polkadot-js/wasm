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

# build new via nightly & wasm-pack
echo "*** Building WASM output"
rustup run nightly-2020-02-17 wasm-pack build --release --scope polkadot --target nodejs
mv pkg build

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt $WSM -Os -o $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into base64"
node ../../scripts/pack-wasm-base64.js

# build asmjs version from the input (optimised) WASM
echo "*** Building asm.js version"
../../binaryen/bin/wasm2js --output $ASM $OPT

# cleanup the generated output, sadly there are no node-js outputs above
sed -i -e 's/import {/\/\/ import {/g' $ASM
sed -i -e 's/function asmFunc/var schnorrkel = require('\''\.\/wasm'\''); function asmFunc/g' $ASM
sed -i -e 's/{abort.*},memasmFunc/schnorrkel, memasmFunc/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM

# copy our package interfaces
echo "*** Copying package sources"
cp src/js/* build/

# we are swapping to a async interface for webpack support (wasm limits)
sed -i -e 's/wasm = require/\/\/ wasm = require/g' $SRC_WASM

# We don't want inline requires
sed -i -e 's/var wasm;/const crypto = require('\''crypto'\''); let wasm; const requires = { crypto };/g' $SRC_WASM
sed -i -e 's/return addHeapObject(require(varg0));/return addHeapObject(requires[varg0]);/g' $SRC_WASM

# this creates issues in both the browser and RN (@polkadot/util has a polyfill)
sed -i -e 's/const TextEncoder = require('\''util'\'')\.TextEncoder;/const { stringToU8a } = require('\''@polkadot\/util'\'');/g' $SRC_WASM
sed -i -e 's/let cachedTextEncoder = new /\/\/ let cachedTextEncoder = new /g' $SRC_WASM
sed -i -e 's/cachedTextEncoder\.encode/stringToU8a/g' $SRC_WASM

# this creates issues in both the browser and RN (@polkadot/util has a polyfill)
sed -i -e 's/const TextDecoder = require('\''util'\'')\.TextDecoder;/const { u8aToString } = require('\''@polkadot\/util'\'');/g' $SRC_WASM
sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC_WASM
sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC_WASM

# construct our promise and add ready helpers (WASM)
echo "
module.exports.abort = function () { throw new Error('abort'); };

const createPromise = require('./wasm_promise');
const wasmPromise = createPromise().catch(() => null);

module.exports.isReady = function () { return !!wasm; }
module.exports.waitReady = function () { return wasmPromise.then(() => !!wasm); }

wasmPromise.then((_wasm) => { wasm = _wasm });
" >> $SRC_WASM

# add extra methods to type definitions
echo "
export function isReady(): boolean;
export function waitReady(): Promise<boolean>;
" >> $DEF
