/* eslint-disable jsdoc/require-jsdoc */
import { useMemo } from 'react';
import type { AnimatedSpriteFrame } from '../../animatedSprite2dTypes';
import { computeSceneBounds } from './helpers';

export interface SceneBounds {
  width: number;
  height: number;
}

export const useSceneBounds = (frames: AnimatedSpriteFrame[]): SceneBounds => {
  return useMemo(() => computeSceneBounds(frames), [frames]);
};
