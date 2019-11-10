/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {AssertionError} from 'assert';
import {Circus} from '@jest/types';
import {
  DiffOptions,
  diff,
  printExpected,
  printReceived,
} from 'jest-matcher-utils';
import {terminalStyles} from '@jest/styles';
import prettyFormat = require('pretty-format');

interface AssertionErrorWithStack extends AssertionError {
  stack: string;
}

const assertOperatorsMap: Record<string, string> = {
  '!=': 'notEqual',
  '!==': 'notStrictEqual',
  '==': 'equal',
  '===': 'strictEqual',
};

const humanReadableOperators: Record<string, string> = {
  deepEqual: 'to deeply equal',
  deepStrictEqual: 'to deeply and strictly equal',
  equal: 'to be equal',
  notDeepEqual: 'not to deeply equal',
  notDeepStrictEqual: 'not to deeply and strictly equal',
  notEqual: 'to not be equal',
  notStrictEqual: 'not be strictly equal',
  strictEqual: 'to strictly be equal',
};

const formatNodeAssertErrors = (event: Circus.Event, state: Circus.State) => {
  switch (event.name) {
    case 'test_done': {
      event.test.errors = event.test.errors.map((errors: Circus.TestError) => {
        let error;
        if (Array.isArray(errors)) {
          const [originalError, asyncError] = errors;

          if (originalError == null) {
            error = asyncError;
          } else if (!originalError.stack) {
            error = asyncError;

            error.message = originalError.message
              ? originalError.message
              : `thrown: ${prettyFormat(originalError, {maxDepth: 3})}`;
          } else {
            error = originalError;
          }
        } else {
          error = errors;
        }
        return isAssertionError(error)
          ? {message: assertionErrorMessage(error, {expand: state.expand})}
          : errors;
      });
    }
  }
};

const getOperatorName = (operator: string | undefined, stack: string) => {
  if (typeof operator === 'string') {
    return assertOperatorsMap[operator] || operator;
  }
  if (stack.match('.doesNotThrow')) {
    return 'doesNotThrow';
  }
  if (stack.match('.throws')) {
    return 'throws';
  }
  return '';
};

const operatorMessage = (operator: string | undefined) => {
  const niceOperatorName = getOperatorName(operator, '');
  const humanReadableOperator = humanReadableOperators[niceOperatorName];

  return typeof operator === 'string'
    ? `${humanReadableOperator || niceOperatorName} to:\n`
    : '';
};

const assertThrowingMatcherHint = (operatorName: string) =>
  operatorName
    ? terminalStyles.dim('assert') +
      terminalStyles.dim('.' + operatorName + '(') +
      terminalStyles.error('function') +
      terminalStyles.dim(')')
    : '';

const assertMatcherHint = (
  operator: string | undefined | null,
  operatorName: string,
  expected: unknown,
) => {
  let message = '';

  if (operator === '==' && expected === true) {
    message =
      terminalStyles.dim('assert') +
      terminalStyles.dim('(') +
      terminalStyles.error('received') +
      terminalStyles.dim(')');
  } else if (operatorName) {
    message =
      terminalStyles.dim('assert') +
      terminalStyles.dim('.' + operatorName + '(') +
      terminalStyles.error('received') +
      terminalStyles.dim(', ') +
      terminalStyles.success('expected') +
      terminalStyles.dim(')');
  }

  return message;
};

function assertionErrorMessage(
  error: AssertionErrorWithStack,
  options: DiffOptions,
) {
  const {expected, actual, generatedMessage, message, operator, stack} = error;
  const diffString = diff(expected, actual, options);
  const hasCustomMessage = !generatedMessage;
  const operatorName = getOperatorName(operator, stack);
  const trimmedStack = stack
    .replace(message, '')
    .replace(/AssertionError(.*)/g, '');

  if (operatorName === 'doesNotThrow') {
    return (
      buildHintString(assertThrowingMatcherHint(operatorName)) +
      terminalStyles.reset(`Expected the function not to throw an error.\n`) +
      terminalStyles.reset(`Instead, it threw:\n`) +
      `  ${printReceived(actual)}` +
      terminalStyles.reset(
        hasCustomMessage ? '\n\nMessage:\n  ' + message : '',
      ) +
      trimmedStack
    );
  }

  if (operatorName === 'throws') {
    return (
      buildHintString(assertThrowingMatcherHint(operatorName)) +
      terminalStyles.reset(`Expected the function to throw an error.\n`) +
      terminalStyles.reset(`But it didn't throw anything.`) +
      terminalStyles.reset(
        hasCustomMessage ? '\n\nMessage:\n  ' + message : '',
      ) +
      trimmedStack
    );
  }

  return (
    buildHintString(assertMatcherHint(operator, operatorName, expected)) +
    terminalStyles.reset(`Expected value ${operatorMessage(operator)}`) +
    `  ${printExpected(expected)}\n` +
    terminalStyles.reset(`Received:\n`) +
    `  ${printReceived(actual)}` +
    terminalStyles.reset(hasCustomMessage ? '\n\nMessage:\n  ' + message : '') +
    (diffString ? `\n\nDifference:\n\n${diffString}` : '') +
    trimmedStack
  );
}

function isAssertionError(
  error: Circus.TestError,
): error is AssertionErrorWithStack {
  return (
    error &&
    (error instanceof AssertionError ||
      error.name === AssertionError.name ||
      error.code === 'ERR_ASSERTION')
  );
}

function buildHintString(hint: string) {
  return hint ? hint + '\n\n' : '';
}

export default formatNodeAssertErrors;
