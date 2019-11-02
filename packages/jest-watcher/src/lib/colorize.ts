/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from 'jest-config';

export default (str: string, start: number, end: number) =>
  terminalStyles.dim(str.slice(0, start)) +
  terminalStyles.reset(str.slice(start, end)) +
  terminalStyles.dim(str.slice(end));
