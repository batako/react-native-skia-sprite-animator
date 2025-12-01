# react-native-skia-sprite-animator

`react-native-skia-sprite-animator` は React Native / Expo + [@shopify/react-native-skia](https://shopify.github.io/react-native-skia/) 向けの UI 非依存ヘルパーです。推奨ランタイムである `AnimatedSprite2D`、永続化ヘルパー（`spriteStorage`）、エディター用の headless API 群をまとめて提供します。

## 機能一覧

- **AnimatedSprite2D**: エディター/テンプレートが出力する JSON をそのまま読み込み、オートプレイ、タイムライン上書き、反転描画、プレビューごとの `scale`、命令的ハンドルを提供する軽量ランタイム
- **spriteStorage**: `saveSprite` / `loadSprite` / `listSprites` / `deleteSprite` と保存先設定ヘルパーで JSON+メタデータを永続化
- **エディター API**: `useSpriteEditor`（フレーム CRUD、選択、クリップボード、Undo/Redo、メタ編集）、`useTimelineEditor` / `useMetadataManager` / `useSpriteStorage` など UI 非依存フック、`DefaultSpriteTemplate`（インポート/エクスポート）、`SpriteEditUtils`（グリッドスナップ、矩形マージ、ヒットテスト）
- **Expo スタンドアロンエディタ**: `examples/standalone-editor/` に API をまとめたサンプルアプリを同梱

## インストール

```bash
npm install react-native-skia-sprite-animator
npx expo install react-native @shopify/react-native-skia expo-file-system
```

> Expo SDK 54 / React Native 0.81.5（>=0.81 で確認）/ React 19.1.0 を standalone-editor で検証済み。

## AnimatedSprite2D の使い方

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
      centered
      scale={1}
    />
  );
}
```

`AnimatedSprite2D` は `cleanSpriteData` や `buildAnimatedSpriteFrames`、Animation Studio のエクスポートが生成する `SpriteFramesResource` をそのまま受け取ります。命令的ハンドル（`play` / `pause` / `seekFrame` など）も提供し、追加の Skia 設定なしで扱えます。描画を拡大/縮小したい場合は `scale` を指定すれば、キャンバスサイズや中心揃え・オフセットもまとめてスケールされ、`style` で幅/高さを渡す必要はありません。

描画サイズを変えたい場合は `scale` を渡すだけで、キャンバスの大きさや中心揃え、オフセットもまとめてスケールされます。

サイズの算出は「選択中アニメーション」のフレーム列を優先し、それが取れない場合に全フレームへフォールバックします。シート全体の最大サイズではなく、選択中のアニメに合わせて `scale` が効く挙動です。

### フレームイベント

プレビューコンポーネントの `onFrameChange` / `onAnimationEnd` で進行をフックできます。ペイロードは `{ animationName, frameIndex, frameCursor }`。

## spriteStorage API

`spriteStorage` は `expo-file-system` 配下に `/sprites/meta` と `registry.json` を作成し、スプライトとメタデータを保存します。

### 設定ヘルパー

- `configureSpriteStorage({ rootDir })`: ルートを `documentDirectory/sprites/` から変更
- `getSpriteStoragePaths()`: 内部ディレクトリと registry のパスを参照
- `clearSpriteStorage()`: 生成されたフォルダ/registry を削除（テストやリセット用）

## エディター API

エディター用のプリミティブは `src/editor/` にあり、UIに依存せず自由に組み合わせ可能です。

- `useSpriteEditor`: フレーム操作、選択、クリップボード、Undo/Redo、テンプレートベースの入出力を管理するフック
- `useEditorIntegration`: `useSpriteEditor` の状態とプレビューランタイムを接続（再生制御、速度、選択同期など）
- `useTimelineEditor`: タイムラインの選択、クリップボード、レイアウト計測を管理し、プレビューと同期
- `useMetadataManager`: `{ key, value }` のメタ行を正規化し、追加/削除/保存を補助
- `useSpriteStorage`: `spriteStorage` をUI向けの状態（`status`, `isBusy`, `SpriteSummary`一覧）でラップし、カスタムストレージも注入可能
- `AnimationStudio`: 上記フックをまとめた完成済みエディター画面（フレーム、メタデータ、JSON入出力、ストレージ、タイムライン、プレビュー）。`useSpriteEditor` / `useEditorIntegration` を外から渡してもよし、省略して内部で自動生成させてもよし。各フレームは `imageUri` を持つ前提です。
- `SpriteEditUtils`: グリッドスナップ、矩形正規化、ヒットテストなどの幾何ヘルパー
- `DefaultSpriteTemplate`: エディター状態を `spriteStorage` と同じ JSON 形へシリアライズ

## スタンドアロンエディタ (Expo サンプル)

`examples/standalone-editor/` に、全APIを1画面にまとめた Expo デモがあります。自作ツールの参考にしてください。

デモ内容:

- `useSpriteEditor` によるフレームCRUD、選択、クリップボード、Undo/Redo、テンプレート対応の入出力
- ライブ編集中の状態をプレビューランタイムに流し込み、シーク/一時停止/速度変更をリアルタイム反映
- `spriteStorage` の JSON（DefaultSpriteTemplate）を確認できる入出力パネル
- `spriteStorage` バックエンドでのローカル永続化（`saveSprite` / `loadSprite` / `listSprites` / `deleteSprite`）
- Skiaキャンバス上の `SpriteEditUtils`（グリッド、ヒットテスト、選択境界など）を文脈付きで確認

ローカル実行: `examples/standalone-editor` で `npm install` → `npm run start`。`link:../../` でメインパッケージにリンクしているため、ライブラリの編集がデモに即時反映されます。

## 開発

```bash
npm install
npm run build
# npm publish と同じ tarball を生成したい場合
npm pack
```

ビルド成果物は `dist/`（ESM + 型定義）に出力されます。フックやUIコンポーネントはUI非依存の方針で提供されています。

## ライセンス

MIT
