/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {Config} from '@jest/types';
import {AggregatedResult} from '@jest/test-result';
import {terminalStyles} from '@jest/styles';
import slash = require('slash');
import {pluralize} from 'jest-util';
import {SummaryOptions} from './types';

const PROGRESS_BAR_WIDTH = 40;

export const printDisplayName = (config: Config.ProjectConfig) => {
  const {displayName} = config;
  const white = terminalStyles.reset.inverse.white;
  if (!displayName) {
    return '';
  }

  if (typeof displayName === 'string') {
    return terminalStyles.supportsColor
      ? white(` ${displayName} `)
      : displayName;
  }

  const {name, color} = displayName;
  const chosenColor = terminalStyles.reset.inverse[color]
    ? terminalStyles.reset.inverse[color]
    : white;
  return terminalStyles.supportsColor ? chosenColor(` ${name} `) : name;
};

export const trimAndFormatPath = (
  pad: number,
  config: Config.ProjectConfig | Config.GlobalConfig,
  testPath: Config.Path,
  columns: number,
): string => {
  const maxLength = columns - pad;
  const relative = relativePath(config, testPath);
  const {basename} = relative;
  let {dirname} = relative;

  // length is ok
  if ((dirname + path.sep + basename).length <= maxLength) {
    return slash(
      terminalStyles.dim(dirname + path.sep) + terminalStyles.bold(basename),
    );
  }

  // we can fit trimmed dirname and full basename
  const basenameLength = basename.length;
  if (basenameLength + 4 < maxLength) {
    const dirnameLength = maxLength - 4 - basenameLength;
    dirname =
      '...' + dirname.slice(dirname.length - dirnameLength, dirname.length);
    return slash(
      terminalStyles.dim(dirname + path.sep) + terminalStyles.bold(basename),
    );
  }

  if (basenameLength + 4 === maxLength) {
    return slash(
      terminalStyles.dim('...' + path.sep) + terminalStyles.bold(basename),
    );
  }

  // can't fit dirname, but can fit trimmed basename
  return slash(
    terminalStyles.bold(
      '...' + basename.slice(basename.length - maxLength - 4, basename.length),
    ),
  );
};

export const formatTestPath = (
  config: Config.GlobalConfig | Config.ProjectConfig,
  testPath: Config.Path,
) => {
  const {dirname, basename} = relativePath(config, testPath);
  return slash(
    terminalStyles.dim(dirname + path.sep) + terminalStyles.bold(basename),
  );
};

export const relativePath = (
  config: Config.GlobalConfig | Config.ProjectConfig,
  testPath: Config.Path,
) => {
  // this function can be called with ProjectConfigs or GlobalConfigs. GlobalConfigs
  // do not have config.cwd, only config.rootDir. Try using config.cwd, fallback
  // to config.rootDir. (Also, some unit just use config.rootDir, which is ok)
  testPath = path.relative(
    (config as Config.ProjectConfig).cwd || config.rootDir,
    testPath,
  );
  const dirname = path.dirname(testPath);
  const basename = path.basename(testPath);
  return {basename, dirname};
};

export const getSummary = (
  aggregatedResults: AggregatedResult,
  options?: SummaryOptions,
) => {
  let runTime = (Date.now() - aggregatedResults.startTime) / 1000;
  if (options && options.roundTime) {
    runTime = Math.floor(runTime);
  }

  const estimatedTime = (options && options.estimatedTime) || 0;
  const snapshotResults = aggregatedResults.snapshot;
  const snapshotsAdded = snapshotResults.added;
  const snapshotsFailed = snapshotResults.unmatched;
  const snapshotsOutdated = snapshotResults.unchecked;
  const snapshotsFilesRemoved = snapshotResults.filesRemoved;
  const snapshotsDidUpdate = snapshotResults.didUpdate;
  const snapshotsPassed = snapshotResults.matched;
  const snapshotsTotal = snapshotResults.total;
  const snapshotsUpdated = snapshotResults.updated;
  const suitesFailed = aggregatedResults.numFailedTestSuites;
  const suitesPassed = aggregatedResults.numPassedTestSuites;
  const suitesPending = aggregatedResults.numPendingTestSuites;
  const suitesRun = suitesFailed + suitesPassed;
  const suitesTotal = aggregatedResults.numTotalTestSuites;
  const testsFailed = aggregatedResults.numFailedTests;
  const testsPassed = aggregatedResults.numPassedTests;
  const testsPending = aggregatedResults.numPendingTests;
  const testsTodo = aggregatedResults.numTodoTests;
  const testsTotal = aggregatedResults.numTotalTests;
  const width = (options && options.width) || 0;

  const suites =
    terminalStyles.bold('Test Suites: ') +
    (suitesFailed
      ? terminalStyles.errorBold(`${suitesFailed} failed`) + ', '
      : '') +
    (suitesPending
      ? terminalStyles.warnBold(`${suitesPending} skipped`) + ', '
      : '') +
    (suitesPassed
      ? terminalStyles.bold.green(`${suitesPassed} passed`) + ', '
      : '') +
    (suitesRun !== suitesTotal
      ? suitesRun + ' of ' + suitesTotal
      : suitesTotal) +
    ` total`;

  const tests =
    terminalStyles.bold('Tests:       ') +
    (testsFailed
      ? terminalStyles.errorBold(`${testsFailed} failed`) + ', '
      : '') +
    (testsPending
      ? terminalStyles.warnBold(`${testsPending} skipped`) + ', '
      : '') +
    (testsTodo ? terminalStyles.bold.magenta(`${testsTodo} todo`) + ', ' : '') +
    (testsPassed
      ? terminalStyles.bold.green(`${testsPassed} passed`) + ', '
      : '') +
    `${testsTotal} total`;

  const snapshots =
    terminalStyles.bold('Snapshots:   ') +
    (snapshotsFailed
      ? terminalStyles.errorBold(`${snapshotsFailed} failed`) + ', '
      : '') +
    (snapshotsOutdated && !snapshotsDidUpdate
      ? terminalStyles.warnBold(`${snapshotsOutdated} obsolete`) + ', '
      : '') +
    (snapshotsOutdated && snapshotsDidUpdate
      ? terminalStyles.bold.green(`${snapshotsOutdated} removed`) + ', '
      : '') +
    (snapshotsFilesRemoved && !snapshotsDidUpdate
      ? terminalStyles.warnBold(
          pluralize('file', snapshotsFilesRemoved) + ' obsolete',
        ) + ', '
      : '') +
    (snapshotsFilesRemoved && snapshotsDidUpdate
      ? terminalStyles.bold.green(
          pluralize('file', snapshotsFilesRemoved) + ' removed',
        ) + ', '
      : '') +
    (snapshotsUpdated
      ? terminalStyles.bold.green(`${snapshotsUpdated} updated`) + ', '
      : '') +
    (snapshotsAdded
      ? terminalStyles.bold.green(`${snapshotsAdded} written`) + ', '
      : '') +
    (snapshotsPassed
      ? terminalStyles.bold.green(`${snapshotsPassed} passed`) + ', '
      : '') +
    `${snapshotsTotal} total`;

  const time = renderTime(runTime, estimatedTime, width);
  return [suites, tests, snapshots, time].join('\n');
};

const renderTime = (runTime: number, estimatedTime: number, width: number) => {
  // If we are more than one second over the estimated time, highlight it.
  const renderedTime =
    estimatedTime && runTime >= estimatedTime + 1
      ? terminalStyles.warnBold(runTime + 's')
      : runTime + 's';
  let time = terminalStyles.bold(`Time:`) + `        ${renderedTime}`;
  if (runTime < estimatedTime) {
    time += `, estimated ${estimatedTime}s`;
  }

  // Only show a progress bar if the test run is actually going to take
  // some time.
  if (estimatedTime > 2 && runTime < estimatedTime && width) {
    const availableWidth = Math.min(PROGRESS_BAR_WIDTH, width);
    const length = Math.min(
      Math.floor((runTime / estimatedTime) * availableWidth),
      availableWidth,
    );
    if (availableWidth >= 2) {
      time +=
        '\n' +
        terminalStyles.green('█').repeat(length) +
        terminalStyles.white('█').repeat(availableWidth - length);
    }
  }
  return time;
};

// word-wrap a string that contains ANSI escape sequences.
// ANSI escape sequences do not add to the string length.
export const wrapAnsiString = (string: string, terminalWidth: number) => {
  if (terminalWidth === 0) {
    // if the terminal width is zero, don't bother word-wrapping
    return string;
  }

  const ANSI_REGEXP = /[\u001b\u009b]\[\d{1,2}m/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = ANSI_REGEXP.exec(string))) {
    const ansi = match[0];
    const index = match['index'];
    if (index != lastIndex) {
      tokens.push(['string', string.slice(lastIndex, index)]);
    }
    tokens.push(['ansi', ansi]);
    lastIndex = index + ansi.length;
  }

  if (lastIndex != string.length - 1) {
    tokens.push(['string', string.slice(lastIndex, string.length)]);
  }

  let lastLineLength = 0;

  return tokens
    .reduce(
      (lines, [kind, token]) => {
        if (kind === 'string') {
          if (lastLineLength + token.length > terminalWidth) {
            while (token.length) {
              const chunk = token.slice(0, terminalWidth - lastLineLength);
              const remaining = token.slice(
                terminalWidth - lastLineLength,
                token.length,
              );
              lines[lines.length - 1] += chunk;
              lastLineLength += chunk.length;
              token = remaining;
              if (token.length) {
                lines.push('');
                lastLineLength = 0;
              }
            }
          } else {
            lines[lines.length - 1] += token;
            lastLineLength += token.length;
          }
        } else {
          lines[lines.length - 1] += token;
        }

        return lines;
      },
      [''],
    )
    .join('\n');
};
