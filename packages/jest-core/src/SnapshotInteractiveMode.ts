/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {terminalStyles} from '@jest/styles';
import ansiEscapes = require('ansi-escapes');
import {AggregatedResult, AssertionLocation} from '@jest/test-result';
import {KEYS} from 'jest-watcher';
import {pluralize, specialChars} from 'jest-util';

const {ARROW, CLEAR} = specialChars;

export default class SnapshotInteractiveMode {
  private _pipe: NodeJS.WritableStream;
  private _isActive: boolean;
  private _updateTestRunnerConfig!: (
    assertion: AssertionLocation | null,
    shouldUpdateSnapshot: boolean,
  ) => unknown;
  private _testAssertions!: Array<AssertionLocation>;
  private _countPaths!: number;
  private _skippedNum: number;

  constructor(pipe: NodeJS.WritableStream) {
    this._pipe = pipe;
    this._isActive = false;
    this._skippedNum = 0;
  }

  isActive() {
    return this._isActive;
  }

  getSkippedNum() {
    return this._skippedNum;
  }

  private _clearTestSummary() {
    this._pipe.write(ansiEscapes.cursorUp(6));
    this._pipe.write(ansiEscapes.eraseDown);
  }

  private _drawUIProgress() {
    this._clearTestSummary();
    const numPass = this._countPaths - this._testAssertions.length;
    const numRemaining = this._countPaths - numPass - this._skippedNum;

    let stats = terminalStyles.bold.dim(
      pluralize('snapshot', numRemaining) + ' remaining',
    );
    if (numPass) {
      stats +=
        ', ' +
        terminalStyles.successBold(pluralize('snapshot', numPass) + ' updated');
    }
    if (this._skippedNum) {
      stats +=
        ', ' +
        terminalStyles.warnBold(
          pluralize('snapshot', this._skippedNum) + ' skipped',
        );
    }
    const messages = [
      '\n' + terminalStyles.bold('Interactive Snapshot Progress'),
      ARROW + stats,
      '\n' + terminalStyles.bold('Watch Usage'),

      terminalStyles.dim(ARROW + 'Press ') +
        'u' +
        terminalStyles.dim(' to update failing snapshots for this test.'),

      terminalStyles.dim(ARROW + 'Press ') +
        's' +
        terminalStyles.dim(' to skip the current test.'),

      terminalStyles.dim(ARROW + 'Press ') +
        'q' +
        terminalStyles.dim(' to quit Interactive Snapshot Mode.'),

      terminalStyles.dim(ARROW + 'Press ') +
        'Enter' +
        terminalStyles.dim(' to trigger a test run.'),
    ];

    this._pipe.write(messages.filter(Boolean).join('\n') + '\n');
  }

  private _drawUIDoneWithSkipped() {
    this._pipe.write(CLEAR);
    const numPass = this._countPaths - this._testAssertions.length;

    let stats = terminalStyles.bold.dim(
      pluralize('snapshot', this._countPaths) + ' reviewed',
    );
    if (numPass) {
      stats +=
        ', ' +
        terminalStyles.successBold(pluralize('snapshot', numPass) + ' updated');
    }
    if (this._skippedNum) {
      stats +=
        ', ' +
        terminalStyles.warnBold(
          pluralize('snapshot', this._skippedNum) + ' skipped',
        );
    }
    const messages = [
      '\n' + terminalStyles.bold('Interactive Snapshot Result'),
      ARROW + stats,
      '\n' + terminalStyles.bold('Watch Usage'),

      terminalStyles.dim(ARROW + 'Press ') +
        'r' +
        terminalStyles.dim(' to restart Interactive Snapshot Mode.'),

      terminalStyles.dim(ARROW + 'Press ') +
        'q' +
        terminalStyles.dim(' to quit Interactive Snapshot Mode.'),
    ];

    this._pipe.write(messages.filter(Boolean).join('\n') + '\n');
  }

  private _drawUIDone() {
    this._pipe.write(CLEAR);
    const numPass = this._countPaths - this._testAssertions.length;

    let stats = terminalStyles.bold.dim(
      pluralize('snapshot', this._countPaths) + ' reviewed',
    );
    if (numPass) {
      stats +=
        ', ' +
        terminalStyles.successBold(pluralize('snapshot', numPass) + ' updated');
    }
    const messages = [
      '\n' + terminalStyles.bold('Interactive Snapshot Result'),
      ARROW + stats,
      '\n' + terminalStyles.bold('Watch Usage'),

      terminalStyles.dim(ARROW + 'Press ') +
        'Enter' +
        terminalStyles.dim(' to return to watch mode.'),
    ];

    this._pipe.write(messages.filter(Boolean).join('\n') + '\n');
  }

  private _drawUIOverlay() {
    if (this._testAssertions.length === 0) {
      return this._drawUIDone();
    }

    if (this._testAssertions.length - this._skippedNum === 0) {
      return this._drawUIDoneWithSkipped();
    }

    return this._drawUIProgress();
  }

  put(key: string) {
    switch (key) {
      case 's':
        if (this._skippedNum === this._testAssertions.length) break;
        this._skippedNum += 1;

        // move skipped test to the end
        this._testAssertions.push(this._testAssertions.shift()!);
        if (this._testAssertions.length - this._skippedNum > 0) {
          this._run(false);
        } else {
          this._drawUIDoneWithSkipped();
        }

        break;
      case 'u':
        this._run(true);
        break;
      case 'q':
      case KEYS.ESCAPE:
        this.abort();
        break;
      case 'r':
        this.restart();
        break;
      case KEYS.ENTER:
        if (this._testAssertions.length === 0) {
          this.abort();
        } else {
          this._run(false);
        }
        break;
      default:
        break;
    }
  }

  abort() {
    this._isActive = false;
    this._skippedNum = 0;
    this._updateTestRunnerConfig(null, false);
  }

  restart() {
    this._skippedNum = 0;
    this._countPaths = this._testAssertions.length;
    this._run(false);
  }

  updateWithResults(results: AggregatedResult) {
    const hasSnapshotFailure = !!results.snapshot.failure;
    if (hasSnapshotFailure) {
      this._drawUIOverlay();
      return;
    }

    this._testAssertions.shift();
    if (this._testAssertions.length - this._skippedNum === 0) {
      this._drawUIOverlay();
      return;
    }

    // Go to the next test
    this._run(false);
  }

  private _run(shouldUpdateSnapshot: boolean) {
    const testAssertion = this._testAssertions[0];
    this._updateTestRunnerConfig(testAssertion, shouldUpdateSnapshot);
  }

  run(
    failedSnapshotTestAssertions: Array<AssertionLocation>,
    onConfigChange: (
      assertion: AssertionLocation | null,
      shouldUpdateSnapshot: boolean,
    ) => unknown,
  ) {
    if (!failedSnapshotTestAssertions.length) {
      return;
    }

    this._testAssertions = [...failedSnapshotTestAssertions];
    this._countPaths = this._testAssertions.length;
    this._updateTestRunnerConfig = onConfigChange;
    this._isActive = true;
    this._run(false);
  }
}
