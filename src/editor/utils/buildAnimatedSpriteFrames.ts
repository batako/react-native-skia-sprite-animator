/* eslint-disable jsdoc/require-jsdoc */
import type { SpriteEditorState } from '../types';
import type {
  AnimatedSpriteFrame,
  FrameImageSource,
  SpriteAnimationsMap,
  SpriteAnimationsMetaMap,
  SpriteFramesResource,
} from '../animatedSprite2dTypes';

const buildFrameImageSource = (uri: string | undefined): FrameImageSource | null => {
  if (typeof uri === 'string' && uri.length > 0) {
    return { type: 'uri', uri };
  }
  return null;
};

export const buildAnimatedSpriteFrames = (
  state: SpriteEditorState,
): SpriteFramesResource | null => {
  const animations: SpriteAnimationsMap = state.animations ?? {};
  const frames: AnimatedSpriteFrame[] = [];
  for (let i = 0; i < state.frames.length; i += 1) {
    const frame = state.frames[i]!;
    const source = buildFrameImageSource(frame.imageUri);
    if (!source) {
      return null;
    }
    frames.push({
      id: frame.id,
      width: frame.w,
      height: frame.h,
      x: frame.x,
      y: frame.y,
      duration: frame.duration,
      image: source,
    });
  }
  const animationsMeta = state.animationsMeta as SpriteAnimationsMetaMap | undefined;
  return {
    frames,
    animations,
    animationsMeta,
    autoPlayAnimation: state.autoPlayAnimation ?? null,
    meta: state.meta,
  };
};
