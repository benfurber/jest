import * as chalk from 'chalk';
import {stdout} from 'supports-color';

interface args {
  level: chalk.ColorSupport['level'];
}

export class TerminalStyles extends chalk.Instance {
  supportsColor: false | chalk.ColorSupport;

  constructor(args: args) {
    super();
    this.level = args.level;
    this.supportsColor = stdout;
  }
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
const terminalStyles: any = new TerminalStyles({level});

export default terminalStyles;
