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
SRC=build/wasm.js
DEF=build/wasm.d.ts
WSM=build/wasm_bg.wasm
OPT=build/wasm_opt.wasm
ASM=build/wasm_asm.js

# optimise
echo "*** Optimising WASM output"
../../binaryen/bin/wasm-opt $WSM -Os -o $OPT
# cp -f build/wasm_bg.wasm build/wasm_opt.wasm

# build asmjs version from the input (optimised) WASM
# echo "*** Building asm.js version"
# ../../binaryen/bin/wasm2js --no-validation --output $ASM $OPT

# convert wasm to base64 structure
echo "*** Packing WASM into base64"
node ../../scripts/pack-wasm-base64.js

# copy our package interfaces
echo "*** Copying package sources"
cp src/js/* build/

# cleanup asm
# sed -i -e 's/import {/\/\/ import {/g' $ASM
# sed -i -e 's/function asmFunc/var schnorrkel = require('\''\.\/wasm'\''); function asmFunc/g' $ASM
# sed -i -e 's/export const /module\.exports\./g' $ASM
# sed -i -e 's/{abort.*},memasmFunc/schnorrkel, memasmFunc/g' $ASM

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
const pkg = require('./package.json');
const bytes = require('./wasm_wasm');
const js = require('./wasm');

module.exports = async function createExportPromise () {
  const imports = {
    './wasm': js
  };

  if (!WebAssembly) {
    console.error(\`ERROR: Unable to initialize \${pkg.name}, WebAssembly is not available in this environment\`);

    // TODO: Return asm version when not detected
    return null;
  }

  try {
    const { instance } = await WebAssembly.instantiate(bytes, imports);

    return instance.exports;
  } catch (error) {
    console.error(\`ERROR: Unable to initialize \${pkg.name}:: \${error.message}\`);

    // TODO: Return asm version here as a fallback
    return null;
  }
}
" > $BGJ
