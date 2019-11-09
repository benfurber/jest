/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';
import {Config} from '@jest/types';

const activeFilters = (
  globalConfig: Config.GlobalConfig,
  delimiter: string = '\n',
) => {
  const {testNamePattern, testPathPattern} = globalConfig;
  if (testNamePattern || testPathPattern) {
    const filters = [
      testPathPattern
        ? terminalStyles.dim('filename ') +
          terminalStyles.warn('/' + testPathPattern + '/')
        : null,
      testNamePattern
        ? terminalStyles.dim('test name ') +
          terminalStyles.warn('/' + testNamePattern + '/')
        : null,
    ]
      .filter(f => f)
      .join(', ');

    const messages = ['\n' + terminalStyles.bold('Active Filters: ') + filters];

    return messages.filter(message => !!message).join(delimiter);
  }

  return '';
};

export default activeFilters;
