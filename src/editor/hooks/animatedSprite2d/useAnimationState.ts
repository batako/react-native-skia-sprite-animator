/* eslint-disable jsdoc/require-jsdoc */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AnimatedSprite2DProps,
  AnimatedSpriteFrame,
  AnimatedSpriteFrameChangeEvent,
  SpriteFramesResource,
} from '../../animatedSprite2dTypes';
import { buildSequence, pickInitialAnimation, resolveFrameIndex } from './helpers';
import { useTicker } from './useTicker';

export interface UseAnimationStateOptions extends Omit<AnimatedSprite2DProps, 'style' | 'frames'> {
  frames: SpriteFramesResource;
}

export interface UseAnimationStateResult {
  animationName: string | null;
  setAnimationName: (name: string | null) => void;
  playing: boolean;
  setPlaying: (next: boolean) => void;
  sequence: number[];
  timelineCursor: number;
  setTimelineCursor: (cursor: number) => void;
  resetTimelineAccumulator: () => void;
  forcedFrameIndex: number | null;
  resolvedFrameIndex: number;
  currentFrame: AnimatedSpriteFrame | null;
}

export const useAnimationState = (options: UseAnimationStateOptions): UseAnimationStateResult => {
  const {
    frames,
    animation,
    autoplay,
    playing,
    frame,
    speedScale = 1,
    onAnimationFinished,
    onFrameChanged,
  } = options;

  const [internalAnimation, setInternalAnimation] = useState<string | null>(() =>
    pickInitialAnimation(frames, animation, autoplay),
  );
  const [internalPlaying, setInternalPlaying] = useState(true);
  const lastReportedFrame = useRef<number | null>(null);

  const resolvedAnimation = animation ?? internalAnimation;
  const sequence = useMemo(
    () => buildSequence(frames, resolvedAnimation),
    [frames, resolvedAnimation],
  );
  const forcedFrameIndex = resolveFrameIndex(frame, frames.frames.length);
  const resolvedPlaying =
    typeof forcedFrameIndex === 'number' ? false : (playing ?? internalPlaying);

  useEffect(() => {
    if (animation !== undefined) {
      setInternalAnimation(animation ?? null);
      return;
    }
    setInternalAnimation((prev) => prev ?? pickInitialAnimation(frames, undefined, autoplay));
  }, [animation, autoplay, frames]);

  useEffect(() => {
    if (autoplay === undefined) {
      return;
    }
    const nextValue = autoplay ?? null;
    if (frames.autoPlayAnimation !== nextValue) {
      frames.autoPlayAnimation = nextValue;
    }
  }, [autoplay, frames]);

  const haltPlayback = useCallback(() => {
    if (playing === undefined) {
      setInternalPlaying(false);
    }
  }, [playing]);

  const { cursor, setCursor, resetAccumulator } = useTicker({
    frames,
    sequence,
    animationName: resolvedAnimation,
    playing: resolvedPlaying,
    speedScale,
    forcedFrameIndex,
    onAnimationFinished,
    onPlaybackHalted: haltPlayback,
  });

  const sequenceFrameIndex = sequence.length
    ? (sequence[Math.min(cursor, sequence.length - 1)] ?? 0)
    : 0;
  const resolvedFrameIndex =
    typeof forcedFrameIndex === 'number' ? forcedFrameIndex : sequenceFrameIndex;
  const currentFrame = frames.frames[resolvedFrameIndex] ?? null;

  useEffect(() => {
    if (lastReportedFrame.current === resolvedFrameIndex) {
      return;
    }
    lastReportedFrame.current = resolvedFrameIndex;
    const payload: AnimatedSpriteFrameChangeEvent = {
      animationName: resolvedAnimation ?? null,
      frameIndex: resolvedFrameIndex,
    };
    onFrameChanged?.(payload);
  }, [onFrameChanged, resolvedAnimation, resolvedFrameIndex]);

  const setAnimationName = useCallback(
    (next: string | null) => {
      if (animation === undefined) {
        setInternalAnimation(next);
      }
    },
    [animation],
  );

  const setPlayingState = useCallback(
    (next: boolean) => {
      if (playing === undefined) {
        setInternalPlaying(next);
      }
    },
    [playing],
  );

  const setTimelineCursor = useCallback(
    (next: number) => {
      if (!sequence.length) {
        setCursor(0);
        resetAccumulator();
        return;
      }
      const clamped = Math.max(0, Math.min(sequence.length - 1, Math.floor(next)));
      setCursor(clamped);
      resetAccumulator();
    },
    [resetAccumulator, sequence.length, setCursor],
  );

  return {
    animationName: resolvedAnimation ?? null,
    setAnimationName,
    playing: resolvedPlaying,
    setPlaying: setPlayingState,
    sequence,
    timelineCursor: cursor,
    setTimelineCursor,
    resetTimelineAccumulator: resetAccumulator,
    forcedFrameIndex,
    resolvedFrameIndex,
    currentFrame,
  };
};
