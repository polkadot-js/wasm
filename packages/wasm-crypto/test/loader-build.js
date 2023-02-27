// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

// Adjusts the resolver to point to the build output
export function resolve (specifier, context, nextResolve) {
  if (/^@polkadot\/wasm-/.test(specifier)) {
    const parts = specifier.split(/[\\/]/);

    return {
      format: 'module',
      shortCircuit: true,
      url: pathToFileURL(
        path.join(
          process.cwd(),
          ['packages', parts[1], 'build', ...parts.slice(2)]
            .join('/')
            .replace(/\/wasm-crypto-init\/build$/, '/wasm-crypto-init/build/wasm.js')
            .replace(/\/wasm-crypto-init\/build\/asm$/, '/wasm-crypto-init/build/asm.js')
            .replace(/\/wasm-crypto\/build\/initOnlyAsm$/, '/wasm-crypto/build/initOnlyAsm.js')
            .replace(/\/build\/packageInfo$/, '/build/packageInfo.js')
            .replace(/\/build$/, '/build/index.js')
        )
      ).href
    };
  }

  return nextResolve(specifier, context);
}
