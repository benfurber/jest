/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import slash = require('slash');
import {terminalStyles} from 'jest-config';
import {ConsoleBuffer} from './types';

export default (root: string, verbose: boolean, buffer: ConsoleBuffer) => {
  const TITLE_INDENT = verbose ? '  ' : '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';

  return buffer.reduce((output, {type, message, origin}) => {
    origin = slash(path.relative(root, origin));
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');

    let typeMessage = 'console.' + type;
    if (type === 'warn') {
      message = terminalStyles.yellow(message);
      typeMessage = terminalStyles.yellow(typeMessage);
    } else if (type === 'error') {
      message = terminalStyles.red(message);
      typeMessage = terminalStyles.red(typeMessage);
    }

    return (
      output +
      TITLE_INDENT +
      terminalStyles.dim(typeMessage) +
      ' ' +
      terminalStyles.dim(origin) +
      '\n' +
      message +
      '\n'
    );
  }, '');
};
