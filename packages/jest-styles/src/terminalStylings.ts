import chalk = require('chalk');
import * as chalkTypes from 'chalk';
import {stdout} from 'supports-color';

interface args {
  level: chalkTypes.ColorSupport['level'];
}

export class TerminalStyles extends chalk.Instance {
  level: chalkTypes.ColorSupport['level'];
  supportsColor: false | any;
  chalk: chalkTypes.Chalk;

  constructor(args: args) {
    super();
    this.level = args.level;
    this.supportsColor = stdout;
    this.chalk = new chalk.Instance({level: this.level});
  }

  error = (string: string) => this.chalk.red(string);
  errorBold = (string: string) => this.chalk.bold.red(string);
  errorBanner = (string: string) => this.chalk.reset.inverse.bold.red(string);

  warn = (string: string) => this.chalk.yellow(string);
  warnBold = (string: string) => this.chalk.bold.yellow(string);
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

export default terminalStyles;
