import { SpriteAnimator } from './SpriteAnimator';
import type { SpriteFramesResource } from 'react-native-skia-sprite-animator';

const buildResource = (): SpriteFramesResource => ({
  frames: [
    { id: 'frame-0', width: 16, height: 24, image: { type: 'uri', uri: 'dummy://0' } },
    { id: 'frame-1', width: 32, height: 48, image: { type: 'uri', uri: 'dummy://1' } },
  ],
  animations: { run: [0, 1] },
  animationsMeta: { run: { fps: 10 } },
  autoPlayAnimation: 'run',
});

describe('SpriteAnimator', () => {
  it('getSnapshot() が現在フレームのサイズを返し、再生でフレームが進む', () => {
    const animator = new SpriteAnimator({
      spriteId: 'hero',
      resource: buildResource(),
      playing: true,
    });

    const initial = animator.getSnapshot();
    expect(initial).toMatchObject({
      animationName: 'run',
      frameIndex: 0,
      frameWidth: 16,
      frameHeight: 24,
      playing: true,
    });

    // fps 10 なので 0.1 秒で次フレームへ進む
    animator.update(0.1);
    const next = animator.getSnapshot();
    expect(next.frameIndex).toBe(1);
    expect(next.frameWidth).toBe(32);
    expect(next.frameHeight).toBe(48);
  });
});
