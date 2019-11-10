/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {TerminalStyles} from './terminalStylings';
import {setLevel} from './stylingSettings';
import {settingsType} from './types';

const settings: settingsType = setLevel();
const terminalStyles = new TerminalStyles(settings);

export {terminalStyles};
