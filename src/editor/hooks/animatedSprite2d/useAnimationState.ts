/* eslint-disable jsdoc/require-jsdoc */
import { useCallback, useEffect, useMemo } from 'react';
import type {
  AnimatedSprite2DProps,
  AnimatedSpriteFrame,
  SpriteFramesResource,
} from '../../animatedSprite2dTypes';
import { pickInitialAnimation, resolveFrameIndex } from './helpers';
import { useSpriteAnimationTicker } from '../../../hooks/useSpriteAnimationTicker';

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

  const initialAnimation = useMemo(
    () => pickInitialAnimation(frames, animation, autoplay),
    [animation, autoplay, frames],
  );

  const {
    animationName: tickerAnimationName,
    setAnimationName: setTickerAnimationName,
    playing: tickerPlaying,
    setPlaying: setTickerPlaying,
    sequence,
    timelineCursor,
    setTimelineCursor,
    resetTimelineAccumulator,
    frameIndex: tickerFrameIndex,
  } = useSpriteAnimationTicker({
    frames,
    initialAnimation,
    initialPlaying: playing ?? true,
    speedScale,
    onAnimationFinished,
    onFrameChanged: frame === undefined ? onFrameChanged : undefined,
    direction: 'forward',
  });

  useEffect(() => {
    if (animation !== undefined) {
      setTickerAnimationName(animation ?? null);
    }
  }, [animation, setTickerAnimationName]);

  useEffect(() => {
    if (autoplay === undefined) {
      return;
    }
    const nextValue = autoplay ?? null;
    if (frames.autoPlayAnimation !== nextValue) {
      frames.autoPlayAnimation = nextValue;
    }
  }, [autoplay, frames]);

  const forcedFrameIndex = resolveFrameIndex(frame, frames.frames.length);

  const desiredPlaying = useMemo(() => {
    if (typeof forcedFrameIndex === 'number') {
      return false;
    }
    if (playing === undefined) {
      return tickerPlaying;
    }
    return playing;
  }, [forcedFrameIndex, playing, tickerPlaying]);

  useEffect(() => {
    setTickerPlaying(desiredPlaying);
  }, [desiredPlaying, setTickerPlaying]);

  const resolvedAnimation = animation ?? tickerAnimationName;
  const resolvedFrameIndex =
    typeof forcedFrameIndex === 'number' ? forcedFrameIndex : tickerFrameIndex;
  const currentFrame = frames.frames[resolvedFrameIndex] ?? null;

  useEffect(() => {
    if (frame === undefined) {
      return;
    }
    if (typeof resolvedFrameIndex !== 'number') {
      return;
    }
    onFrameChanged?.({ animationName: resolvedAnimation ?? null, frameIndex: resolvedFrameIndex });
  }, [frame, onFrameChanged, resolvedAnimation, resolvedFrameIndex]);

  const setAnimationName = useCallback(
    (next: string | null) => {
      if (animation === undefined) {
        setTickerAnimationName(next);
      }
    },
    [animation, setTickerAnimationName],
  );

  const setPlayingState = useCallback(
    (next: boolean) => {
      if (playing === undefined) {
        setTickerPlaying(next);
      }
    },
    [playing, setTickerPlaying],
  );

  const setTimelineCursorClamped = useCallback(
    (next: number) => {
      if (!sequence.length) {
        setTimelineCursor(0);
        resetTimelineAccumulator();
        return;
      }
      const clamped = Math.max(0, Math.min(sequence.length - 1, Math.floor(next)));
      setTimelineCursor(clamped);
      resetTimelineAccumulator();
    },
    [resetTimelineAccumulator, sequence.length, setTimelineCursor],
  );

  return {
    animationName: resolvedAnimation ?? null,
    setAnimationName,
    playing: desiredPlaying,
    setPlaying: setPlayingState,
    sequence,
    timelineCursor,
    setTimelineCursor: setTimelineCursorClamped,
    resetTimelineAccumulator,
    forcedFrameIndex,
    resolvedFrameIndex,
    currentFrame,
  };
};
