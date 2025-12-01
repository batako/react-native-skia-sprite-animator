import { applyAnchor, worldToScreen } from '../space/transform';
import { SpriteEntity } from './SpriteEntity';
import type { SpriteFramesResource } from 'react-native-skia-sprite-animator';

const spriteResource: SpriteFramesResource = {
  frames: [{ id: 'frame-0', width: 40, height: 20, image: { type: 'uri', uri: 'dummy://0' } }],
  animations: { idle: [0] },
  autoPlayAnimation: 'idle',
};

describe('SpriteEntity', () => {
  it('スナップショットから位置・アンカー・スプライトサイズを組み合わせて描画座標を計算できる', () => {
    const entity = new SpriteEntity({
      id: 'sprite-1',
      position: { x: 100, y: 50 },
      anchor: 'center',
      spriteId: 'hero',
      resource: spriteResource,
      initialAnimation: 'idle',
      playing: true,
    });

    const snapshot = entity.getSnapshot();

    expect(snapshot).toMatchObject({
      id: 'sprite-1',
      x: 100,
      y: 50,
      anchor: 'center',
      spriteId: 'hero',
      ready: true,
    });
    expect(snapshot.sprite).toMatchObject({
      animationName: 'idle',
      frameIndex: 0,
      frameWidth: 40,
      frameHeight: 20,
      playing: true,
    });

    const anchored = applyAnchor(
      { x: snapshot.x, y: snapshot.y },
      { width: snapshot.sprite.frameWidth, height: snapshot.sprite.frameHeight },
      snapshot.anchor,
    );
    expect(anchored).toEqual({ x: 80, y: 40 });

    const screenPos = worldToScreen(anchored, { offset: { x: 10, y: -10 }, scale: 2 });
    expect(screenPos).toEqual({ x: 140, y: 100 });
  });
});
