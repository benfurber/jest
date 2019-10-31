import chalk from 'chalk';
import {terminalStyles} from '../index';

describe('terminalStyles', () => {
  it('can be called like chalk', () => {
    const call = terminalStyles.bold('word');
    const expectation = chalk.bold('word');

    expect(call).toEqual(expectation);
  });
});
