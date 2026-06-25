# HTML-Deck Architectural Decisions & Traps

このガイドラインは、`html-deck` ライブラリの WebComponents 設計、スライドアスペクト比の制御、印刷、および発表者ビュー（Presenter View）同期におけるアーキテクチャの意思決定と、過去に発生したバグやハマりどころ（トラップ）をまとめたものです。

---

## 1. WebComponents のライフサイクルとタイミング
- **接続イベント時の DOM 未完成トラップ**:
  `<hd-deck>` やその他の親コンポーネントがマウントされた直後に `connectedCallback()` が実行される際、ブラウザのHTMLエンジンによる Light DOM の子要素（`<hd-slide>` など）のパースは**まだ完了していません**。
  - **ルール**: `connectedCallback()` 内で同期的に `this.querySelectorAll('hd-slide')` や子要素の属性にアクセスしてはなりません。
  - **パターン**: 子要素の検出、初期スライド更新、リサイズ設定などは `setTimeout(..., 0)` ブロックでラップし、HTMLパーサーの完了を待ってから実行します。
- **動的スタイル挿入と寸法取得の遅延**:
  プレビューコンテナの `innerHTML` に `<style>` 要素を動的に挿入した直後に `clientWidth`/`clientHeight` などの寸法クエリを同期的に実行すると、ブラウザのスタイル計算が間に合わず `0` を返してしまい、スケーリング計算が壊れます。
  - **パターン**: スケール計算などの寸法依存のロジックは、`requestAnimationFrame` を用いて描画更新のタイミングまで遅延させます。
- **Shadow DOM 内の Slot クエリトラップ**:
  Shadow DOM 内で単に `shadowRoot.querySelector('slot')` を呼び出すと、DOM順で最初の slot が返されます。`header` や `footer` などの named slot がテンプレート内でデフォルト slot より前に置かれている場合、意図せず named slot を取得してしまいます。
  - **ルール**: デフォルトの slot を安全に対象にするには、必ず `shadowRoot.querySelector('slot:not([name])')` を使用します。

---

## 2. スライドのレイアウトとアスペクト比
- **仮想キャンバスによるスケーリング**:
  `html-deck` は 16:9 や 4:3 などのアスペクト比を維持するため、仮想の基準寸法（デフォルトは **960x540**）でキャンバスを構築し、リサイズ時に CSS Transform Scale でスケーリングします。
  - **ルール**: ビューポート依存のメディアクエリ（例: `@media (max-width: 768px)`）をスライド内容やカラムに適用してはなりません。スケールダウンした際にもメディアクエリが反応してレイアウトが崩れてしまいます。
  - **ルール**: メインコンテナである `.deck-container` には、親の flex ラッパーが変形前にサイズを縮小してしまうのを防ぐため、必ず `flex-shrink: 0;` (または `flex: none;`) を設定します。
  - **ルール**: モバイルブラウザでのアドレスバー表示切り替えに伴う縦揺れを防ぐため、`<hd-deck>` の `:host` の高さには動的ビューポート単位 `100dvh` (フォールバックとして `100vh`) を使用します。
- **スライドパディングによるレイアウトはみ出しバグ (重要)**:
  `hd-slide` の `:host`（`width: 100%`、`height: 100%`）に直接 `padding` を設定すると、ブラウザ間の `box-sizing` 解釈の差異により、960x540 の境界を越えてレイアウトがはみ出し、位置ズレが発生します。
  - **ルール**: **決して** `hd-slide.js` の `:host` に対して直接パディングを設定しないでください。
  - **パターン**: Shadow DOM 内のラッパー要素（例: `.slide-content`）に padding を定義します。`:host` は `overflow: hidden;` に設定します。
- **Box-Sizing グローバルリセットの継承トラップ**:
  `* { box-sizing: inherit; }` のような継承ベースのボックスサイズ指定を行うと、ホスト（埋め込み先）ページが `content-box` の場合にカスタム要素内部も `content-box` になり、余白がキャンバスからはみ出します。
  - **ルール**: [reset.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/reset.css) では必ず直接的なリセット `* { box-sizing: border-box; }` を適用し、Shadow DOM 内でも明示的に `box-sizing: border-box` を定義します。
- **スライドスクロールの廃止**:
  スライド自体の `scrollable` 属性および `height` 属性は廃止されました。
  - **パターン**: スライド全体のスクロールは許可せず、コンテンツが多くてはみ出る場合は、カードなどの局所的なコンテナに対して `style="max-height: 250px; overflow-y: auto;"` のように CSS でスクロールを有効にしてください。
- **方向揃えユーティリティ (Directional Alignment)**:
  中央寄せのための `.hd-mx-auto` は廃止されました。以下の揃え用ユーティリティを使用します。
  - 水平方向: `.hd-align-left`, `.hd-align-center`, `.hd-align-right`
  - 垂直方向（flexコンテナ用）: `.hd-align-top`, `.hd-align-middle`, `.hd-align-bottom`

---

## 3. インタラクションと操作
- **キーボードショートカットの修飾キー競合**:
  `Ctrl + P` や `Cmd + R` など、ブラウザや OS のデフォルトショートカットと競合して動作を妨げないようにする必要があります。
  - **ルール**: キーダウンイベントハンドラ `handleKeyDown` の先頭で、修飾キーフラグのいずれかが有効な場合は早期リターンします：
    `if (event.ctrlKey || event.metaKey || event.altKey) return;`
- **Footnote (脚注) の絶対配置**:
  - **パターン**: `slot="footnote"` が設定された要素は、スライドキャンバスに対して `bottom: 12px; left: 16px;` の絶対配置で左下に配置されます。これは [hd-slide.js](file:///home/likr/work/likr/html-deck/packages/html-deck/src/components/html-deck/hd-slide.js) の `::slotted([slot="footnote"])` で制御されます。
- **スロットされたヘッダーラッパーの表示切り替え（トグル）**:
  CSS の `:has()` 内で `::slotted(*)` などの擬似要素を使用することは仕様上無効です（例：`slot:not(:has(::slotted(*)))` は無効なセレクタとなります）。また、Shadow DOM 内の CSS から `:host(:has([slot="heading"]))` や `:host(:not(:has([slot="heading"])))` を使用して Light DOM 内の見出し要素の有無を判別することも、Shadow DOM のカプセル化境界があるためブラウザによっては正しく動作しません。
  - **ルール**: スロットされた要素の有無に基づいて Shadow DOM 内のラッパー（`.heading-area` や `.heading-divider` など）を表示・非表示にするには、JavaScript の `slotchange` イベントリスナーを使用してスロット内要素の有無を判定し、ホスト要素に `has-heading` 属性を動的に付与・削除します。
  - **ルール**: CSS 側では、デフォルトで見出し領域と境界線を非表示にし、余白を `--hd-slide-margin-top` に設定します。そして `:host([has-heading])` セレクタが適用された時のみ、見出し領域を表示し、余白を通常のレイアウト用余白（`var(--hd-gap-3)`）に切り替えるようにスタイルを定義してください。

---

## 4. 印刷と PDF エクスポート (`@media print`)
- **印刷時の JS スケーリング無効化**:
  印刷時にはブラウザの標準のページ割り当て機能に委ねるため、JavaScript による画面リサイズに応じた動的スケーリング（Scale Transform）を無効にします。
  - **ルール**: `handleResize()` 内で印刷判定を行い、印刷中はリサイズ処理をスキップします：
    `if (window.matchMedia('print').matches) return;`
- **物理的ページサイズと @page 規則**:
  Shadow DOM は global の `@page` ルールを無視します。
  - **ルール**: アスペクト比から印刷用の物理サイズを動的に計算し、`document.head` に対しグローバルな `@page` ルール（例: `size: 16in 9in; margin: 0;`）を動的にインジェクトします。
- **相対ビューポート単位の適用**:
  印刷用の用紙サイズにアスペクト比を合わせるため、`hd-slide` の `:host` サイズは印刷時に `width: 100vw; height: 100vh;` に設定し、特定の用紙サイズ（A4など）へのハードコードを避けます。

---

## 5. 発表者ビュー (Presenter View) と同期
- **相対アセット解像度の崩壊トラップ**:
  発表者ビューはメインのプレゼン画面とは異なる URL ディレクトリやウインドウで動作するため、スライドの HTML をそのまま `BroadcastChannel` 等で同期すると、画像（`<img>`）やコードブロック内の相対 URL パスが解決できずリンク切れになります。
  - **パターン**: スライドデータを別ウインドウに送信する前に、すべての相対 `src` および `href` 属性を絶対 URL（例: `new URL(val, window.location.href).href`）に書き換える処理を挟みます。

---

## 6. コンポーネント固有の実装パターン
- **hd-codeblock: 実行時 src フェッチの廃止 (DEPRECATED)**:
  ネットワーク依存やパス解決エラーを防ぐため、`<hd-codeblock>` の `src` 属性による動的フェッチは廃止されました。
  - **パターン**: Vite の `?raw` インポートを使用してソースコードを文字列として読み込み、`code` 属性に直接セットします。
    ```html
    <hd-codeblock language="javascript" id="my-block"></hd-codeblock>
    <script type="module">
      import codeText from './file.js?raw';
      document.getElementById('my-block').setAttribute('code', codeText);
    </script>
    ```
- **hd-table: カプセル化テーブルスロットクローンパターン**:
  Shadow DOM 内からは、スロットされた `::slotted(table)` の深い子要素（`tr`, `td`, `th`）を柔軟にスタイリングできません。
  - **パターン**: スロット要素自体は CSS で非表示にし（`slot { display: none; }`）、`slotchange` イベントをハンドリングしてテーブル要素を `table.cloneNode(true)` でコピーし、Shadow DOM 内のコンテナへ追加します。これにより Shadow DOM 境界内で完全なテーブルのスタイリングを可能にします。
- **レイアウトコンポーネントにおける余白・パディング挙動の統一**:
  すべてのレイアウト要素（`<hd-layout>`, `<hd-layout-cover>`, `<hd-layout-split>`, `<hd-layout-grid>`）は、余白設定に関して統一された挙動を提供する必要があります。
  - **パターン**: `:host` または内部のレイアウトコンテンツの padding には、直接値を指定せず、必ず `variables.css` で定義された統一的なレイアウト用 CSS 変数（例：`--hd-layout-body-padding` や `--hd-layout-cover-padding`）を使用します。
  - **パターン**: スロットされた `before` / `after` 要素の上下マージン（`--hd-layout-before-margin` / `--hd-layout-after-margin`）を、すべてのレイアウトコンポーネントの Shadow DOM 内で `::slotted([slot="before"])` / `::slotted([slot="after"])` セレクタを用いて一貫して適用してください。
- **hd-layout-grid: スロット要素による CSS Grid の構成**:
  - Shadow DOM 内の Grid コンテナ（`display: grid`）の直下にデフォルトの `<slot></slot>` を配置することで、スロットされた Light DOM の子要素を自動的に Grid アイテムとしてレイアウトできます。
  - スライド寸法からはみ出るのを防ぐため、Grid トラック定義（`grid-template-columns` / `grid-template-rows`）には必ず `minmax(0, 1fr)` を使用してください（例: `repeat(N, minmax(0, 1fr))`）。

