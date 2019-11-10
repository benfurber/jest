import chalk from 'chalk';
import {TerminalStyles} from '../terminalStylings';

describe('terminalStyles', () => {
  describe('when terminal level is set to 3', () => {
    const args = {level: 3};
    const terminalStyles = new TerminalStyles(args);
    const chalkInstance = new chalk.Instance(args);

    it('can be called like chalk', () => {
      const call = terminalStyles.bold('word');
      const expectation = chalkInstance.bold('word');

      expect(call).toEqual(expectation);
    });

    it('calls error() correctly', () => {
      const call = terminalStyles.error(`There's a problem`);
      const expectation = chalkInstance.red(`There's a problem`);

      expect(call).toEqual(expectation);
    });

    it('calls errorBold() correctly', () => {
      const call = terminalStyles.errorBold(`There's a BOLD problem`);
      const expectation = chalkInstance.bold.red(`There's a BOLD problem`);

      expect(call).toEqual(expectation);
    });

    it('calls errorBanner() correctly', () => {
      const call = terminalStyles.errorBanner(`There's a very big problem`);
      const expectation = chalkInstance.reset.inverse.bold.red(
        `There's a very big problem`,
      );

      expect(call).toEqual(expectation);
    });

    it('calls message() correctly', () => {
      const call = terminalStyles.message(`Note this.`);
      const expectation = chalkInstance.magenta(`Note this.`);

      expect(call).toEqual(expectation);
    });

    it('calls success() correctly', () => {
      const call = terminalStyles.success(`Successful`);
      const expectation = chalkInstance.green(`Successful`);

      expect(call).toEqual(expectation);
    });

    it('calls successBold() correctly', () => {
      const call = terminalStyles.successBold(`This went well`);
      const expectation = chalkInstance.bold.green(`This went well`);

      expect(call).toEqual(expectation);
    });

    it('calls successBanner() correctly', () => {
      const call = terminalStyles.successBanner(`Perfect!`);
      const expectation = chalkInstance.reset.inverse.bold.green(`Perfect!`);

      expect(call).toEqual(expectation);
    });

    it('calls warn() correctly', () => {
      const call = terminalStyles.warn(`This is a warning`);
      const expectation = chalkInstance.yellow(`This is a warning`);

      expect(call).toEqual(expectation);
    });

    it('calls warnBold() correctly', () => {
      const call = terminalStyles.warnBold(`This is a bold warning`);
      const expectation = chalkInstance.bold.yellow(`This is a bold warning`);

      expect(call).toEqual(expectation);
    });

    it('calls warnBanner() correctly', () => {
      const call = terminalStyles.warnBanner(`Running`);
      const expectation = chalkInstance.reset.inverse.bold.yellow(`Running`);

      expect(call).toEqual(expectation);
    });
  });

  describe('when terminal level is set to 0', () => {
    const args = {level: 0};
    const terminalStyles = new TerminalStyles(args);
    const chalkInstance = new chalk.Instance(args);

    it('can be called like chalk', () => {
      const call = terminalStyles.bold('word');
      const expectation = chalkInstance.bold('word');

      expect(call).toEqual(expectation);
    });

    it('calls error() correctly', () => {
      const call = terminalStyles.error(`There's a problem`);
      const expectation = chalkInstance.red(`There's a problem`);

      expect(call).toEqual(expectation);
    });

    it('calls errorBold() correctly', () => {
      const call = terminalStyles.errorBold(`There's a BOLD problem`);
      const expectation = chalkInstance.bold.red(`There's a BOLD problem`);

      expect(call).toEqual(expectation);
    });

    it('calls errorBanner() correctly', () => {
      const call = terminalStyles.errorBanner(`There's a very big problem`);
      const expectation = chalkInstance.reset.inverse.bold.red(
        `There's a very big problem`,
      );

      expect(call).toEqual(expectation);
    });

    it('calls message() correctly', () => {
      const call = terminalStyles.message(`Note this.`);
      const expectation = chalkInstance.magenta(`Note this.`);

      expect(call).toEqual(expectation);
    });

    it('calls success() correctly', () => {
      const call = terminalStyles.success(`Successful`);
      const expectation = chalkInstance.green(`Successful`);

      expect(call).toEqual(expectation);
    });

    it('calls successBold() correctly', () => {
      const call = terminalStyles.successBold(`This went well`);
      const expectation = chalkInstance.bold.green(`This went well`);

      expect(call).toEqual(expectation);
    });

    it('calls successBanner() correctly', () => {
      const call = terminalStyles.successBanner(`Perfect!`);
      const expectation = chalkInstance.reset.inverse.bold.green(`Perfect!`);

      expect(call).toEqual(expectation);
    });

    it('calls warn() correctly', () => {
      const call = terminalStyles.warn(`This is a warning`);
      const expectation = chalkInstance.yellow(`This is a warning`);

      expect(call).toEqual(expectation);
    });

    it('calls warnBold() correctly', () => {
      const call = terminalStyles.warnBold(`This is a bold warning`);
      const expectation = chalkInstance.bold.yellow(`This is a bold warning`);

      expect(call).toEqual(expectation);
    });

    it('calls warnBanner() correctly', () => {
      const call = terminalStyles.warnBanner(`Running`);
      const expectation = chalkInstance.reset.inverse.bold.yellow(`Running`);

      expect(call).toEqual(expectation);
    });
  });
});
