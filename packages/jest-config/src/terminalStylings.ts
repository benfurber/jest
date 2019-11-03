import * as chalk from 'chalk';

class TerminalStyles extends chalk.Instance {
  supportsColor(): false | chalk.ColorSupport {
    return chalk.supportsColor;
  }
}
const terminalStyles = new TerminalStyles();

export default terminalStyles;
