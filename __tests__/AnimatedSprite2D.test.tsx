import React, { createRef } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { AnimatedSprite2D } from '../src/AnimatedSprite2D';
import type {
  AnimatedSprite2DHandle,
  SpriteFramesResource,
  AnimatedSpriteFrame,
} from '../src/editor/animatedSprite2dTypes';
import { AnimatedSprite2DView } from '../src/AnimatedSprite2DView';
import { useAnimatedSpriteController } from '../src/editor/hooks/animatedSprite2d/useAnimatedSpriteController';

jest.mock('../src/editor/hooks/animatedSprite2d/useAnimatedSpriteController');
jest.mock('../src/AnimatedSprite2DView', () => ({
  AnimatedSprite2DView: jest.fn(() => null),
}));

const mockController = useAnimatedSpriteController as jest.MockedFunction<
  typeof useAnimatedSpriteController
>;
const mockView = AnimatedSprite2DView as jest.MockedFunction<typeof AnimatedSprite2DView>;

const buildFrame = (overrides?: Partial<AnimatedSpriteFrame>): AnimatedSpriteFrame => ({
  id: overrides?.id ?? 'frame-0',
  width: overrides?.width ?? 32,
  height: overrides?.height ?? 32,
  image: overrides?.image ?? { type: 'uri', uri: 'file:///sprite.png' },
  ...overrides,
});

const framesResource: SpriteFramesResource = {
  frames: [buildFrame(), buildFrame({ id: 'frame-1' }), buildFrame({ id: 'frame-2' })],
  animations: { idle: [0, 1, 2] },
};

const setupControllerMock = () => {
  const controllerState = {
    animationName: 'idle' as string | null,
    setAnimationName: jest.fn(),
    playing: false,
    setPlaying: jest.fn(),
    sequence: [0, 1, 2],
    timelineCursor: 0,
    setTimelineCursor: jest.fn(),
    resetTimelineAccumulator: jest.fn(),
    forcedFrameIndex: null,
    resolvedFrameIndex: 0,
    currentFrame: framesResource.frames[0],
    frameImage: null,
    canvasSize: { width: 128, height: 96 },
    drawOrigin: { x: 4, y: 6 },
    scale: 1,
  };
  mockController.mockReturnValue(controllerState);
  return controllerState;
};

const renderComponent = (ui: Parameters<typeof create>[0]) => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(ui);
  });
  return renderer;
};

describe('AnimatedSprite2D', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards controller values to AnimatedSprite2DView', () => {
    const state = setupControllerMock();

    renderComponent(
      <AnimatedSprite2D
        frames={framesResource}
        flipH
        flipV
        centered={false}
        style={{ width: 80 }}
      />,
    );

    expect(mockView).toHaveBeenCalledTimes(1);
    expect(mockView).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: state.currentFrame,
        frameImage: state.frameImage,
        canvasSize: state.canvasSize,
        drawOrigin: state.drawOrigin,
        flipH: true,
        flipV: true,
        scale: state.scale,
        style: { width: 80 },
      }),
      undefined,
    );
  });

  it('exposes an imperative handle that proxies controller actions', () => {
    const state = setupControllerMock();
    const ref = createRef<AnimatedSprite2DHandle>();

    renderComponent(<AnimatedSprite2D ref={ref} frames={framesResource} />);

    state.setAnimationName.mockClear();
    state.setPlaying.mockClear();
    state.setTimelineCursor.mockClear();
    state.resetTimelineAccumulator.mockClear();

    act(() => {
      ref.current?.play('run');
    });
    expect(state.setAnimationName).toHaveBeenCalledWith('run');
    expect(state.setPlaying).toHaveBeenCalledWith(true);

    act(() => {
      ref.current?.stop();
    });
    expect(state.setPlaying).toHaveBeenCalledWith(false);
    expect(state.setTimelineCursor).toHaveBeenCalledWith(0);
    expect(state.resetTimelineAccumulator).toHaveBeenCalled();

    act(() => {
      ref.current?.pause();
    });
    expect(state.setPlaying).toHaveBeenLastCalledWith(false);

    act(() => {
      ref.current?.seekFrame(1);
    });
    const lastTimelineArgs =
      state.setTimelineCursor.mock.calls[state.setTimelineCursor.mock.calls.length - 1];
    expect(lastTimelineArgs[0]).toBe(1);
    expect(state.setPlaying).toHaveBeenLastCalledWith(false);
    expect(state.resetTimelineAccumulator).toHaveBeenCalledTimes(2);

    expect(ref.current?.getCurrentAnimation()).toBe('idle');
    expect(ref.current?.isPlaying()).toBe(false);
  });
});
