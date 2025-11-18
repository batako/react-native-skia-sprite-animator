/* eslint-disable jsdoc/require-jsdoc */
import { useMemo } from 'react';
import type { AnimatedSprite2DProps, AnimatedSpriteFrame } from '../../animatedSprite2dTypes';
import { useFrameCache } from './useFrameCache';
import { useSceneBounds } from './useSceneBounds';
import { useAnimationState, type UseAnimationStateResult } from './useAnimationState';

export interface AnimatedSpriteControllerResult extends UseAnimationStateResult {
  frameImage: ReturnType<typeof useFrameCache>;
  canvasSize: { width: number; height: number };
  drawOrigin: { x: number; y: number };
}

export type AnimatedSpriteControllerOptions = Omit<AnimatedSprite2DProps, 'style'> & {
  frames: AnimatedSprite2DProps['frames'];
};

const computeDrawOrigin = (
  currentFrame: AnimatedSpriteFrame | null,
  canvasSize: { width: number; height: number },
  centered: boolean,
  offset?: { x: number; y: number } | null,
) => {
  if (!currentFrame) {
    return { x: 0, y: 0 };
  }
  const baseX = centered ? (canvasSize.width - currentFrame.width) / 2 : 0;
  const baseY = centered ? (canvasSize.height - currentFrame.height) / 2 : 0;
  return {
    x: baseX + (currentFrame.offset?.x ?? 0) + (offset?.x ?? 0),
    y: baseY + (currentFrame.offset?.y ?? 0) + (offset?.y ?? 0),
  };
};

export const useAnimatedSpriteController = (
  options: AnimatedSpriteControllerOptions,
): AnimatedSpriteControllerResult => {
  const { frames, centered = true, offset } = options;
  const animationState = useAnimationState(options);
  const bounds = useSceneBounds(frames.frames);
  const canvasSize = useMemo(() => {
    if (centered) {
      return bounds;
    }
    return {
      width: animationState.currentFrame?.width ?? bounds.width,
      height: animationState.currentFrame?.height ?? bounds.height,
    };
  }, [animationState.currentFrame, bounds, centered]);
  const frameImage = useFrameCache(animationState.currentFrame);
  const drawOrigin = useMemo(
    () => computeDrawOrigin(animationState.currentFrame, canvasSize, centered, offset),
    [animationState.currentFrame, canvasSize, centered, offset],
  );

  return {
    ...animationState,
    frameImage,
    canvasSize,
    drawOrigin,
  };
};
