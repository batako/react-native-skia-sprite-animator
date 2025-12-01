# react-native-skia-sprite-animator

`react-native-skia-sprite-animator` is a UI-agnostic helper built for React Native/Expo projects that rely on [@shopify/react-native-skia](https://shopify.github.io/react-native-skia/). It ships the modern `AnimatedSprite2D` runtime plus persistence helpers (`spriteStorage`) and headless editor APIs.

## Feature Overview

- **AnimatedSprite2D** – lightweight runtime that consumes the same JSON as the editor/template helpers. Supports autoplay, timeline overrides, flips, per-preview `scale`, and imperative control through `AnimatedSprite2DHandle`.
- **spriteStorage** – `saveSprite`, `loadSprite`, `listSprites`, `deleteSprite`, and storage configuration helpers so sprites plus metadata persist on device using Expo File System.
- **Editor APIs** – `useSpriteEditor` (frame CRUD, selection, clipboard, undo/redo, metadata updates), editor-agnostic hooks like `useTimelineEditor` / `useMetadataManager` / `useSpriteStorage`, plus `DefaultSpriteTemplate` helpers (import/export) and `SpriteEditUtils` (grid snapping, rect merging, hit-testing).
- **Standalone Expo editor** – an example app under `examples/standalone-editor/` that combines every API (canvas editing, real-time playback, storage, templates, metadata) to serve as the canonical feature showcase.

## Installation

```bash
npm install react-native-skia-sprite-animator
# peer dependencies
npx expo install react-native @shopify/react-native-skia expo-file-system
```

> Tested with Expo SDK 54, React Native 0.81.5 (>=0.81 confirmed), and React 19.1.0 using the standalone editor.

## Using AnimatedSprite2D

```tsx
import { AnimatedSprite2D, type SpriteFramesResource } from 'react-native-skia-sprite-animator';
import spriteSheet from '../assets/hero.png';
import spriteJson from '../assets/hero.json';

const frames: SpriteFramesResource = {
  frames: spriteJson.frames,
  animations: spriteJson.animations,
  animationsMeta: spriteJson.animationsMeta,
  autoPlayAnimation: spriteJson.autoPlayAnimation ?? null,
};

export function HeroPreview() {
  return (
    <AnimatedSprite2D
      frames={frames}
      animation="idle"
      autoplay="idle"
      speedScale={1}
      scale={1}
      centered
      style={{ width: 128, height: 128 }}
    />
  );
}
```

`AnimatedSprite2D` consumes the `SpriteFramesResource` shape produced by `cleanSpriteData`, `buildAnimatedSpriteFrames`, and the Animation Studio export. It exposes an imperative handle (`play`, `pause`, `seekFrame`, etc.) while avoiding extra Skia plumbing. Use `scale` to grow or shrink the rendered sprite; canvas bounds, centering, and offsets scale together.

Pass `scale` to grow or shrink the rendered sprite—canvas bounds, centering, and offsets are scaled together.

### Frame events

Hook into animation progress by wiring `onFrameChange` and `onAnimationEnd` on your preview component; the payload shape is `{ animationName, frameIndex, frameCursor }`.

## spriteStorage API

`spriteStorage` creates `/sprites/meta` plus a `registry.json` file under `expo-file-system` so you can persist sprites alongside their metadata.

```ts
import {
  saveSprite,
  loadSprite,
  listSprites,
  deleteSprite,
  type SpriteSavePayload,
} from 'react-native-skia-sprite-animator';

const payload: SpriteSavePayload = {
  frames,
  meta: {
    displayName: 'Hero Walk',
  },
  animations: {
    walk: [0, 1, 2],
  },
  animationsMeta: {
    blink: { loop: false },
  },
};

const saved = await saveSprite({ sprite: payload });

const items = await listSprites();
const full = await loadSprite(saved.id);
await deleteSprite(saved.id);
```

### Configuration helpers

- `configureSpriteStorage({ rootDir })`: Override the default `documentDirectory/sprites/` root.
- `getSpriteStoragePaths()`: Inspect the internal directories and registry file path.
- `clearSpriteStorage()`: Remove the generated folders/registry (helpful for tests or resets).

## Editor APIs

Editor primitives live under `src/editor/` so you can build custom sprite tooling without bundling any UI opinions.

- `useSpriteEditor`: React hook that manages frames, selection, clipboard, undo/redo history, and template-based export/import. It’s UI-agnostic—wire it into your own panels, gestures, or devtools.
- `useEditorIntegration`: Bridges `useSpriteEditor` state with a preview runtime (playback controls, speed, selection syncing). Returns refs/callbacks consumed by the preview widgets.
- `useTimelineEditor`: Keeps track of the selected timeline index, clipboard payloads, and layout measurements so custom Timeline/Playback toolbars can stay in sync with your preview runtime.
- `useMetadataManager`: Normalizes primitive meta entries into `{ key, value }` rows with helpers for adding, removing, and persisting updates via `editor.updateMeta`.
- `useSpriteStorage`: Wraps `spriteStorage` helpers with UI-friendly state (`status`, `isBusy`, list of `SpriteSummary` items) and supports injecting custom storage controllers.
- `AnimationStudio`: Turnkey editor screen that composes every hook above (frames list, metadata editor, sprite JSON import/export, sprite storage, timeline panel, preview player). Provide your own `useSpriteEditor` / `useEditorIntegration` or omit both and let the component create them; each frame should carry its own `imageUri`.
- `SpriteEditUtils`: Geometry helpers (`snapToGrid`, `normalizeRect`, `pointInFrame`, `mergeFrames`) for snap-lines, hit-tests, and bounding boxes.
- `DefaultSpriteTemplate`: Serialize editor state to the same JSON shape expected by `spriteStorage`.

See the editor API docs for usage examples and option tables.

## Standalone Editor (Expo example)

A **complete Expo demo** lives under `examples/standalone-editor/`, exposing every public API in one screen so you can study the integration patterns before building your own tools.

What it demonstrates:

- `useSpriteEditor` powering frame CRUD, selection, clipboard, undo/redo, metadata editing, and template-aware import/export.
- Real-time playback by piping live editor state into your preview runtime, including seek, pause, and speed scaling.
- Export/import panel that previews the spriteStorage JSON (DefaultSpriteTemplate) used everywhere.
- Local persistence backed by `spriteStorage` (`saveSprite`, `loadSprite`, `listSprites`, `deleteSprite`).
- `SpriteEditUtils` on the Skia canvas (grid overlays, hit-testing, selection bounds) so geometry helpers are shown in context.

Run it locally with `npm install` followed by `npm run start` inside `examples/standalone-editor`. The project links back to the library via `link:../../`, so editing the main package instantly updates the demo.

## Development

```bash
npm install
npm run build
# optional: generate the same tarball npm publish would ship
npm pack
```

Build artifacts land in `dist/` (ESM + type declarations). Hooks/UI components are intentionally out of scope so each app can design its own editor, and the editor APIs stay UI-agnostic for the same reason.

## License

MIT
