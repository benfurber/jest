import chalk from 'chalk';
import {TerminalStyles} from '../terminalStylings';

describe('terminalStyles', () => {
  describe('when terminal level is set to 3', () => {
    const args = {level: 3};

    it('can be called like chalk', () => {
      const terminalStyles = new TerminalStyles(args);
      const call = terminalStyles.bold('word');

      const chalkInstance = new chalk.Instance(args);
      const expectation = chalkInstance.bold('word');

      expect(call).toEqual(expectation);
    });
  });

  describe('when terminal level is set to 0', () => {
    const args = {level: 0};

    it('can be called like chalk', () => {
      const terminalStyles = new TerminalStyles(args);
      const call = terminalStyles.bold('word');

      const chalkInstance = new chalk.Instance(args);
      const expectation = chalkInstance.bold('word');

      expect(call).toEqual(expectation);
    });
  });
});
