#!/usr/bin/env bash

set -e

# cleanup old
echo "*** Cleaning old builds"
rm -rf ./build ./pkg

# build new via nightly & wasm-pack
echo "*** Building WASM output"
rustup run nightly wasm-pack build --release --scope polkadot --target nodejs
mv pkg build

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt build/wasm_bg.wasm -Os -o build/wasm_opt.wasm

# build asmjs version from the input (optimised) WASM
# echo "*** Building asm.js version"
# ../../binaryen/bin/wasm2js --no-validation --output build/wasm_temp.js build/wasm_opt.wasm

# convert wasm to base64 structure
echo "*** Packing WASM into base64"
node ../../scripts/pack-wasm-base64.js

# copy our package interfaces
echo "*** Copying package sources"
cp src/js/* build/

# shortcuts for files
echo "*** Adjusting output"
BGJ=build/wasm_bg.js
SRC=build/wasm.js
DEF=build/wasm.d.ts
TMP=build/wasm_temp.js
ASM=build/wasm_asm.js

# update the files (new addition)
# excluded: "wasm_asm\.js",
# sed -i -e 's/wasm_bg\.wasm/wasm_wasm\.js", "index\.js", "index\.d\.ts/g' $PKG
# sed -i -e 's/"main": "wasm\.js"/"main": "index\.js"/g' $PKG
# sed -i -e 's/"types": "wasm\.d\.ts"/"types": "index\.d\.ts"/g' $PKG

# cleanup asm
# sed -i -e 's/import {/\/\/ import {/g' $TMP
# sed -i -e 's/function asmFunc/var schnorrkel = require('\''\.\/wasm'\''); function asmFunc/g' $TMP
# sed -i -e 's/export const /module\.exports\./g' $TMP
# sed -i -e 's/{abort.*},memasmFunc/schnorrkel, memasmFunc/g' $TMP

# we are swapping to a async interface for webpack support (wasm limits)
sed -i -e 's/wasm = require/\/\/ wasm = require/g' $SRC

# construct our promise and add ready helpers
echo "
module.exports.abort = function () { throw new Error('abort'); };

const createPromise = require('./wasm_bg');
const wasmPromise = createPromise().catch(() => null);

module.exports.isReady = function () { return !!wasm; }
module.exports.waitReady = function () { return wasmPromise.then(() => !!wasm); }

wasmPromise.then((_wasm) => { wasm = _wasm });
" >> $SRC

# add extra methods to type definitions
echo "
export function isReady(): boolean;
export function waitReady(): Promise<boolean>;
" >> $DEF

# create the init promise handler
echo "
const asm = null; // require('./wasm_asm');
const bytes = require('./wasm_wasm');
const imported = require('./wasm');

module.exports = async function createExportPromise () {
  const imports = {
    './wasm': imported
  };

  if (!WebAssembly) {
    return asm;
  }

  try {
    const { instance } = await WebAssembly.instantiate(bytes, imports);

    return instance.exports;
  } catch (error) {
    return asm;
  }
}
" > $BGJ
