#!/usr/bin/env bash

# cleanup old
echo "*** Cleaning old builds"
rm -rf ./build ./pkg

# build new via nightly & wasm-pack
echo "*** Building WASM output"
rustup run nightly wasm-pack build --release --scope polkadot --target nodejs
mv pkg build

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt build/wasm_schnorrkel_bg.wasm -Os -o build/wasm_schnorrkel_opt.wasm

# build asmjs version from the input (optimised) WASM
# echo "*** Building asm.js version"
# ../../binaryen/bin/wasm2js --no-validation --output build/wasm_schnorrkel_temp.js build/wasm_schnorrkel_opt.wasm

# convert wasm to base64 structure
echo "*** Packing WASM into base64"
node ./build.js

# copy our package interfaces
echo "*** Copying package sources"
cp src/js/* build/

# shortcuts for files
echo "*** Adjusting output"
BGJ=build/wasm_schnorrkel_bg.js
SRC=build/wasm_schnorrkel.js
DEF=build/wasm_schnorrkel.d.ts
TMP=build/wasm_schnorrkel_temp.js
ASM=build/wasm_schnorrkel_asm.js
PKG=build/package.json

# update the files (new addition)
# excluded: "wasm_schnorrkel_asm\.js",
# sed -i -e 's/wasm_schnorrkel_bg\.wasm/wasm_schnorrkel_wasm\.js", "index\.js", "index\.d\.ts/g' $PKG
# sed -i -e 's/"main": "wasm_schnorrkel\.js"/"main": "index\.js"/g' $PKG
# sed -i -e 's/"types": "wasm_schnorrkel\.d\.ts"/"types": "index\.d\.ts"/g' $PKG

# cleanup asm
# sed -i -e 's/import {/\/\/ import {/g' $TMP
# sed -i -e 's/function asmFunc/var schnorrkel = require('\''\.\/wasm_schnorrkel'\''); function asmFunc/g' $TMP
# sed -i -e 's/export const /module\.exports\./g' $TMP
# sed -i -e 's/{abort.*},memasmFunc/schnorrkel, memasmFunc/g' $TMP

# we do not want the __ imports (used by WASM) to clutter up
sed -i -e 's/var wasm;/const crypto = require('\''crypto'\''); let wasm; const requires = { crypto };/g' $SRC

# this creates issues in both the browser and RN (@polkadot/util has a polyfill)
sed -i -e 's/const TextDecoder = require('\''util'\'')\.TextDecoder;/const { u8aToString } = require('\''@polkadot\/util'\'');/g' $SRC

# TextDecoder is not available on RN, so use the @polkadot/util replacement (with polyfill)
sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC
sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC

# we are swapping to a async interface for webpack support (wasm limits)
sed -i -e 's/wasm = require/\/\/ wasm = require/g' $SRC

# pull the requires from the imports and the `requires` object
sed -i -e 's/return addHeapObject(require(varg0));/return addHeapObject(requires[varg0]);/g' $SRC
# sed -i -e 's/return addHeapObject(require(varg0));/throw new Error(`Invalid require from WASM for ${varg0}`);/g' $SRC

# construct our promise and add ready helpers
echo "
module.exports.abort = function () { throw new Error('abort'); };

const createPromise = require('./wasm_schnorrkel_bg');
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
const asm = null; // require('./wasm_schnorrkel_asm');
const bytes = require('./wasm_schnorrkel_wasm');
const schnorrkel = require('./wasm_schnorrkel');

module.exports = async function createExportPromise () {
  const imports = {
    './wasm_schnorrkel': schnorrkel
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

# cleanup in-place sed files
echo "*** Cleaning up in-place edits"
rm -rf build/*-e

# pass through uglify to make the actual output smaller
# echo "*** Optimising asm.js output"
# yarn run uglifyjs $TMP --compress --mangle --timings --output $ASM
# mv $TMP $ASM
