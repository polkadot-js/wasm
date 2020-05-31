// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const path = require('path');

module.exports = function resolver (file, config) {
  return file.includes('package.json')
    ? path.join(config.basedir.replace('/src', '/'), file)
    : config.defaultResolver(file, config);
};
