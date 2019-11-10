import {stdout} from 'supports-color';
import {Config} from '@jest/types';
import {settingsType} from './types';

type terminalStylesType = Config.ProjectConfig['styleTerminal'];

const config = require('../../../jest.config');
const styleTerminalOption: terminalStylesType = config.styleTerminal;

const defaultOption = stdout === false ? 0 : stdout.level;

export function setSettings() {
  const settings: settingsType = {
    level: defaultOption,
  };

  if (styleTerminalOption === false && styleTerminalOption !== undefined) {
    settings.level = 0;
  }

  if (typeof styleTerminalOption === 'object') {
    settings.colors = styleTerminalOption;
  }

  return settings;
}
