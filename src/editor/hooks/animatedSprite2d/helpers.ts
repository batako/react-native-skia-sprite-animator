/* eslint-disable jsdoc/require-jsdoc */
import type { AnimatedSpriteFrame, SpriteFramesResource } from '../../animatedSprite2dTypes';

export const DEFAULT_FPS = 12;
const DEFAULT_FRAME_DURATION = 1000 / DEFAULT_FPS;
export const MIN_SPEED_SCALE = 0.01;
export const MAX_SPEED_SCALE = 32;
const MIN_FRAME_DURATION = 1;
const MIN_TIMELINE_MULTIPLIER = 0.01;

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const pickInitialAnimation = (
  frames: SpriteFramesResource,
  animationProp?: string | null,
  autoplayProp?: string | null,
): string | null => {
  if (typeof animationProp === 'string') {
    return animationProp;
  }
  if (typeof autoplayProp === 'string') {
    return autoplayProp;
  }
  if (typeof frames.autoPlayAnimation === 'string') {
    return frames.autoPlayAnimation;
  }
  const names = Object.keys(frames.animations ?? {});
  return names.length ? names[0]! : null;
};

export const buildSequence = (frames: SpriteFramesResource, animationName: string | null) => {
  if (animationName && frames.animations?.[animationName]?.length) {
    return frames.animations[animationName] ?? [];
  }
  return frames.frames.map((_, index) => index);
};

export const resolveFrameIndex = (value: number | null | undefined, maxFrames: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return clamp(Math.floor(value), 0, Math.max(0, maxFrames - 1));
};

export const computeFrameDuration = (
  frame: AnimatedSpriteFrame | undefined,
  animationName: string | null,
  timelineIndex: number,
  frames: SpriteFramesResource,
  speedScale: number,
) => {
  const safeSpeed = clamp(speedScale, MIN_SPEED_SCALE, MAX_SPEED_SCALE);
  if (!frame) {
    return DEFAULT_FRAME_DURATION / safeSpeed;
  }
  if (typeof frame.duration === 'number' && Number.isFinite(frame.duration)) {
    return clamp(frame.duration, MIN_FRAME_DURATION, Number.MAX_SAFE_INTEGER) / safeSpeed;
  }
  const fpsValue = frames.animationsMeta?.[animationName ?? '']?.fps;
  const normalizedFps = typeof fpsValue === 'number' && fpsValue > 0 ? fpsValue : DEFAULT_FPS;
  const multipliers = frames.animationsMeta?.[animationName ?? '']?.multipliers ?? [];
  const multiplier = clamp(multipliers[timelineIndex] ?? 1, MIN_TIMELINE_MULTIPLIER, 100);
  const baseDuration = 1000 / normalizedFps;
  return (baseDuration * multiplier) / safeSpeed;
};

export const computeSceneBounds = (frames: AnimatedSpriteFrame[]) =>
  frames.reduce(
    (acc, frame) => ({
      width: Math.max(acc.width, frame.width),
      height: Math.max(acc.height, frame.height),
    }),
    { width: 0, height: 0 },
  );
