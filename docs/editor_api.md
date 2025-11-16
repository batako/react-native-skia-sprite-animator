# Editor API Reference

v0.3 introduces headless editor primitives so you can build custom sprite editors without relying on prebuilt UI. The API surface consists of three pieces:

1. `useSpriteEditor` – React hook that manages frames, selection, clipboard, history, and template-based import/export.
2. `SpriteEditUtils` – geometry helpers for snapping, hit-testing, and layout math.
3. Templates – `SpriteTemplate` interface plus `DefaultSpriteTemplate` for spriteStorage-compatible JSON.

---

## useSpriteEditor hook

```tsx
import { useSpriteEditor } from 'react-native-skia-sprite-animator';

const EditorScreen = () => {
  const editor = useSpriteEditor({ historyLimit: 100 });

  const handleAdd = () => {
    editor.addFrame({ x: 0, y: 0, w: 64, h: 64 });
  };

  return (
    <>
      <Button title="Add Frame" onPress={handleAdd} />
      <Button title="Undo" onPress={editor.undo} disabled={!editor.canUndo} />
    </>
  );
};
```

### Options

| Option                    | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `initialState`            | Seeds frames/animations/meta when the hook mounts.    |
| `historyLimit`            | Maximum undo depth (defaults to 50).                  |
| `trackSelectionInHistory` | When `true`, selection changes create undo snapshots. |

### Returned API

- `state`: Full editor state (`frames`, `animations`, `animationsMeta`, `selected`, `clipboard`, `history`, `future`, `meta`). Selections reference frame ids to keep them stable even when frames are reordered.
- `addFrame(frame, options?)`: Inserts a frame (auto-generates ids) and shifts animation indexes when needed.
- `updateFrame(id, partial)`: Patches coordinates/duration without touching ids.
- `removeFrame(id)` / `removeFrames(ids)`: Removes frames and cleans animation references.
- `reorderFrames(from, to)`: Moves frames while preserving animation references.
- `setSelection(ids, { append })`, `selectFrame`, `selectAll`, `clearSelection`: Selection utilities for building range/toggle UIs.
- `copySelected`, `cutSelected`, `pasteClipboard({ index })`: Clipboard helpers that duplicate frames with fresh ids when pasted.
- `undo`, `redo`, `canUndo`, `canRedo`: History helpers (snapshots are lightweight and respect `historyLimit`).
- `setAnimations`, `setAnimationsMeta`, `updateMeta`: Control higher-level sprite metadata.
- `exportJSON()`: Serialises the current snapshot into spriteStorage-compatible JSON.
- `importJSON(data)`: Rehydrates editor state from spriteStorage-compatible payloads (includes undo support so imports can be reverted).
- `reset(nextState?)`: Replaces the current editor contents.

### Clipboard example

```ts
const { state, copySelected, pasteClipboard } = useSpriteEditor();

const copy = () => {
  if (!state.selected.length) return;
  copySelected();
};

const paste = () => {
  pasteClipboard(); // inserts after the last selected frame or at the end
};
```

---

## Serialization helpers

`exportJSON()` and `importJSON()` always use the built-in `DefaultSpriteTemplate`, which mirrors the spriteStorage payload (frames are exported without ids). Use it whenever you need to persist editor state or preview the JSON handed to `SpriteAnimator`.

```ts
const payload = editor.exportJSON();
await saveSprite({ sprite: payload });

editor.importJSON(payload); // undoable
```

If you need to strip transient fields before saving, run the payload through `cleanSpriteData`.

---

## Geometry helpers (`SpriteEditUtils`)

| Helper                                 | Description                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `snapToGrid(value, gridSize, origin?)` | Snaps scalar values to a grid (origin defaults to `0`).                        |
| `normalizeRect(rect)`                  | Ensures width/height are positive by adjusting `x/y` when needed.              |
| `pointInFrame(point, rect)`            | Hit-test helper (inclusive start, exclusive end).                              |
| `mergeFrames(frames)`                  | Returns the bounding rectangle that covers every frame (or `null` when empty). |

Geometry helpers are UI-agnostic utilities intended for marquee tools, selection overlays, and drag handlers.

---

## Migration notes (v0.2 → v0.3)

- Renderer inputs remain unchanged: `SpriteAnimator` and `spriteStorage` still expect the v0.2 schema.
- Editor state tracks frames by `id` internally, but `exportJSON()` strips ids during export so runtime components continue to work without modification.
- Use `DefaultSpriteTemplate.fromJSON()` to load legacy spriteStorage payloads into the editor before editing.
- Undo depth now defaults to 50 snapshots; adjust `historyLimit` if you need more/less aggressive memory usage.
