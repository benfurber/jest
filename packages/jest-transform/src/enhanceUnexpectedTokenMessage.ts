/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';

const DOT = ' \u2022 ';

export default function enhanceUnexpectedTokenMessage(e: Error) {
  e.stack =
    `${terminalStyles.errorBold('Jest encountered an unexpected token')}

This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.

By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".

Here's what you can do:
${DOT}To have some of your "node_modules" files transformed, you can specify a custom ${terminalStyles.bold(
      '"transformIgnorePatterns"',
    )} in your config.
${DOT}If you need a custom transformation specify a ${terminalStyles.bold(
      '"transform"',
    )} option in your config.
${DOT}If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the ${terminalStyles.bold(
      '"moduleNameMapper"',
    )} config option.

You'll find more details and examples of these config options in the docs:
${terminalStyles.cyan('https://jestjs.io/docs/en/configuration.html')}

${terminalStyles.errorBold('Details:')}

` + e.stack;

  return e;
}
