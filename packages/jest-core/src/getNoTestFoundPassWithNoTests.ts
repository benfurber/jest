/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';

export default function getNoTestFoundPassWithNoTests() {
  return terminalStyles.bold('No tests found, exiting with code 0');
}
