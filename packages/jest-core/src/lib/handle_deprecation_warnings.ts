/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';
import {KEYS} from 'jest-watcher';

export default (
  pipe: NodeJS.WriteStream,
  stdin: NodeJS.ReadStream = process.stdin,
): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof stdin.setRawMode === 'function') {
      const messages = [
        terminalStyles.error('There are deprecation warnings.\n'),
        terminalStyles.dim(' \u203A Press ') +
          'Enter' +
          terminalStyles.dim(' to continue.'),
        terminalStyles.dim(' \u203A Press ') +
          'Esc' +
          terminalStyles.dim(' to exit.'),
      ];

      pipe.write(messages.join('\n'));

      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');
      // this is a string since we set encoding above
      stdin.on('data', (key: string) => {
        if (key === KEYS.ENTER) {
          resolve();
        } else if (
          [KEYS.ESCAPE, KEYS.CONTROL_C, KEYS.CONTROL_D].indexOf(key) !== -1
        ) {
          reject();
        }
      });
    } else {
      resolve();
    }
  });
