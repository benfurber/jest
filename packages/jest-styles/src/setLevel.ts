import {stdout} from 'supports-color';

export function setLevel() {
  const config = require('../../../jest.config');
  const styleTerminalOption = config.styleTerminal;

  if (styleTerminalOption === false && styleTerminalOption !== undefined) {
    return 0;
  }

  const defaultOption = stdout === false ? 0 : stdout.level;
  return defaultOption;
}
