# スタンドアロン スプライトエディタ (Expo)

この Expo アプリは `react-native-skia-sprite-animator` が提供するすべての API を実際に動かしながら確認できるサンプルです。v0.4.x 以降のリファレンス実装として、プロジェクトのロードマップで定義されたエディター構成をそのまま再現しています。

## 特徴

- `useSpriteEditor` を使ったリアルタイム編集 (フレーム CRUD / 選択 / クリップボード / Undo/Redo)
- `SpriteAnimator` によるキャンバス上でのプレビュー再生
- `SpriteTemplate` + `DefaultSpriteTemplate` によるテンプレートのインポート / エクスポート
- `spriteStorage` を利用したローカル永続化
- `SpriteEditUtils` を用いたグリッド描画・スナップ・ヒットテスト
- 表示名・オリジン・バージョンなどのメタデータ編集

## セットアップ

```bash
npm install
npm run start
```

このサンプルは `link:../../` でライブラリ本体を参照しているため、リポジトリ内で行った変更が即座にエディタへ反映されます。

## ディレクトリ構成

```
examples/standalone-editor/
  App.tsx
  src/
    screens/EditorScreen.tsx
    components/
      SpriteCanvasView.tsx
      FrameList.tsx
      PlaybackControls.tsx
      TemplatePanel.tsx
      StoragePanel.tsx
      MetaEditor.tsx
    hooks/
      useEditorIntegration.ts
  assets/
    sample-sprite.png
```

各コンポーネントは対応する API を分かりやすく見せることだけに集中しており、装飾的なスタイルは最小限に抑えています。コードを読みながら仕組みを把握しやすいことを重視したサンプルです。
