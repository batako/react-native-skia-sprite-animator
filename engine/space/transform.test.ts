import { applyAnchor, screenToWorld, worldToScreen } from './transform';

describe('transform helpers', () => {
  it('worldToScreen でカメラオフセットとスケールを適用する', () => {
    const camera = { offset: { x: 10, y: -5 }, scale: 2 };
    const worldPos = { x: 14, y: 5 };

    const screenPos = worldToScreen(worldPos, camera);

    expect(screenPos).toEqual({ x: 8, y: 20 });
  });

  it('screenToWorld が worldToScreen の逆変換になる', () => {
    const camera = { offset: { x: -3, y: 6 }, scale: 0.5 };
    const worldPos = { x: 7, y: -2 };

    const screenPos = worldToScreen(worldPos, camera);
    const roundTrip = screenToWorld(screenPos, camera);

    expect(roundTrip.x).toBeCloseTo(worldPos.x);
    expect(roundTrip.y).toBeCloseTo(worldPos.y);
  });

  it('applyAnchor が center のとき矩形の中心を基準に補正する', () => {
    const position = { x: 100, y: 50 };
    const size = { width: 40, height: 20 };

    const anchored = applyAnchor(position, size, 'center');

    expect(anchored).toEqual({ x: 80, y: 40 });
  });

  it('applyAnchor が top-left のとき座標を変更しない', () => {
    const position = { x: 12, y: 34 };
    const size = { width: 10, height: 10 };

    const anchored = applyAnchor(position, size, 'top-left');

    expect(anchored).toEqual(position);
    // size は影響しないことを明示
    expect(size).toEqual({ width: 10, height: 10 });
  });
});
