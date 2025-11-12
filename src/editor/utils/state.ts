import type { SpriteAnimations, SpriteAnimationsMeta } from '../../SpriteAnimator';
import type { SpriteEditorFrame, SpriteEditorSnapshot, SpriteEditorState } from '../types';

/**
 * Generates a random identifier for newly created frames.
 */
export const createFrameId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `frame_${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Creates a shallow clone of a single frame.
 */
export const cloneFrame = (frame: SpriteEditorFrame): SpriteEditorFrame => ({
  ...frame,
});

/**
 * Clones every frame inside the provided array.
 */
export const cloneFrames = (frames: SpriteEditorFrame[]) => frames.map(cloneFrame);

/**
 * Deep-clones animation sequences.
 */
export const cloneAnimations = (animations: SpriteAnimations) => {
  const next: SpriteAnimations = {};
  Object.entries(animations).forEach(([name, sequence]) => {
    next[name] = Array.isArray(sequence) ? [...sequence] : [];
  });
  return next;
};

/**
 * Deep-clones animation metadata maps.
 */
export const cloneAnimationsMeta = (meta?: SpriteAnimationsMeta) => {
  if (!meta) return undefined;
  const next: SpriteAnimationsMeta = {};
  Object.entries(meta).forEach(([name, value]) => {
    next[name] = value ? { ...value } : {};
  });
  return next;
};

/**
 * Creates a detachable snapshot from the provided editor state.
 */
export const cloneSnapshot = (snapshot: SpriteEditorSnapshot): SpriteEditorSnapshot => ({
  frames: cloneFrames(snapshot.frames),
  animations: cloneAnimations(snapshot.animations),
  animationsMeta: cloneAnimationsMeta(snapshot.animationsMeta),
  selected: [...snapshot.selected],
  meta: { ...snapshot.meta },
});

/**
 * Derives a snapshot from the current editor state reference.
 */
export const snapshotFromState = (state: SpriteEditorState): SpriteEditorSnapshot => ({
  frames: cloneFrames(state.frames),
  animations: cloneAnimations(state.animations),
  animationsMeta: cloneAnimationsMeta(state.animationsMeta),
  selected: [...state.selected],
  meta: { ...state.meta },
});
