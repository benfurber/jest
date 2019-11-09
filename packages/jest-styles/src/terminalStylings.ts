import chalk = require('chalk');
import * as chalkTypes from 'chalk';
import {stdout} from 'supports-color';

interface args {
  colors?: colors;
  level: chalkTypes.ColorSupport['level'];
}

interface colors {
  error: color;
  success: color;
  warn: color;
}

const defaultColors: colors = {
  error: 'red',
  success: 'green',
  warn: 'yellow',
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

  success = (string: string) => this.chalk[this.colors.success](string);
  successBold = (string: string) =>
    this.chalk.bold[this.colors.success](string);
  successBanner = (string: string) =>
    this.chalk.reset.inverse.bold[this.colors.success](string);

  warn = (string: string) => this.chalk[this.colors.warn](string);
  warnBold = (string: string) => this.chalk.bold[this.colors.warn](string);
}

function setLevel() {
  const config = require('../../../jest.config');
  const styleTerminalOption = config.styleTerminal;

  if (styleTerminalOption === false && styleTerminalOption !== undefined) {
    return 0;
  }

  const defaultOption = stdout === false ? 0 : stdout.level;
  return defaultOption;
}

const level = setLevel();
const terminalStyles = new TerminalStyles({level});

// Duplication of chalk's private color types.
declare type color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | 'blackBright'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright';

export default terminalStyles;
