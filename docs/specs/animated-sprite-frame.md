# AnimatedSprite2D フレーム仕様 (frames / animations)

Animation Studio と AnimatedSprite2D が扱うフレームデータ仕様と、リソース変換のルールをまとめています。

## フレームデータ

- `frames: SpriteFrame[]`
  - `id: string` – フレームの安定識別子（エディター内で生成）。
  - `x, y, w, h: number` – スプライトシート上の矩形。`x/y` 未指定でも OK（全体画像を使う）。
  - `duration?: number` – ミリ秒単位の再生時間。未指定時はアニメーション FPS を使用。
  - `imageUri: string` – フレーム単位の画像 URI。AnimationStudio/AnimatedSprite2D は各フレームが自身の画像を指す前提でプレビューします。
  - `offset?: { x: number; y: number }` – キャンバス中心からの描画オフセット。AnimatedSprite2D で利用。
- `animations: Record<string, number[]>`
  - アニメーション名 → フレーム index の配列。index は `frames` の並びを参照。
- `animationsMeta?: Record<string, { loop?: boolean; fps?: number; multipliers?: number[] }>`
  - `fps` は 0 より大きい数値をそのまま使用（既定値 12）。`loop` は既定 `true`。
  - `multipliers` は各フレームの再生倍率。`frames` / `animations` 変更時に自動で長さを合わせ、値は `0.01`〜`100` にクランプ。
- `autoPlayAnimation?: string | null`
  - プレビュー・エクスポート時の初期再生ターゲット。未設定なら先頭アニメーション。
- `meta?: Record<string, unknown>`
  - 任意のメタ情報。エディターのメタデータモーダル経由で編集・保存。

## フレーム時間の解決順

- `animationsMeta[name].fps` があればそれを優先（12 FPS 相当を既定値として使用）。
- `fps` が無ければ `frame.duration`（ミリ秒）を採用し、最小 1ms までクランプ。
- どちらも無ければ 12 FPS 相当の時間を使用。
- 再生時は `multipliers` の倍率を掛けた上で、`speedScale`（0.01〜32 にクランプ）で割って最終的な間隔を決定。

## AnimatedSprite2D でのフレームリソース変換

エディターの `buildAnimatedSpriteFrames` は上記エディター状態を `SpriteFramesResource` に変換し、AnimatedSprite2D がそのまま再生できる形にします。画像ソースは以下いずれか：

- `type: 'uri'` + `uri`（オプションで `subset` を付与）
- `type: 'require'` + `assetId`（Metro バンドル済み画像）
- `type: 'skImage'` + `image`（Skia 画像オブジェクト）

`subset` がある場合、指定矩形のみを描画します。
