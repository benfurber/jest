import chalk = require('chalk');
import * as chalkTypes from 'chalk';
import {stdout} from 'supports-color';
import {Config} from '@jest/types';

interface args {
  colors?: colors;
  level: chalkTypes.ColorSupport['level'];
}

interface colors {
  error: Config.DisplayNameColor;
  highlight: Config.DisplayNameColor;
  message: Config.DisplayNameColor;
  success: Config.DisplayNameColor;
  warn: Config.DisplayNameColor;
}

const defaultColors: colors = {
  error: 'magenta',
  highlight: 'cyan',
  message: 'magenta',
  success: 'magenta',
  warn: 'magenta',
};

export class TerminalStyles extends chalk.Instance {
  colors: colors;
  level: chalkTypes.ColorSupport['level'];
  supportsColor: false | chalkTypes.ColorSupport;
  chalk: chalkTypes.Chalk;

  constructor(args: args) {
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
