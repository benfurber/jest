import {Config} from '@jest/types';
import * as chalkTypes from 'chalk';

export type levelType = chalkTypes.ColorSupport['level'];

export interface settingsType {
  level: levelType;
  colors?: Config.terminalColors;
}
