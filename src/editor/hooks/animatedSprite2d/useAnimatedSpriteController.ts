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
  scale: number;
}

export type AnimatedSpriteControllerOptions = Omit<AnimatedSprite2DProps, 'style'> & {
  frames: AnimatedSprite2DProps['frames'];
};

const computeDrawOrigin = (
  currentFrame: AnimatedSpriteFrame | null,
  canvasSize: { width: number; height: number },
  centered: boolean,
  scale: number,
  offset?: { x: number; y: number } | null,
) => {
  if (!currentFrame) {
    return { x: 0, y: 0 };
  }
  const scaledWidth = currentFrame.width * scale;
  const scaledHeight = currentFrame.height * scale;
  const baseX = centered ? (canvasSize.width - scaledWidth) / 2 : 0;
  const baseY = centered ? (canvasSize.height - scaledHeight) / 2 : 0;
  return {
    x: baseX + ((currentFrame.offset?.x ?? 0) + (offset?.x ?? 0)) * scale,
    y: baseY + ((currentFrame.offset?.y ?? 0) + (offset?.y ?? 0)) * scale,
  };
};

export const useAnimatedSpriteController = (
  options: AnimatedSpriteControllerOptions,
): AnimatedSpriteControllerResult => {
  const { frames, centered = true, offset, scale: scaleProp } = options;
  const scale =
    typeof scaleProp === 'number' && Number.isFinite(scaleProp) && scaleProp > 0 ? scaleProp : 1;
  const animationState = useAnimationState(options);
  const bounds = useSceneBounds(frames.frames);
  const canvasSize = useMemo(() => {
    const baseWidth =
      centered && bounds.width > 0
        ? bounds.width
        : (animationState.currentFrame?.width ?? bounds.width);
    const baseHeight =
      centered && bounds.height > 0
        ? bounds.height
        : (animationState.currentFrame?.height ?? bounds.height);
    return { width: baseWidth * scale, height: baseHeight * scale };
  }, [animationState.currentFrame, bounds.height, bounds.width, centered, scale]);
  const frameImage = useFrameCache(animationState.currentFrame);
  const drawOrigin = useMemo(
    () => computeDrawOrigin(animationState.currentFrame, canvasSize, centered, scale, offset),
    [animationState.currentFrame, canvasSize, centered, offset, scale],
  );

  return {
    ...animationState,
    frameImage,
    canvasSize,
    drawOrigin,
    scale,
  };
};
