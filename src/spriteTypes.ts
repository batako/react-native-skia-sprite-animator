/* eslint-disable jsdoc/require-jsdoc */
/** Shared sprite data types for sprites and animations. */
export interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
  duration?: number;
  imageUri?: string;
}

export type SpriteAnimations = Record<string, number[]>;

export interface SpriteAnimationMeta {
  loop?: boolean;
  fps?: number;
  multipliers?: number[];
}

export type SpriteAnimationsMeta = Record<string, SpriteAnimationMeta>;

export interface SpriteDataMeta {
  displayName?: string;
  origin?: { x: number; y: number };
  [key: string]: unknown;
}

export interface SpriteData {
  frames: SpriteFrame[];
  animations?: SpriteAnimations;
  animationsMeta?: SpriteAnimationsMeta;
  meta?: SpriteDataMeta;
  autoPlayAnimation?: string | null;
}

export type PlaybackDirection = 'forward' | 'reverse';

export interface AnimationPlayOptions {
  fromFrame?: number;
  speedScale?: number;
  direction?: PlaybackDirection;
}

export interface AnimationFrameChangeEvent {
  animationName: string | null;
  frameIndex: number;
  frameCursor: number;
}

export interface SetFrameOptions {
  animationName?: string | null;
}

export interface AnimationHandle {
  play: (name?: string | null, opts?: AnimationPlayOptions) => void;
  pause: () => void;
  stop: () => void;
  setFrame: (frameIndex: number, options?: SetFrameOptions) => void;
}
