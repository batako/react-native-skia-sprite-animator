## 🌟 ハイライト

- v0.4.0 では `AnimatedSprite2D` が正式ランタイムとなり、Hook / ティッカー / プレビューを揃えて React の再描画に依存しないスプライト再生を実現しました（[`15bfa76`](https://github.com/batako/react-native-skia-sprite-animator/commit/15bfa76) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897)）。
- AnimationStudio のストレージ / タイムラインを JSON 永続化・フレーム別画像・オートプレイ / 再生方向に合わせて全面刷新し、新ランタイムと同じ表現力を備えました（[`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c)）。
- 同梱の Expo エディタは情報 / 法務モーダルのローカライズ、新しいアイコン / スプラッシュ、ストア提出向け設定調整まで完了し、配布に耐える状態になりました（[`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b)）。

## ✨ 機能追加

- [`fa0d371`](https://github.com/batako/react-native-skia-sprite-animator/commit/fa0d371) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897) `AnimatedSprite2D` コンポーネント / Hook / ティッカー / プレビューを一式提供し、手動タイマーなしでスプライト再生を構築可能に。
- [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3) フレームごとの画像や JSON メタデータを保存できるようにし、複数テクスチャやオートプレイ設定を扱えるように。
- [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c), [`6da2d38`](https://github.com/batako/react-native-skia-sprite-animator/commit/6da2d38), [`b00e57c`](https://github.com/batako/react-native-skia-sprite-animator/commit/b00e57c) 再生方向の切り替えと、再生中は破壊的操作をロックする仕組みを追加。
- [`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b) Expo エディタにローカライズ済み情報 / 法務モーダル、スライド演出、タブレット資産、配布向け設定強化を追加。

## 🐞 バグ修正

- [`384ec9a`](https://github.com/batako/react-native-skia-sprite-animator/commit/384ec9a), [`2a426da`](https://github.com/batako/react-native-skia-sprite-animator/commit/2a426da) フレーム並べ替えやアニメ切替を行っても選択が最初のフレームへ戻らないよう修正。
- [`4202fc8`](https://github.com/batako/react-native-skia-sprite-animator/commit/4202fc8), [`c86189c`](https://github.com/batako/react-native-skia-sprite-animator/commit/c86189c) ストレージから読み込み / 削除を行った際に再生状態と選択を初期化し、意図しない再生継続を防止。
- [`611a0a0`](https://github.com/batako/react-native-skia-sprite-animator/commit/611a0a0), [`6860f6b`](https://github.com/batako/react-native-skia-sprite-animator/commit/6860f6b), [`f638ee8`](https://github.com/batako/react-native-skia-sprite-animator/commit/f638ee8) ステッパー操作で入力フォーカスを解除し、ストレージパネルを閉じた際はリネームフォームを確実にリセット。
- [`3a9f3bf`](https://github.com/batako/react-native-skia-sprite-animator/commit/3a9f3bf) スプライトアップロード時のファイルサイズチェックを強化し、異常データで保存が落ちないように。

## 🔧 リファクタリング

- [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`65556d2`](https://github.com/batako/react-native-skia-sprite-animator/commit/65556d2) メタデータ / ストレージ Hook を JSON 永続化前提で再設計し、ツールバー操作も統一。
- [`331ed39`](https://github.com/batako/react-native-skia-sprite-animator/commit/331ed39), [`b7f7655`](https://github.com/batako/react-native-skia-sprite-animator/commit/b7f7655) 旧 `PreviewPlayer` を撤去し、サンプルアプリを AnimatedSprite2D プレビューに合わせて整理。
- [`2080b16`](https://github.com/batako/react-native-skia-sprite-animator/commit/2080b16), [`879484c`](https://github.com/batako/react-native-skia-sprite-animator/commit/879484c), [`2f227dc`](https://github.com/batako/react-native-skia-sprite-animator/commit/2f227dc) 不要なドキュメントやステータスメッセージを削除し、`.npmignore` を追加して公開パッケージを最小構成に。

## 📜 変更履歴全文

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.3.0...v0.4.0
