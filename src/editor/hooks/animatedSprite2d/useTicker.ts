/* eslint-disable jsdoc/require-jsdoc */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpriteFramesResource } from '../../animatedSprite2dTypes';
import { computeFrameDuration } from './helpers';

export interface UseTickerOptions {
  frames: SpriteFramesResource;
  sequence: number[];
  animationName: string | null;
  playing: boolean;
  speedScale: number;
  forcedFrameIndex: number | null;
  onAnimationFinished?: (name: string | null) => void;
  onPlaybackHalted?: () => void;
}

export interface UseTickerResult {
  cursor: number;
  setCursor: (next: number) => void;
  resetAccumulator: () => void;
}

export const useTicker = ({
  frames,
  sequence,
  animationName,
  playing,
  speedScale,
  forcedFrameIndex,
  onAnimationFinished,
  onPlaybackHalted,
}: UseTickerOptions): UseTickerResult => {
  const [cursor, setCursorState] = useState(0);
  const cursorRef = useRef(0);
  const accumulatorRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(playing);
  const sequenceRef = useRef(sequence);
  const animationRef = useRef(animationName);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    animationRef.current = animationName;
  }, [animationName]);

  const setCursor = useCallback((next: number) => {
    cursorRef.current = next;
    setCursorState(next);
  }, []);

  const resetAccumulator = useCallback(() => {
    accumulatorRef.current = 0;
  }, []);

  useEffect(() => {
    setCursor(0);
    resetAccumulator();
  }, [animationName, resetAccumulator, setCursor]);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(cursorRef.current, Math.max(0, sequence.length - 1)));
    if (clamped !== cursorRef.current) {
      setCursor(clamped);
    }
    resetAccumulator();
  }, [resetAccumulator, sequence.length, setCursor]);

  useEffect(() => {
    if (!playing || !sequence.length || typeof forcedFrameIndex === 'number') {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return () => undefined;
    }

    let cancelled = false;
    let lastTs: number | null = null;

    const tick = (timestamp: number) => {
      if (cancelled || !playingRef.current) {
        return;
      }
      if (lastTs == null) {
        lastTs = timestamp;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const delta = timestamp - lastTs;
      lastTs = timestamp;
      accumulatorRef.current += delta;
      let localCursor = cursorRef.current;
      let updated = false;
      const seq = sequenceRef.current;
      const activeAnimation = animationRef.current ?? null;
      const loop = frames.animationsMeta?.[activeAnimation ?? '']?.loop ?? true;

      while (seq.length) {
        const frameIndex = seq[Math.min(localCursor, seq.length - 1)] ?? 0;
        const duration = computeFrameDuration(
          frames.frames[frameIndex],
          activeAnimation,
          localCursor,
          frames,
          speedScale,
        );
        if (accumulatorRef.current < duration) {
          break;
        }
        accumulatorRef.current -= duration;
        let nextCursor = localCursor + 1;
        if (nextCursor >= seq.length) {
          if (loop) {
            nextCursor = 0;
          } else {
            nextCursor = seq.length - 1;
            accumulatorRef.current = 0;
            setCursor(nextCursor);
            onPlaybackHalted?.();
            onAnimationFinished?.(activeAnimation);
            cancelled = true;
            return;
          }
        }
        localCursor = nextCursor;
        updated = true;
      }

      if (updated) {
        setCursor(localCursor);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    forcedFrameIndex,
    frames,
    onAnimationFinished,
    onPlaybackHalted,
    playing,
    sequence,
    setCursor,
    speedScale,
  ]);

  return { cursor, setCursor, resetAccumulator };
};
