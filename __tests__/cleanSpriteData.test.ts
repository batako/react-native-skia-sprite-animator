import { cleanSpriteData } from '../src/editor/utils/cleanSpriteData';
import type { SpriteFrame, SpriteData } from '../src/SpriteAnimator';

describe('cleanSpriteData', () => {
  const createFrame = (x: number, overrides: Partial<SpriteFrame> = {}): SpriteFrame => ({
    x,
    y: 0,
    w: 16,
    h: 16,
    imageUri: `file://${x}.png`,
    ...overrides,
  });

  const baseData = (overrides: Partial<SpriteData> = {}): SpriteData & Record<string, unknown> =>
    ({
      frames: [createFrame(0), createFrame(10), createFrame(10)],
      animations: { idle: [0, 2] },
      animationsMeta: undefined,
      meta: {},
      ...overrides,
    }) as SpriteData & Record<string, unknown>;

  it('deduplicates frames and remaps sequences to the canonical indexes', () => {
    const result = cleanSpriteData(baseData());

    expect(result.frames).toHaveLength(2);
    expect(result.animations.idle).toEqual([0, 1]);
    expect(result.frameIndexMap).toEqual([0, 1, 1]);
  });

  it('removes frames that are no longer referenced by any animation', () => {
    const result = cleanSpriteData(
      baseData({
        animations: {},
      }),
    );

    expect(result.frames).toHaveLength(0);
    expect(result.animations).toEqual({});
  });
});
