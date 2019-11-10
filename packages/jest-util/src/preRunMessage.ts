/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';
import clearLine from './clearLine';
import isInteractive from './isInteractive';

export const print = (stream: NodeJS.WriteStream) => {
  if (isInteractive) {
    stream.write(terminalStyles.bold.dim('Determining test suites to run...'));
  }
};

export const remove = (stream: NodeJS.WriteStream) => {
  if (isInteractive) {
    clearLine(stream);
  }
};
