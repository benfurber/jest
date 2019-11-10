import {stdout} from 'supports-color';
import {settingsType} from './types';

export function setLevel() {
  const config = require('../../../jest.config');
  const styleTerminalOption = config.styleTerminal;
  const defaultOption = stdout === false ? 0 : stdout.level;

  const settings: settingsType = {
    level: defaultOption,
  };

  if (styleTerminalOption === false && styleTerminalOption !== undefined) {
    settings.level = 0;
  }

  return settings;
}
