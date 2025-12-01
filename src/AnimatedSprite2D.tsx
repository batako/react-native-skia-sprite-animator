/* eslint-disable jsdoc/require-jsdoc */
import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import type { AnimatedSprite2DHandle, AnimatedSprite2DProps } from './editor/animatedSprite2dTypes';
import { useAnimatedSpriteController } from './editor/hooks/animatedSprite2d/useAnimatedSpriteController';
import { AnimatedSprite2DView } from './AnimatedSprite2DView';

export const AnimatedSprite2D = forwardRef<AnimatedSprite2DHandle, AnimatedSprite2DProps>(
  (props, ref) => {
    const { style, ...controllerOptions } = props;
    const controller = useAnimatedSpriteController(controllerOptions);
    const frames = controllerOptions.frames;
    const {
      animationName,
      setAnimationName,
      playing,
      setPlaying,
      sequence,
      setTimelineCursor,
      resetTimelineAccumulator,
      currentFrame,
      frameImage,
      canvasSize,
      drawOrigin,
      scale,
    } = controller;

    const clampFrameIndex = useCallback(
      (index: number) => {
        const maxIndex = Math.max(0, frames.frames.length - 1);
        if (!Number.isFinite(index)) {
          return 0;
        }
        return Math.max(0, Math.min(maxIndex, Math.floor(index)));
      },
      [frames.frames.length],
    );

    useImperativeHandle(
      ref,
      () => ({
        play: (name?: string | null) => {
          if (name !== undefined) {
            setAnimationName(name);
          }
          setPlaying(true);
        },
        stop: () => {
          setPlaying(false);
          setTimelineCursor(0);
          resetTimelineAccumulator();
        },
        pause: () => {
          setPlaying(false);
        },
        seekFrame: (frameIndex: number) => {
          const normalized = clampFrameIndex(frameIndex);
          const targetCursor = sequence.findIndex((value) => value === normalized);
          setTimelineCursor(targetCursor >= 0 ? targetCursor : 0);
          resetTimelineAccumulator();
          setPlaying(false);
        },
        getCurrentAnimation: () => animationName,
        isPlaying: () => playing,
      }),
      [
        animationName,
        clampFrameIndex,
        playing,
        resetTimelineAccumulator,
        sequence,
        setAnimationName,
        setPlaying,
        setTimelineCursor,
      ],
    );

    return (
      <AnimatedSprite2DView
        frame={currentFrame}
        frameImage={frameImage}
        canvasSize={canvasSize}
        drawOrigin={drawOrigin}
        flipH={props.flipH}
        flipV={props.flipV}
        scale={scale}
        style={style}
      />
    );
  },
);

AnimatedSprite2D.displayName = 'AnimatedSprite2D';
