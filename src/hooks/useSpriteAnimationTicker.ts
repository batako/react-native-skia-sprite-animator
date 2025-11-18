/* eslint-disable jsdoc/require-jsdoc */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AnimatedSpriteFrameChangeEvent,
  SpriteFramesResource,
} from '../editor/animatedSprite2dTypes';
import {
  buildSequence,
  pickInitialAnimation,
  resolveFrameIndex,
} from '../editor/hooks/animatedSprite2d/helpers';
import { useTicker } from '../editor/hooks/animatedSprite2d/useTicker';

export interface UseSpriteAnimationTickerOptions {
  frames: SpriteFramesResource;
  initialAnimation?: string | null;
  initialPlaying?: boolean;
  speedScale?: number;
  onAnimationFinished?: (name: string | null) => void;
  onFrameChanged?: (event: AnimatedSpriteFrameChangeEvent) => void;
}

export interface SpriteAnimationTickerResult {
  animationName: string | null;
  setAnimationName: (name: string | null) => void;
  playing: boolean;
  setPlaying: (next: boolean) => void;
  sequence: number[];
  timelineCursor: number;
  setTimelineCursor: (cursor: number) => void;
  resetTimelineAccumulator: () => void;
  frameIndex: number;
  play: (name?: string | null) => void;
  pause: () => void;
  stop: () => void;
  seekFrame: (frameIndex: number) => void;
}

export const useSpriteAnimationTicker = (
  options: UseSpriteAnimationTickerOptions,
): SpriteAnimationTickerResult => {
  const {
    frames,
    initialAnimation,
    initialPlaying = true,
    speedScale = 1,
    onAnimationFinished,
    onFrameChanged,
  } = options;

  const resolveInitialAnimation = useCallback(
    () => pickInitialAnimation(frames, initialAnimation),
    [frames, initialAnimation],
  );

  const [animationName, setAnimationNameState] = useState<string | null>(() =>
    resolveInitialAnimation(),
  );
  const [playing, setPlayingState] = useState<boolean>(initialPlaying);

  useEffect(() => {
    setAnimationNameState((prev) => {
      if (prev && frames.animations?.[prev]) {
        return prev;
      }
      return resolveInitialAnimation();
    });
  }, [frames, resolveInitialAnimation]);

  const sequence = useMemo(() => buildSequence(frames, animationName), [frames, animationName]);

  const { cursor, setCursor, resetAccumulator } = useTicker({
    frames,
    sequence,
    animationName,
    playing,
    speedScale,
    forcedFrameIndex: null,
    onAnimationFinished,
  });

  const frameIndex = useMemo(() => {
    if (!sequence.length) {
      return 0;
    }
    return sequence[Math.min(cursor, sequence.length - 1)] ?? 0;
  }, [cursor, sequence]);

  const lastFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (frameIndex === lastFrameRef.current) {
      return;
    }
    lastFrameRef.current = frameIndex;
    onFrameChanged?.({ animationName, frameIndex });
  }, [animationName, frameIndex, onFrameChanged]);

  useEffect(() => {
    setCursor(0);
    resetAccumulator();
  }, [animationName, sequence, resetAccumulator, setCursor]);

  const play = useCallback(
    (name?: string | null) => {
      if (name !== undefined) {
        setAnimationNameState(name);
        setCursor(0);
        resetAccumulator();
      }
      setPlayingState(true);
    },
    [resetAccumulator, setCursor],
  );

  const pause = useCallback(() => {
    setPlayingState(false);
  }, []);

  const stop = useCallback(() => {
    setPlayingState(false);
    setCursor(0);
    resetAccumulator();
  }, [resetAccumulator, setCursor]);

  const seekFrame = useCallback(
    (frame: number) => {
      const clamped = resolveFrameIndex(frame, frames.frames.length);
      if (clamped === null) {
        return;
      }
      const sequenceIndex = sequence.findIndex((value) => value === clamped);
      setCursor(sequenceIndex >= 0 ? sequenceIndex : 0);
      resetAccumulator();
    },
    [frames.frames.length, resetAccumulator, sequence, setCursor],
  );

  return {
    animationName,
    setAnimationName: setAnimationNameState,
    playing,
    setPlaying: setPlayingState,
    sequence,
    timelineCursor: cursor,
    setTimelineCursor: setCursor,
    resetTimelineAccumulator: resetAccumulator,
    frameIndex,
    play,
    pause,
    stop,
    seekFrame,
  };
};
