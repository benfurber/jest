/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import terminalStyles from './terminalStylings';
import prettyFormat = require('pretty-format');

const format = (value: unknown) => prettyFormat(value, {min: true});

export default {
  mapCoverage: () => `  Option ${terminalStyles.bold(
    '"mapCoverage"',
  )} has been removed, as it's no longer necessary.

  Please update your configuration.`,

  preprocessorIgnorePatterns: (options: {
    preprocessorIgnorePatterns: Array<string>;
  }) => `  Option ${terminalStyles.bold(
    '"preprocessorIgnorePatterns"',
  )} was replaced by ${terminalStyles.bold(
    '"transformIgnorePatterns"',
  )}, which support multiple preprocessors.

  Jest now treats your current configuration as:
  {
    ${terminalStyles.bold('"transformIgnorePatterns"')}: ${terminalStyles.bold(
    format(options.preprocessorIgnorePatterns),
  )}
  }

  Please update your configuration.`,

  scriptPreprocessor: (options: {
    scriptPreprocessor: string;
  }) => `  Option ${terminalStyles.bold(
    '"scriptPreprocessor"',
  )} was replaced by ${terminalStyles.bold(
    '"transform"',
  )}, which support multiple preprocessors.

  Jest now treats your current configuration as:
  {
    ${terminalStyles.bold('"transform"')}: ${terminalStyles.bold(
    `{".*": ${format(options.scriptPreprocessor)}}`,
  )}
  }

  Please update your configuration.`,

  setupTestFrameworkScriptFile: (_options: {
    setupTestFrameworkScriptFile: Array<string>;
  }) => `  Option ${terminalStyles.bold(
    '"setupTestFrameworkScriptFile"',
  )} was replaced by configuration ${terminalStyles.bold(
    '"setupFilesAfterEnv"',
  )}, which supports multiple paths.

  Please update your configuration.`,

  testPathDirs: (options: {
    testPathDirs: Array<string>;
  }) => `  Option ${terminalStyles.bold(
    '"testPathDirs"',
  )} was replaced by ${terminalStyles.bold('"roots"')}.

  Jest now treats your current configuration as:
  {
    ${terminalStyles.bold('"roots"')}: ${terminalStyles.bold(
    format(options.testPathDirs),
  )}
  }

  Please update your configuration.
  `,
} as Record<string, Function>;
