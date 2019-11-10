import chalk = require('chalk');
import {Config} from '@jest/types';
import * as chalkTypes from 'chalk';
import {stdout} from 'supports-color';
import {levelType, settingsType} from './types';

const defaultColors: Config.terminalColors = {
  error: 'red',
  highlight: 'cyan',
  message: 'magenta',
  success: 'green',
  warn: 'yellow',
};

export class TerminalStyles extends chalk.Instance {
  colors: Config.terminalColors;
  level: levelType;
  supportsColor: false | chalkTypes.ColorSupport;
  chalk: chalkTypes.Chalk;

  constructor(args: settingsType) {
    super();
    this.colors = args.colors || defaultColors;
    this.level = args.level;
    this.supportsColor = stdout;
    this.chalk = new chalk.Instance({level: this.level});
  }

  error = (string: string) => this.chalk[this.colors.error](string);
  errorBold = (string: string) => this.chalk.bold[this.colors.error](string);
  errorBanner = (string: string) =>
    this.chalk.reset.inverse.bold[this.colors.error](string);

  highlight = (string: string) => this.chalk[this.colors.highlight](string);

  message = (string: string) => this.chalk[this.colors.message](string);

  success = (string: string) => this.chalk[this.colors.success](string);
  successBold = (string: string) =>
    this.chalk.bold[this.colors.success](string);
  successBanner = (string: string) =>
    this.chalk.reset.inverse.bold[this.colors.success](string);

  warn = (string: string) => this.chalk[this.colors.warn](string);
  warnBold = (string: string) => this.chalk.bold[this.colors.warn](string);
  warnBanner = (string: string) =>
    this.chalk.reset.inverse.bold[this.colors.warn](string);
}
