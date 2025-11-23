# 旧プレビューコンポーネント削除チェックリスト

- [x] README.md / README.ja.md: 旧プレビューの節・警告・コード例を削除し、AnimatedSprite2D のみの記述にする
- [x] docs/editor_api.md / docs/editor_api.ja.md: 旧プレビューへの言及やサンプルを削除し、AnimatedSprite2D のみを記載
- [x] examples/standalone-editor: 旧プレビュー利用箇所を AnimatedSprite2D に置き換えるか、サンプルごと削除（iOS プロジェクト名/Podfile/スキームも含む）
- [x] iOS プロジェクト命名: サンプルを残す場合は旧プレビュー由来の名称を中立名に変更。削除する場合はサンプルとともに除去
- [x] テスト: 旧プレビュー参照が残っていないか確認（legacy test は削除済み）
- [x] リリースノート (RELEASE_NOTES.md / RELEASE_NOTES.ja.md): 旧プレビュー記述を削除
- [x] コード全体確認: `rg "<旧名称>"` がヒットしないことを確認し、ビルド/テストが成功すること
- [x] package.json の説明やキーワードに旧プレビュー名称が残っていないか確認し、必要なら修正
- [x] CI / ワークフローで旧プレビュー前提のジョブやスクリプトがないか確認し、必要なら修正
- [x] 型定義・公開APIの再エクスポートに旧プレビューが残っていないか（例: `src/types`、`src/index.ts`）再確認
- [x] 変更後にビルド/テスト（例: `npm test`、`npm run lint`）を実行し、エラーがないことを確認
- [x] 他のCHANGELOG/履歴ファイルがあれば旧プレビュー記述を削除
