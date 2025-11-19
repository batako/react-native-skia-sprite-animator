## 🌟 ハイライト

- v0.4.0 では `AnimatedSprite2D` ランタイム / フック / 共有ティッカーを正式提供し、React の再描画に依存しないスプライト再生をアプリ/エディタの両方で実現しました（[`15bfa76`](https://github.com/batako/react-native-skia-sprite-animator/commit/15bfa76) … [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897)）。
- AnimationStudio のタイムライン / ストレージを全面的に再設計し、JSON 永続化・メタデータ編集・フレームごとの画像・再生方向 / オートプレイ制御などを v0.4.0 で網羅しました（例: [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6), [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c)）。
- Expo 製スタンドアロンエディタは v0.4.0 で App Store 提出を想定した法務情報センター、タブレット向けアセット、ローカライズ済みコピー、依存性整備を完了しています（[`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b)）。

## ✨ 機能追加

- [`fa0d371`](https://github.com/batako/react-native-skia-sprite-animator/commit/fa0d371), [`915f484`](https://github.com/batako/react-native-skia-sprite-animator/commit/915f484), [`29e2e73`](https://github.com/batako/react-native-skia-sprite-animator/commit/29e2e73), [`750d897`](https://github.com/batako/react-native-skia-sprite-animator/commit/750d897) `AnimatedSprite2D` コンポーネント群（Hook / コンテナ / プレビュー / ティッカー連携）を追加し、タイムラインを手書きコード無しで描画可能に。
- [`8980fd6`](https://github.com/batako/react-native-skia-sprite-animator/commit/8980fd6) フレームごとに別画像を割り当てる機能をサポートし、複数テクスチャのアニメやメタデータを扱えるように。
- [`e01831c`](https://github.com/batako/react-native-skia-sprite-animator/commit/e01831c), [`6da2d38`](https://github.com/batako/react-native-skia-sprite-animator/commit/6da2d38), [`e72812b`](https://github.com/batako/react-native-skia-sprite-animator/commit/e72812b) エディタとランタイムに再生方向（正/逆）の切り替えを追加。
- [`7275983`](https://github.com/batako/react-native-skia-sprite-animator/commit/7275983), [`5145b09`](https://github.com/batako/react-native-skia-sprite-animator/commit/5145b09), [`fd910ee`](https://github.com/batako/react-native-skia-sprite-animator/commit/fd910ee), [`6a02c8e`](https://github.com/batako/react-native-skia-sprite-animator/commit/6a02c8e) Expo エディタの情報センター / 法務モーダル / スライドアニメ / タブレットスプラッシュを刷新。
- [`bceba0e`](https://github.com/batako/react-native-skia-sprite-animator/commit/bceba0e), [`a32992b`](https://github.com/batako/react-native-skia-sprite-animator/commit/a32992b) Expo 依存関係・lockfile・`eas.json`・アセットを App Store 向けに整備。
- [`0a3ea89`](https://github.com/batako/react-native-skia-sprite-animator/commit/0a3ea89), [`6c54b70`](https://github.com/batako/react-native-skia-sprite-animator/commit/6c54b70), [`e6fc8a2`](https://github.com/batako/react-native-skia-sprite-animator/commit/e6fc8a2), [`aeb6554`](https://github.com/batako/react-native-skia-sprite-animator/commit/aeb6554) エディタ UI を英日ローカライズし、プレビューやトーストをロケールに応じて表示。

## 🐞 バグ修正

- [`6ff22e0`](https://github.com/batako/react-native-skia-sprite-animator/commit/6ff22e0) ティッカーとタイムラインの同期ズレを修正。
- [`2a426da`](https://github.com/batako/react-native-skia-sprite-animator/commit/2a426da), [`39420ab`](https://github.com/batako/react-native-skia-sprite-animator/commit/39420ab) アニメ切替やフレーム移動時にタイムライン選択と倍率入力が失われないよう修正。
- [`8f164ff`](https://github.com/batako/react-native-skia-sprite-animator/commit/8f164ff), [`680a939`](https://github.com/batako/react-native-skia-sprite-animator/commit/680a939) フレーム削除や並べ替え時でもプレビュー状態を保持。
- [`cfd1ca3`](https://github.com/batako/react-native-skia-sprite-animator/commit/cfd1ca3) 空アニメーション時のプレビューレイアウト崩れを修正。

## 🔧 リファクタリング

- [`237cbf3`](https://github.com/batako/react-native-skia-sprite-animator/commit/237cbf3), [`421f535`](https://github.com/batako/react-native-skia-sprite-animator/commit/421f535), [`65556d2`](https://github.com/batako/react-native-skia-sprite-animator/commit/65556d2) メタデータ / ストレージ Hook を JSON 永続化前提に再構築し、テンプレート切替を廃止。
- [`f278a54`](https://github.com/batako/react-native-skia-sprite-animator/commit/f278a54), [`2fa6090`](https://github.com/batako/react-native-skia-sprite-animator/commit/2fa6090), [`a12420d`](https://github.com/batako/react-native-skia-sprite-animator/commit/a12420d) タイムライン系コンポーネント/Hook を分離し、編集フローを単純化。
- [`331ed39`](https://github.com/batako/react-native-skia-sprite-animator/commit/331ed39), [`b7f7655`](https://github.com/batako/react-native-skia-sprite-animator/commit/b7f7655) 旧 PreviewPlayer 実装を撤去し、サンプルの import/ lint 設定を整理。

## 📜 変更履歴全文

- https://github.com/batako/react-native-skia-sprite-animator/compare/v0.3.0...v0.4.0
