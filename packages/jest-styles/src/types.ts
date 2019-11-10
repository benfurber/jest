import {Config} from '@jest/types';
import * as chalkTypes from 'chalk';

export interface colorsType {
  error: Config.DisplayNameColor;
  highlight: Config.DisplayNameColor;
  message: Config.DisplayNameColor;
  success: Config.DisplayNameColor;
  warn: Config.DisplayNameColor;
}

export type levelType = chalkTypes.ColorSupport['level'];

export interface settingsType {
  level: levelType;
  colors?: colorsType;
}
