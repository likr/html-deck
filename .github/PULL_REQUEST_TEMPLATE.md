## 概要 (Summary)

<!-- この Pull Request の目的と変更の概要を記入してください -->

## 関連 Issue (Related Issues)

<!-- 例: Closes #4 -->

## 変更内容 (Changes)

- 

## 対象パッケージ (Affected Packages)

- [ ] `packages/html-deck` (Core Library / WebComponents / Themes)
- [ ] `packages/create-html-deck` (CLI Scaffolder)
- [ ] `packages/html-deck-validator` (Headless Playwright Slide Validator)
- [ ] `packages/html-deck-demo` (Demo & Feature Showcase)
- [ ] `packages/slides` (Sample Presentations)
- [ ] `.agents/` / Documentation / Tests

## 検証・チェックリスト (Verification Checklist)

- [ ] `npm run build` がエラーなく成功する
- [ ] `npm test` (Playwright E2E テストスイート) がすべてパスする
- [ ] `npm run validate` (`html-deck-validator` による全テーマ・全スライドのコントラスト／はみ出し／重なり検査) がすべてパスする
- [ ] `.agents/AGENTS.md` の規約（スライド内のカスタムCSS／インラインスタイル禁止、テーマの `:root` CSS変数オーバーライド原則、明示的な変数名）に準拠している
