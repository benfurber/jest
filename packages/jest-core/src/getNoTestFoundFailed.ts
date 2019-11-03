/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';

export default function getNoTestFoundFailed() {
  return (
    terminalStyles.bold('No failed test found.\n') +
    terminalStyles.dim('Press `f` to quit "only failed tests" mode.')
  );
}
