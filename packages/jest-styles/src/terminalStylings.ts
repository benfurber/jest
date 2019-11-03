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

const level = stdout === false ? 0 : stdout.level;
const terminalStyles: any = new TerminalStyles({level});

export default terminalStyles;
