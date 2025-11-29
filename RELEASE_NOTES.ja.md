<!--
- リリースノート テンプレート:
-   - セクション見出しはそのまま残してください。
-   - 空のセクションは公開前に削除してください。
-   - Issue がある場合は Issue へのリンクを優先し、なければコミットへのリンクを付けてください。
-->

## 🌟 ハイライト

- `AnimationStudio` で `editor`/`integration` を省略した際に内部で自動生成できるようにし、単一画面埋め込みを簡素化（[`baca973`](https://github.com/batako/react-native-skia-sprite-animator/commit/baca973)）。

## ✨ 機能追加

- `AnimationStudio` が `imageUri` 前提で、editor/integration を省略可能に（[`baca973`](https://github.com/batako/react-native-skia-sprite-animator/commit/baca973)）。
- タイムラインで貼り付けたフレームへ自動スクロールし、視界内に保持する挙動を追加（[`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)）。
- spriteStorage の一覧を作成日時の新しい順にソート（[`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)）。

## 🐞 バグ修正

- 貼り付け後に選択が先頭へ戻る問題を修正し、シーケンス伸長時にもカーソルを維持（[`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1), [`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)）。
- 依存パッケージの監査警告を解消 (`npm audit fix`)（[`b535e46`](https://github.com/batako/react-native-skia-sprite-animator/commit/b535e46)）。

## 🔧 リファクタ

- タイムラインの自動スクロール実装に伴い、依存解決と lint 対応を整理（[`22e3b10`](https://github.com/batako/react-native-skia-sprite-animator/commit/22e3b10)）。

## 📜 変更履歴全文

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.6.0...v0.6.1
