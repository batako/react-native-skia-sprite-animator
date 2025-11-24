<!--
- リリースノート テンプレート:
-   - セクション見出しはそのまま残してください。
-   - 空のセクションは公開前に削除してください。
-   - Issue がある場合は Issue へのリンクを優先し、なければコミットへのリンクを付けてください。
-->

## 🌟 ハイライト

- `AnimationStudio` のキーボード回避をオプトイン化し、ホスト側で必要なときだけ有効化できるようにしました（サンプルアプリは opt-in）（[`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)）。
- ストレージ／メタデータ／ファイルブラウザのモーダル配色とオーバーレイをライト/ダークで統一し、キーボード表示でも全画面が崩れないよう安定化しました（[`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5), [`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6)）。
- スタンドアロン編集画面のヘッダー整列と余白を調整し、タブレット表示の視認性を改善しました（[`d4fc909`](https://github.com/batako/react-native-skia-sprite-animator/commit/d4fc909), [`288b53a`](https://github.com/batako/react-native-skia-sprite-animator/commit/288b53a)）。

## ✨ 機能追加

- `AnimationStudio` に `enableKeyboardAvoidance` を追加（デフォルト false）。FPS/倍率/リネーム入力の自動スクロール・回避を必要な場合だけ有効化可能に（[`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)）。
- 横向きフルキーボード環境でのフォーム操作を改善し、入力欄が確実に見えるようスクロールとキーボード回避を組み合わせ（[`0e3f4f4`](https://github.com/batako/react-native-skia-sprite-animator/commit/0e3f4f4), [`97a8fc1`](https://github.com/batako/react-native-skia-sprite-animator/commit/97a8fc1)）。
- ファイルブラウザのリストをフラットなスクロール表示に刷新し、VirtualizedList のネスト警告を解消（[`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6), [`21f6832`](https://github.com/batako/react-native-skia-sprite-animator/commit/21f6832)）。

## 🐞 バグ修正

- ストレージ/ファイルブラウザ/メタデータのモーダルがキーボード表示で縮む・閉じる問題を修正し、オーバーレイ境界を安定化（[`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5)）。
- ファイルブラウザで VirtualizedList のネスト警告を除去（[`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6), [`21f6832`](https://github.com/batako/react-native-skia-sprite-animator/commit/21f6832)）。
- メタデータモーダルのラベル/ボタン/テキスト色をほかのモーダルセクションと揃え、ライト/ダーク両方で統一（[`d601726`](https://github.com/batako/react-native-skia-sprite-animator/commit/d601726), [`e4794af`](https://github.com/batako/react-native-skia-sprite-animator/commit/e4794af), [`ab625db`](https://github.com/batako/react-native-skia-sprite-animator/commit/ab625db)）。
- スタンドアロン画面のヘッダーアイコン位置や余白のずれを修正（[`d4fc909`](https://github.com/batako/react-native-skia-sprite-animator/commit/d4fc909), [`288b53a`](https://github.com/batako/react-native-skia-sprite-animator/commit/288b53a)）。

## 🔧 リファクタ

- モーダルオーバーレイの共通スタイルを整理し、React Native `Modal` 依存を外して Animation Studio と揃った軽量な重ね合わせに統一（[`28dfde6`](https://github.com/batako/react-native-skia-sprite-animator/commit/28dfde6), [`94560c5`](https://github.com/batako/react-native-skia-sprite-animator/commit/94560c5)）。
- README/README.ja に `enableKeyboardAvoidance` の説明を追加し、サンプルのみ opt-in で使う方針を明記（[`9823eb8`](https://github.com/batako/react-native-skia-sprite-animator/commit/9823eb8)）。

## 📜 変更履歴全文

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.4.0...v0.5.0
