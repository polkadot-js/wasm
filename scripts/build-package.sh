#!/usr/bin/env bash

set -e

echo "*** Building package"

# cleanup old
echo "*** Cleaning old builds"
rm -rf ./build ./pkg

# build new via nightly & wasm-pack
echo "*** Building WASM output"
rustup run nightly wasm-pack build --release --scope polkadot --target nodejs
mv pkg build

# shortcuts for files
echo "*** Adjusting output"
BGJ=build/wasm_bg.js
SRC_WASM=build/wasm.js
DEF=build/wasm.d.ts
WSM=build/wasm_bg.wasm
OPT=build/wasm_opt.wasm
ASM=build/wasm_asm.js
TMP=build/wasm_tmp.js

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt $WSM -Os -o $OPT
# cp -f build/wasm_bg.wasm build/wasm_opt.wasm

# build asmjs version from the input (optimised) WASM
# echo "*** Building asm.js version"
echo "*** Building asm.js version"
../../binaryen/bin/wasm2js --no-validation --output $TMP $OPT

# get babel to take care of making it sane
NODE_OPTIONS=--max_old_space_size=8192 yarn babel $TMP --presets @babel/preset-env --out-file=$ASM
rm -rf $TMP

# convert wasm to base64 structure
echo "*** Packing WASM into base64"
node ../../scripts/pack-wasm-base64.js

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
