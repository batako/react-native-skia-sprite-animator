/* eslint-disable jsdoc/require-jsdoc */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  SpriteAnimatorDirection,
  SpriteAnimatorFrameChangeEvent,
  SpriteAnimatorHandle,
  SpriteData,
} from '../../SpriteAnimator';
import type { SpriteFramesResource } from '../animatedSprite2dTypes';
import { useSpriteAnimationTicker } from '../../hooks/useSpriteAnimationTicker';
import type { SpriteEditorApi } from './useSpriteEditor';

/**
 * Options for {@link useEditorIntegration}.
 */
export interface UseEditorIntegrationOptions {
  /** Sprite editor instance driving the integration. */
  editor: SpriteEditorApi;
}

interface SeekFrameOptions {
  cursor?: number;
  animationName?: string | null;
  sequenceOverride?: number[] | null;
}

interface PlayOptions {
  fromFrame?: number;
  direction?: SpriteAnimatorDirection;
}

/**
 * Ties the SpriteEditor state to the SpriteAnimator runtime.
 */
const buildTickerResource = (state: SpriteEditorApi['state']): SpriteFramesResource => ({
  frames: state.frames.map((frame, index) => ({
    id: frame.id ?? `frame-${index}`,
    width: frame.w,
    height: frame.h,
    duration: frame.duration,
    image: frame.imageUri ? { type: 'uri', uri: frame.imageUri } : { type: 'uri', uri: '' },
  })),
  animations: state.animations ?? {},
  animationsMeta: state.animationsMeta,
  autoPlayAnimation: state.autoPlayAnimation ?? null,
  meta: state.meta ?? {},
});

export const useEditorIntegration = ({ editor }: UseEditorIntegrationOptions) => {
  const animatorRef = useRef<SpriteAnimatorHandle>(null);
  const [speedScale, setSpeedScale] = useState(1);
  const [playDirection, setPlayDirection] = useState<SpriteAnimatorDirection>('forward');
  const endedAnimationRef = useRef<string | null>(null);

  const animationsState = useMemo(() => editor.state.animations ?? {}, [editor.state.animations]);
  const animationsMetaState = useMemo(
    () => editor.state.animationsMeta ?? {},
    [editor.state.animationsMeta],
  );
  const runtimeData = useMemo<SpriteData>(() => {
    return {
      frames: editor.state.frames.map(({ id: _id, ...frame }) => ({ ...frame })),
      animations: animationsState,
      meta: editor.state.meta ?? {},
    } satisfies SpriteData;
  }, [animationsState, editor.state.frames, editor.state.meta]);
  const getSequence = useCallback(
    (name: string | null | undefined) => {
      if (!name) {
        return [];
      }
      const animationsMap = editor.state.animations ?? {};
      return animationsMap[name] ?? runtimeData.animations?.[name] ?? [];
    },
    [editor.state.animations, runtimeData.animations],
  );

  const tickerResource = useMemo(() => buildTickerResource(editor.state), [editor.state]);

  const {
    animationName: tickerAnimationName,
    setAnimationName: setTickerAnimationName,
    playing: tickerPlaying,
    setPlaying: setTickerPlaying,
    sequence,
    timelineCursor: tickerTimelineCursor,
    setTimelineCursor: controlTimelineCursor,
    frameIndex,
    seekFrame: tickerSeekFrame,
  } = useSpriteAnimationTicker({
    frames: tickerResource,
    initialAnimation: editor.state.autoPlayAnimation ?? null,
    initialPlaying: false,
    speedScale,
    onAnimationFinished: (name) => {
      endedAnimationRef.current = name ?? null;
      setTickerPlaying(false);
    },
    direction: playDirection,
  });

  const timelineCursor = sequence.length ? tickerTimelineCursor : null;
  const frameCursor = frameIndex;

  const activeAnimation = tickerAnimationName;
  const setActiveAnimation = setTickerAnimationName;
  const isPlaying = tickerPlaying;

  const play = useCallback(
    (name?: string | null, opts?: PlayOptions) => {
      const targetName = name ?? tickerAnimationName ?? null;
      const sequenceForTarget = getSequence(targetName);
      const sequenceLength = sequenceForTarget.length;
      const requestedCursorRaw =
        typeof opts?.fromFrame === 'number' && Number.isFinite(opts.fromFrame)
          ? Math.max(0, Math.floor(opts.fromFrame))
          : undefined;
      const resolveCursor = (cursor: number) => {
        if (!sequenceLength) {
          return { cursor: 0, frameIndex: 0 };
        }
        const clampedCursor = Math.max(0, Math.min(sequenceLength - 1, cursor));
        return {
          cursor: clampedCursor,
          frameIndex: sequenceForTarget[clampedCursor] ?? 0,
        };
      };
      const requestedCursor =
        requestedCursorRaw !== undefined ? resolveCursor(requestedCursorRaw) : undefined;
      const isAtEnd = sequenceLength > 0 && tickerTimelineCursor === sequenceLength - 1;
      const hasEnded = targetName && endedAnimationRef.current === targetName;
      const shouldRestart =
        requestedCursor !== undefined
          ? true
          : (!tickerPlaying && targetName && sequenceLength > 0 && isAtEnd) || hasEnded;
      const resolvedDirection: SpriteAnimatorDirection =
        opts?.direction === 'reverse' || opts?.direction === 'forward'
          ? opts.direction
          : playDirection;
      setPlayDirection(resolvedDirection);
      if (targetName !== null && targetName !== tickerAnimationName) {
        setTickerAnimationName(targetName);
      }
      if (requestedCursor) {
        controlTimelineCursor(requestedCursor.cursor);
      } else if (shouldRestart && sequenceLength > 0) {
        const restartCursor = resolvedDirection === 'reverse' ? sequenceLength - 1 : 0;
        controlTimelineCursor(restartCursor);
      }
      if (sequenceLength === 0) {
        const fallbackFrame =
          requestedCursor?.frameIndex ??
          (typeof requestedCursorRaw === 'number' ? requestedCursorRaw : 0);
        tickerSeekFrame(fallbackFrame);
      }
      setTickerPlaying(true);
      if (hasEnded || requestedCursor !== undefined) {
        endedAnimationRef.current = null;
      }
      animatorRef.current?.play(targetName ?? undefined, {
        speedScale,
        fromFrame: requestedCursor?.cursor,
        direction: resolvedDirection,
      });
    },
    [
      getSequence,
      playDirection,
      setPlayDirection,
      setTickerAnimationName,
      setTickerPlaying,
      speedScale,
      tickerAnimationName,
      tickerTimelineCursor,
      tickerPlaying,
      tickerSeekFrame,
      controlTimelineCursor,
    ],
  );

  const stop = useCallback(() => {
    const sequenceForActive =
      activeAnimation != null ? getSequence(activeAnimation) : editor.state.frames.map((_, i) => i);
    setTickerPlaying(false);
    if (sequenceForActive.length > 0) {
      controlTimelineCursor(0);
      tickerSeekFrame(sequenceForActive[0] ?? 0);
    } else {
      tickerSeekFrame(0);
      controlTimelineCursor(0);
    }
    animatorRef.current?.stop();
  }, [
    activeAnimation,
    controlTimelineCursor,
    editor.state.frames,
    getSequence,
    setTickerPlaying,
    tickerSeekFrame,
  ]);

  const pause = useCallback(() => {
    setTickerPlaying(false);
    animatorRef.current?.pause();
  }, [setTickerPlaying]);

  const togglePlayback = useCallback(
    (name?: string | null) => {
      if (tickerPlaying) {
        pause();
        return;
      }
      play(name);
    },
    [pause, play, tickerPlaying],
  );

  const playForward = useCallback(
    (name?: string | null, opts?: Omit<PlayOptions, 'direction'>) => {
      play(name, { ...opts, direction: 'forward' });
    },
    [play],
  );

  const playReverse = useCallback(
    (name?: string | null, opts?: Omit<PlayOptions, 'direction'>) => {
      play(name, { ...opts, direction: 'reverse' });
    },
    [play],
  );

  const seekFrame = useCallback(
    (frameIndex: number, opts?: SeekFrameOptions) => {
      const fallbackFrameIndex = Number.isFinite(frameIndex)
        ? Math.max(0, Math.floor(frameIndex))
        : 0;
      const targetAnimation = opts?.animationName ?? tickerAnimationName ?? null;
      const sequenceOverride = Array.isArray(opts?.sequenceOverride) ? opts.sequenceOverride : null;
      const sequenceForTarget = sequenceOverride ?? getSequence(targetAnimation);
      const clampCursor = (value: number) => {
        if (!sequenceForTarget.length) {
          return 0;
        }
        const intValue = Math.floor(value);
        if (intValue < 0) {
          return 0;
        }
        if (intValue > sequenceForTarget.length - 1) {
          return sequenceForTarget.length - 1;
        }
        return intValue;
      };
      if (!sequenceForTarget.length) {
        tickerSeekFrame(fallbackFrameIndex);
        controlTimelineCursor(0);
        animatorRef.current?.setFrame?.(fallbackFrameIndex, {
          animationName: targetAnimation ?? null,
        });
        return;
      }
      let cursorIndex: number | null =
        typeof opts?.cursor === 'number' ? clampCursor(opts.cursor) : null;
      if (cursorIndex === null) {
        cursorIndex = sequenceForTarget.findIndex((value) => value === fallbackFrameIndex);
        if (cursorIndex < 0) {
          cursorIndex = clampCursor(fallbackFrameIndex);
        }
      }
      const resolvedCursor = clampCursor(cursorIndex);
      controlTimelineCursor(resolvedCursor);
      animatorRef.current?.setFrame?.(resolvedCursor, {
        animationName: targetAnimation ?? null,
      });
    },
    [controlTimelineCursor, getSequence, tickerAnimationName, tickerSeekFrame],
  );

  const onFrameChange = useCallback(
    (event: SpriteAnimatorFrameChangeEvent) => {
      controlTimelineCursor(event.frameCursor);
      if (!sequence.length) {
        tickerSeekFrame(event.frameIndex);
      }
    },
    [controlTimelineCursor, sequence.length, tickerSeekFrame],
  );

  const onAnimationEnd = useCallback(
    (name: string | null) => {
      endedAnimationRef.current = name ?? null;
      setTickerPlaying(false);
      const sequenceForName = getSequence(name);
      if (!sequenceForName.length) {
        return;
      }
      const cursor = playDirection === 'reverse' ? 0 : Math.max(0, sequenceForName.length - 1);
      controlTimelineCursor(cursor);
    },
    [controlTimelineCursor, getSequence, playDirection, setTickerPlaying],
  );

  const availableAnimations = useMemo(
    () => Object.keys(editor.state.animations ?? {}),
    [editor.state.animations],
  );

  useEffect(() => {
    if (activeAnimation && !availableAnimations.includes(activeAnimation)) {
      setTickerAnimationName(null);
    }
  }, [activeAnimation, availableAnimations, setTickerAnimationName]);

  const selectedFrameIndex = useMemo(() => {
    if (!editor.state.selected.length) {
      return null;
    }
    const targetId = editor.state.selected[0];
    const index = editor.state.frames.findIndex((frame) => frame.id === targetId);
    return index >= 0 ? index : null;
  }, [editor.state.frames, editor.state.selected]);

  return {
    animatorRef,
    runtimeData,
    animationsMeta: animationsMetaState,
    speedScale,
    setSpeedScale,
    playDirection,
    setPlayDirection,
    activeAnimation,
    setActiveAnimation,
    availableAnimations,
    play,
    playForward,
    playReverse,
    stop,
    pause,
    togglePlayback,
    seekFrame,
    isPlaying,
    frameCursor,
    timelineCursor,
    onFrameChange,
    onAnimationEnd,
    selectedFrameIndex,
  } as const;
};

/** Convenience alias for the return type of {@link useEditorIntegration}. */
export type EditorIntegration = ReturnType<typeof useEditorIntegration>;
