<!--
- リリースノート テンプレート:
-   - セクション見出しはそのまま残してください。
-   - 空のセクションは公開前に削除してください。
-   - Issue がある場合は Issue へのリンクを優先し、なければコミットへのリンクを付けてください。
-->

## 🌟 ハイライト

- `AnimationStudio` から共有スプライトシート `image` props を削除し、各フレームが `imageUri` を持つ前提に簡素化。ビルド時に差分が分かる破壊的変更です（[`90b05d7`](https://github.com/batako/react-native-skia-sprite-animator/commit/90b05d7)）。
- タイムライン貼り付け後もカーソル/選択を維持し、新規フレームへ自動スクロールして視界に入るよう改善（[`f06a23c`](https://github.com/batako/react-native-skia-sprite-animator/commit/f06a23c), [`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1), [`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)）。
- spriteStorage の一覧を新しい順に並べ替え、直近の作業を見つけやすく変更（[`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)）。

## ✨ 機能追加

- 各フレームの `imageUri` 前提で `AnimationStudio` を簡潔に利用可能に（共有シート props を削除） ([`90b05d7`](https://github.com/batako/react-native-skia-sprite-animator/commit/90b05d7))。
- タイムラインで貼り付けたフレームへ自動スクロールし、視界内に保持する挙動を追加（[`36c0d41`](https://github.com/batako/react-native-skia-sprite-animator/commit/36c0d41)）。
- spriteStorage の一覧を作成日時の新しい順にソート（[`32513cb`](https://github.com/batako/react-native-skia-sprite-animator/commit/32513cb)）。

## 🐞 バグ修正

- 貼り付け後に選択が先頭へ戻る問題を修正し、シーケンス伸長時にもカーソルを維持（[`f06a23c`](https://github.com/batako/react-native-skia-sprite-animator/commit/f06a23c), [`5b35bc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/5b35bc1)）。
- 依存パッケージの監査警告を解消 (`npm audit fix`)（[`00429f3`](https://github.com/batako/react-native-skia-sprite-animator/commit/00429f3), [`b535e46`](https://github.com/batako/react-native-skia-sprite-animator/commit/b535e46)）。

## 🔧 リファクタ

- タイムラインの自動スクロール実装に伴い、依存解決と lint 対応を整理（[`22e3b10`](https://github.com/batako/react-native-skia-sprite-animator/commit/22e3b10)）。

## 📜 変更履歴全文

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.5.0...v0.6.0
