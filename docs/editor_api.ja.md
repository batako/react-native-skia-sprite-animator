# Editor API リファレンス

UI を含まないエディター用プリミティブを利用することで、任意の React Native/Expo アプリ上にカスタムスプライトエディターを構築できます。公開されている API は主に次の 3 つです。

1. `useSpriteEditor` – フレーム管理や選択、クリップボード、Undo/Redo、spriteStorage 互換の import/export を提供する React Hook。
2. `SpriteEditUtils` – スナップやヒットテストなど、エディターでよく使うジオメトリ系ヘルパー。
3. シリアライズヘルパー – `DefaultSpriteTemplate` が spriteStorage 互換の JSON を生成/復元します。

---

## useSpriteEditor Hook

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

### オプション

| オプション                | 説明                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `initialState`            | マウント時の初期フレーム/アニメーション/メタ情報を指定します。 |
| `historyLimit`            | Undo スタックの最大保持数 (デフォルト 50)。                    |
| `trackSelectionInHistory` | `true` の場合、選択の変化も Undo 対象になります。              |

### 返される API

- `state`: フレーム、アニメーション、選択、クリップボード、履歴、メタ情報を含む完全な状態。
- `addFrame(frame, options?)`: フレームを追加して ID を自動採番し、アニメーション内の参照を再計算します。
- `updateFrame(id, partial)`: フレームの座標や duration を更新します (ID は保持)。
- `removeFrame(id)` / `removeFrames(ids)`: フレームを削除し、アニメーション参照もクリーンアップします。
- `reorderFrames(from, to)`: フレーム順序を並び替えてもアニメーション参照を保護します。
- `setSelection(ids, { append })` / `selectFrame` / `selectAll` / `clearSelection`: 選択状態を制御するユーティリティ。
- `copySelected` / `cutSelected` / `pasteClipboard({ index })`: クリップボード操作。ペースト時は ID を振り直します。
- `undo` / `redo` / `canUndo` / `canRedo`: Undo/Redo 操作と状態。
- `setAnimations` / `setAnimationsMeta` / `updateMeta`: アニメーションやメタ情報の更新。
- `exportJSON()`: スナップショットを spriteStorage 互換 JSON へシリアライズします。
- `importJSON(data)`: spriteStorage 互換 JSON から状態を復元します (Undo 対応)。
- `reset(nextState?)`: エディター内容を置き換えます。

### クリップボード利用例

```ts
const { state, copySelected, pasteClipboard } = useSpriteEditor();

const copy = () => {
  if (!state.selected.length) return;
  copySelected();
};

const paste = () => {
  pasteClipboard(); // 選択済みフレームの直後、または末尾に挿入
};
```

---

## シリアライズヘルパー

`exportJSON()` / `importJSON()` は常に組み込みの `DefaultSpriteTemplate` を使用し、spriteStorage 互換の JSON をやり取りします。SpriteAnimator へのプレビューや `spriteStorage` 連携はこの JSON をそのまま使えば OK です。

```ts
const payload = editor.exportJSON();
await saveSprite({ sprite: payload });

editor.importJSON(payload); // Undo 可能
```

保存前に一部のキーを削除したい場合は `cleanSpriteData` を通して正規化してください。

---

## ジオメトリヘルパー (`SpriteEditUtils`)

| ヘルパー                               | 説明                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `snapToGrid(value, gridSize, origin?)` | 指定グリッドへ値をスナップさせます (origin 既定値は `0`)。   |
| `normalizeRect(rect)`                  | 幅/高さが負数でも正規化し、`x/y` を補正します。              |
| `pointInFrame(point, rect)`            | ポイントが矩形内にあるか判定します (始点含む・終点除外)。    |
| `mergeFrames(frames)`                  | 与えられた矩形すべてを含むバウンディングボックスを返します。 |

これらのヘルパーはマーキー選択やハンドル描画など、UI 実装でよく使う下支えロジックとして活用できます。

---

## 移行メモ

- ランタイム側 (`SpriteAnimator` / `spriteStorage`) は従来と同じ JSON スキーマを受け付けます。
- エディター内部ではフレームごとに `id` を保持しますが、`exportJSON()` は出力時に ID を取り除くため、既存ランタイムを変更する必要はありません。
- 既存の `spriteStorage` JSON を編集したい場合は `DefaultSpriteTemplate.fromJSON()` で読み込み、編集後に再度 `exportJSON` してください。
- Undo スタックはデフォルトで 50 件です。`historyLimit` を調整してメモリ使用量とトレードオフできます。
