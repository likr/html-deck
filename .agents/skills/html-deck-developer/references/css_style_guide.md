# HTML-Deck CSS Coding Style Guide

このガイドラインは、`html-deck` ライブラリのCSS設計およびコーディングスタイル規約を定めたものです。コーディングスタイルの違反（特にCSS変数の扱い、直接値の設定、px以外の単位使用、定義場所の誤り）を防ぐため、以下のルールを必ず厳格に遵守してください。

---

## 1. CSS変数 (Custom Properties) の定義と参照ルール (最重要)
- **定義時のデフォルト値設定**:
  すべてのプレゼンテーション用CSS変数は、[variables.css](file:///home/likr/html-deck/packages/html-deck/src/styles/variables.css) の `:root` セレクタ下など、適切な定義場所で**明示的にデフォルト値（初期値）を設定して定義**しなければなりません。
- **参照時のフォールバック値使用禁止**:
  Shadow DOM 内のスタイルシートやコンポーネント、その他すべての場所でCSS変数を参照する際、`var(--hd-name)` のように直接変数名のみで参照し、**フォールバック値（第2引数）をインラインで指定してはなりません**。
  - ❌ 誤り: `color: var(--hd-primary-color, #0076ff);`
  -  正しい: `color: var(--hd-primary-color);`
  - **理由**: インラインでフォールバックを重複して書くと、テーマシステムやデフォルト値の管理が分散し、DRY（Don't Repeat Yourself）でなくなりメンテナンス性が著しく低下するためです。
- **変数名の明示的定義（省略形の禁止）**:
  新しく導入または変更するすべてのCSS変数名において、`bg` や `fg` などの省略形を使用してはなりません。背景色や文字色を表す場合は、必ず `background-color`、`text-color` などのように明示的なフルスペルを使用してください。
  - ❌ 誤り: `--hd-layout-heading-bg`, `--hd-card-bg`, `--hd-layout-heading-color`
  -  正しい: `--hd-layout-heading-background-color`, `--hd-card-background-color`, `--hd-layout-heading-text-color`

---

## 2. スタイル割当時の直接値の設定禁止 (最重要)
- **原則**: スタイルの割当（色、フォントサイズ、余白、フォントスタイルなど）において、プロパティに対して**直接値（リテラルや生の値）を設定してはなりません**。
  - 必ず設定変数（`--hd-base-color-0`、`--hd-size-1`、`--hd-gap-1`、`--hd-text-heading-font` など）を介して反映させてください。
  - ❌ 誤り: `color: #333;`、`font-size: 16px;`、`margin: 20px;`
  -  正しい:
    ```css
    color: var(--hd-text-color);
    font-size: var(--hd-text-size-3);
    margin: var(--hd-gap-3);
    ```
- **例外**: レイアウトの微調整（ネガティブマージンによるヘッダーの拡張など、計算上必要なもの）を除き、すべての視覚的要素（余白、色、サイズ）は設定変数を使用します。

---

## 3. サイズ単位としての `px` の原則使用 (最重要)
- **原則**: すべてのレイアウトサイズ、フォントサイズ、ギャップ、余白、パディングの定義には**原則として絶対ピクセル（`px`）を使用します**。
  - `rem` や構造的な `em` 値は、埋め込み先のページ（ホストページ）のルートフォントサイズやブラウザのアクセシビリティ設定に依存するため、540p（960x540）の仮想キャンバスに対してテキストのオーバーフローやレイアウト崩れを引き起こします。
  - ❌ 誤り: `font-size: 1.5rem;`、`padding: 2em;`
  -  正しい: `font-size: 24px;`、`padding: 32px;`

---

## 4. スタイル定義の適切な場所 (最重要)
スタイルの定義は、その役割に応じて適切なファイル（場所）で行わなければなりません。

1. **標準HTMLのベースライン/グローバルリセット**:
   - [reset.css](file:///home/likr/html-deck/packages/html-deck/src/styles/reset.css) で行います。ワイルドカードの `box-sizing` ルール、マージン・パディングの初期リセット、メディアタグのブロック表示などが該当します。
2. **パブリックなグローバルCSS変数**:
   - [variables.css](file:///home/likr/html-deck/packages/html-deck/src/styles/variables.css) の `:root` セレクタ下で一括定義します。テーマ切り替えのベースとなる変数やフォント定義がこれに該当します。
3. **標準HTML要素のスタイルおよびスロットスルーのデフォルト**:
   - [elements.css](file:///home/likr/html-deck/packages/html-deck/src/styles/elements.css) で行います。スロットされた要素の `color: inherit` 設定や、セマンティックなマークアップのベースが含まれます。
4. **レイアウトやマークアップの補助ユーティリティ**:
   - [utilities.css](file:///home/likr/html-deck/packages/html-deck/src/styles/utilities.css) または [components.css](file:///home/likr/html-deck/packages/html-deck/src/styles/components.css) で行います。
5. **コンポーネント固有のスタイル**:
   - WebComponent の Shadow DOM スタイルシート（各 JS 内）で定義します。コンポーネントの構造や動作に必要な境界内部 of スタイルです。
    - **注意**: レイアウトコンポーネントにおいては、`:host` に対して直接 padding を設定することは避け、必ず `.layout-content` や `.cover-content` などの内部ラッパーに対して設定変数（`--hd-layout-body-padding` や `--hd-layout-cover-padding`）を介して padding を適用してください。
    - **注意**: `hd-card`, `hd-box`, `hd-callout` などのコンテナ型コンポーネント、レイアウト見出し領域の背景スタイル、および見出し区切り線 (divider) には、`background-color` プロパティではなく、`background` 略記法プロパティを使用してください。これにより、カスタムテーマから線形・放射状グラデーション（`linear-gradient` / `radial-gradient`）背景や模様をCSS変数経由で適用できるようになります。
    - **注意**: `hd-card` は内容に応じた自動的な高さを維持するため、`:host` に `align-self: flex-start;` が適用されており、Flexbox/Grid レイアウト内でも縦に引き伸ばされません。一方、`hd-box` はコンテナの高さ全体を埋めるように設計されており、`:host` の高さが `100%` に設定されています。そのため、`hd-layout-grid` 内で各グリッドアイテムの高さを揃えたい場合は、`hd-card` ではなく `hd-box` の使用を推奨します。
    - **注意**: `!important` をグローバルなリセットルール（`*:last-child { margin-bottom: 0 !important; }` など）で使用することは、個別ユーティリティクラス（`.hd-align-middle` など）の挙動を破壊するため禁止します。

---

## 5. テーマ（Theme）設計とオーバーライドの規則
- **Skeletonライブラリとしての原則**:
  `html-deck` はデフォルトでインディゴ×バーントオレンジの標準テーマ（`variables.css`）を備え、外部のテーマCSSファイル（`html-deck.theme-*.css`）やカスタムテーマによって見た目を切り替えます。
- **テーマCSSの記述制限と Cascade Layers による優先度保証**:
  内部のCSSファイルは `html-deck.css` にて `@layer hd-reset, hd-variables, hd-elements, hd-components, hd-utilities;` のレイヤー順序で宣言され、`document.head.prepend()` で注入されます（発表者ビューは `@layer hd-presenter-variables`）。
  テーマCSSは、**レイヤー外（unlayered）の `:root` セレクタ下でCSS変数をオーバーライド**しなければなりません。unlayered な定義は layered な定義よりも常に優先されるため、`html:root` のような詳細度ハックを使わずに標準の `:root` だけで読み込み順序に依存しない確実な上書きが保証されます。
  テーマCSS内でHTMLタグやクラス名（`hd-slide` や `.hd-card` など）、あるいはユニバーサルセレクタ `* { ... }` を直接ターゲットにしてはなりません。
- **4色ベースパレットと48色マトリクス（3-Variant × 2-Surface）**:
  すべてのテーマは `:root` 下で4つの基本色（`--hd-theme-background-color`, `--hd-theme-text-color`, `--hd-theme-main-color`, `--hd-theme-accent-color`）を起点とし、`base` / `main` / `accent` の3バリアント × `soft` / `solid` の2サーフェス × `heading` / `body` の2領域 × 4ロール（`background-color`, `text-color`, `text-highlight-color`, `text-muted-color`）の計48変数と、各サーフェスの境界線変数 `--hd-{variant}-{surface}-border` を定義します。
- **CSS Relative Color Syntax と `color-mix()` の活用**:
  テーマCSS内では、透明度や影、ボーダー、ハイライト色の導出に **CSS Relative Color Syntax** および `color-mix()` を使用します。
  - 特にダークバナーや `solid` サーフェス上の強調色（`text-highlight-color`）では、`color-mix(in srgb, accent 5%, white)` を使うと彩度が失われてグレー化するため、**HSL 相対色構文**（例: `hsl(from var(--hd-theme-accent-color) h 90% 82%)`）を用いて高い彩度（Chroma）と WCAG AA コントラスト比（`>= 4.5:1`）を両立させてください。

---

## 6. 変数の継承・カプセル化と詳細度（Specificity）に関するハマりどころ（トラップ）
- **ユニバーサルセレクタ `* { ... }` による変数リセットの禁止（最重要）**:
  グローバルCSS（`variables.css` やテーマファイル）で `* { --hd-...: ... }` のように CSS 変数を宣言すると、Light DOM 内のあらゆる子要素（`<p>`, `<span class="hd-highlight">`, `<hd-presenter-preview>` 等）で変数が初期値に強制リセットされ、Shadow DOM の `:host` で解決したコンテキスト変数の継承（Composed-Tree Inheritance）が完全に遮断されてしまいます。
  - **解決策**: グローバルなテーマ変数は必ず `:root` セレクタ下のみで定義し、`*` セレクタによる変数定義は一切行わないでください。
- **Shadow DOM `:host` でのトークン解決と Composed-Tree ブリッジング**:
  各コンポーネント（`<hd-slide>`, `<hd-card>`, `<hd-box>`, `<hd-callout>`, `<hd-layout-cover>` 等）は、自身の `:host`（および属性セレクタ `:host([variant="..."])`, `:host([surface="..."])`, `:host([heading="..."])`）上で 48色マトリクスから自身のコンポーネント変数を解決し、同時に以下の5つのアクティブコンテキストトークンを `:host`（および見出しバナー `.heading-area`）上でブリッジします：
  ```css
  --hd-background-color: var(--hd-slide-body-background, var(--hd-slide-body-background-color));
  --hd-text-color: var(--hd-slide-body-text-color);
  --hd-text-highlight-color: var(--hd-slide-body-text-highlight-color);
  --hd-text-muted-color: var(--hd-slide-body-text-muted-color);
  --hd-border-color: var(--hd-slide-border-color);
  ```
  これにより、スロットされた Light DOM の子要素（`.hd-highlight`, `.hd-muted`, `code`, `table`, `blockquote` 等）は、親がスライド本文か、見出しバナーか、ネストされたカード/ボックスかを問わず、直近のコンポーネントのコンテキストトークンを自然に継承します。
- **Shadow DOM 詳細度問題**:
  Light DOM のグローバルセレクタ（`[slot="heading"]` など）は、Shadow DOM 内の `::slotted(*)` セレクタよりも詳細度が高く、コンポーネント内部のテーマ/コントラストカラーを上書きしてしまいます。
  - **解決策**: Global CSS (`elements.css` など) 内の slotted 要素用セレクタでは `color: inherit;` を使用し、Shadow DOM 側のスタイルが正しく適用されるようにします。
- **複数属性による配色の上書き優先順位（詳細度）の問題**:
  `variant` と `heading`、`surface` のように複数のカスタマイズ属性を組み合わせて適用する場合、`:host([variant="main"][surface="solid"])` の詳細度は `(0, 2, 0)` であるため、単一属性 `:host([heading="accent"])` `(0, 1, 0)` では上書きできません。
  - **解決策**: `heading` 属性のオーバーライドルールは必ず `:host([heading="accent"]), :host([heading="accent"][surface="soft"])` および `:host([heading="accent"][surface="solid"])` のように複合セレクタを含め、`variant` 属性ルールよりも**下部（後）に宣言**してカスケードで確実に上書きされるように制御してください。

---

## 7. 統一サイズ・ユーティリティ・命名規則
- **統一数値サフィックス**:
  余白、フォントサイズ、最大幅、ギャップなどのサイズにはセマンティックなサイズ表記（`xs`, `sm`, `md`, `lg` など）を使用せず、統一した数値サフィックス（`0` 〜 `6`）を使用します。
  - フォントサイズ: 数値サフィックスが小さくなるほどフォントサイズが大きくなり、大きくなるほど小さくなる（例: `1` が最も大きく、`6` が最も小さい）。
  - ギャップ・余白: 数値サフィックスが大きくなるほど余白サイズが大きくなり、小さくなるほど小さくなる。サフィックス `0` は `0px`（余白なし）を表す。
- **フォントウェイト**:
  数値ではなくセマンティックな名称を使用します（`.hd-text-weight-light`, `.hd-text-weight-normal`, `.hd-text-weight-medium`, `.hd-text-weight-semibold`, `.hd-text-weight-bold`, `.hd-text-weight-extrabold`）。
- **カラーユーティリティ**:
  テキストの文字色を直接変更するためのユーティリティクラスは `.hd-highlight`（強調テキストカラー）、`.hd-default`（標準テキストカラー）、および `.hd-muted`（ミュートテキストカラー）のみが利用可能です。テキストの標準色やプライマリカラーの定義は、個別のユーティリティクラスではなく、テーマ変数（`--hd-text-color` や `--hd-text-highlight-color` など）の切り替えによって制御します。
- **印刷非表示ユーティリティ**:
  印刷時に特定の要素（プレゼンテーション外のコントロールパネルなど）を非表示にしたい場合は、ユーティリティクラス `.hd-no-print` を使用します。

