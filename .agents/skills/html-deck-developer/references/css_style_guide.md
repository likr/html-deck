# HTML-Deck CSS Coding Style Guide

このガイドラインは、`html-deck` ライブラリのCSS設計およびコーディングスタイル規約を定めたものです。コーディングスタイルの違反（特にCSS変数の扱い、直接値の設定、px以外の単位使用、定義場所の誤り）を防ぐため、以下のルールを必ず厳格に遵守してください。

---

## 1. CSS変数 (Custom Properties) の定義と参照ルール (最重要)
- **定義時のデフォルト値設定**:
  すべてのプレゼンテーション用CSS変数は、[variables.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/variables.css) の `:root` セレクタ下など、適切な定義場所で**明示的にデフォルト値（初期値）を設定して定義**しなければなりません。
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
   - [reset.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/reset.css) で行います。ワイルドカードの `box-sizing` ルール、マージン・パディングの初期リセット、メディアタグのブロック表示などが該当します。
2. **パブリックなグローバルCSS変数**:
   - [variables.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/variables.css) の `:root` セレクタ下で一括定義します。テーマ切り替えのベースとなる変数やフォント定義がこれに該当します。
3. **標準HTML要素のスタイルおよびスロットスルーのデフォルト**:
   - [elements.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/elements.css) で行います。スロットされた要素の `color: inherit` 設定や、セマンティックなマークアップのベースが含まれます。
4. **レイアウトやマークアップの補助ユーティリティ**:
   - [utilities.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/utilities.css) または [components.css](file:///home/likr/work/likr/html-deck/packages/html-deck/src/styles/components.css) で行います。
5. **コンポーネント固有のスタイル**:
   - WebComponent の Shadow DOM スタイルシート（各 JS 内）で定義します。コンポーネントの構造や動作に必要な境界内部 of スタイルです。
    - **注意**: レイアウトコンポーネントにおいては、`:host` に対して直接 padding を設定することは避け、必ず `.layout-content` や `.cover-content` などの内部ラッパーに対して設定変数（`--hd-layout-body-padding` や `--hd-layout-cover-padding`）を介して padding を適用してください。
    - **注意**: `hd-card`, `hd-box`, `hd-callout` などのコンテナ型コンポーネント、レイアウト見出し領域の背景スタイル、および見出し区切り線 (divider) には、`background-color` プロパティではなく、`background` 略記法プロパティを使用してください。これにより、カスタムテーマから線形・放射状グラデーション（`linear-gradient` / `radial-gradient`）背景や模様をCSS変数経由で適用できるようになります。
    - **注意**: `hd-card` は内容に応じた自動的な高さを維持するため、`:host` に `align-self: flex-start;` が適用されており、Flexbox/Grid レイアウト内でも縦に引き伸ばされません。一方、`hd-box` はコンテナの高さ全体を埋めるように設計されており、`:host` の高さが `100%` に設定されています。そのため、`hd-layout-grid` 内で各グリッドアイテムの高さを揃えたい場合は、`hd-card` ではなく `hd-box` の使用を推奨します。
    - **注意**: `!important` をグローバルなリセットルール（`*:last-child { margin-bottom: 0 !important; }` など）で使用することは、個別ユーティリティクラス（`.hd-align-middle` など）の挙動を破壊するため禁止します。

---

## 5. テーマ（Theme）設計とオーバーライドの規則
- **Skeletonライブラリとしての原則**:
  `html-deck` はデフォルトでシンプルなスケルトン（白背景、最小限の装飾）であり、外部のテーマCSSファイルで見た目を切り替えます。
- **テーマCSSの記述制限と Cascade Layers による優先度保証**:
  デフォルトのCSS変数は `variables.css` および `html-deck-presenter.css` 内でそれぞれ `@layer hd-variables`、`@layer hd-presenter-variables` レイヤーにラップされています。
  テーマCSSは、**レイヤー外（unlayered）の `:root` セレクタ下でCSS変数をオーバーライド**しなければなりません。 unlayered な定義は layered な定義よりも常に優先されるため、これによりCSSの読み込み順序に依存しない確実な上書きが保証されます。
  テーマCSS内でHTMLタグやクラス名（`hd-slide` や `.hd-card` など）を直接ターゲットにしてはなりません。
  - カスタムスタイル（枠線、スクロールバー、コードブロック、シャドウなど）が必要な場合、それらの要素にはあらかじめパラメータ化されたCSS変数（`--hd-card-shadow-primary` など）を定義しておき、テーマCSSではその変数をオーバーライドします。
- **CSS Relative Color Syntax の使用**:
  テーマCSS内では、透明度や影、ボーダーのバリエーションなどを表現する際に、生の `hex` や `rgba` のカラーリテラルをハードコードしてはなりません。
  必ず **CSS Relative Color Syntax** を使用し、ベース変数から導出してください。
  -  例: `rgba(from var(--hd-primary-color) r g b / 0.15)`

---

## 6. 変数の継承と詳細度（Specificity）に関するハマりどころ（トラップ）
- **静的変数継承のトラップ**:
  `:root` で他のカスタムプロパティを参照する中間変数（例: `--hd-code-background-color: rgba(from var(--hd-slide-text-color) r g b / 0.05);` など）を定義した場合、値は静的に解決されます。子が属性（`:host([variant="accent"])` など）で参照先の変数をオーバーライドしても、孫要素は親スコープで静的解決された古い値を引き継いでしまいます。
  - **解決策**: 中間変数を介してスタイルを定義するのではなく、使用する側の要素（例: `hd-slide code`）で直接、基本となるセマンティック変数（例: `var(--hd-body-text-color)`) から Relative Color Syntax 等を用いて色を導出するように設計します。また、カラー設定を少数の「基本セマンティック変数（`--hd-body-text-color` などの8大セマンティック変数）」に集約し、従属変数はそれらから動的に解決させることで、オーバーライドによる記述量を減らしつつ不整合を完全に防止できます。
- **アクティブ変数のリーク**:
  グローバルな中間変数（`--hd-color` など）を `:root` に作成してコンポーネントで参照すると、ネストしたコンポーネントが親の variant 設定を意図せず継承してしまいます。
  - **解決策**: コンポーネントのプロパティは `:root` のベースパレット変数に直接マッピングし、コンポーネント内の属性セレクタ（`:host([variant="main"])`）で個別オーバーライドします。
- **Shadow DOM 詳細度問題**:
  Light DOM のグローバルセレクタ（`[slot="heading"]` など）は、Shadow DOM 内の `::slotted(*)` セレクタよりも詳細度が高く、コンポーネント内部 of テーマ/コントラストカラーを上書きしてしまいます。
  - **解決策**: Global CSS (`elements.css` など) 内の slotted 要素用セレクタでは `color: inherit;` を使用し、Shadow DOM 側のスタイルが正しく適用されるようにします。
- **複数属性による配色の上書き優先順位（詳細度）の問題**:
  `variant` と `heading`、`surface` のように複数のカスタマイズ属性を組み合わせて適用する場合、セレクタ同士のCSS詳細度が同一（例: `:host([variant="main"][surface="soft"])` と `:host([heading="base"][surface="soft"])`）だと、宣言の順序に依存してスタイルが決定されます。
  - **解決策**: CSSファイル内での宣言順序を意識し、より特定の目的を持つ属性（例: `heading` 属性）のスタイル定義を必ず汎用的な属性（例: `variant` 属性）よりも**下部（後）に宣言**して、カスケードで上書きされるように制御してください。
- **レイアウト要素の見出し領域カラー伝播と中間状態変数によるオーバーライド**:
  レイアウトコンポーネント（`<hd-layout>` など）やコンテナ（`<hd-card>` など）の配色において、見出し領域とボディ領域で異なる配色テーマを適用する場合、`:has(> [slot="heading"])` のような複雑なリレーショナルセレクタによる標準変数の直接上書きは、配下のスロット要素への予期せぬ値のリーク（親スコープからの継承による低コントラスト化）を発生させます。
  これを防ぐため、グローバルな `*` セレクタ下で中間状態変数（`--hd-heading-*` および `--hd-body-*`）を定義し、Shadow DOM 内ではこれらの中間変数を経由して標準変数（`--hd-background-color`、`--hd-text-color`等）に割り当ててください。
  - **解決策**:
    1. グローバル `*` セレクタで `--hd-heading-background-color: var(--hd-solid-background-color)` と `--hd-body-background-color: var(--hd-soft-background-color)` などの基本マッピングを定義します。
    2. `hd-slide` の `:host` 内では標準変数を `--hd-body-*` にマッピングし、レイアウトコンポーネントの `.heading-area` 内では標準変数を `--hd-heading-*` にマッピングします。
    3. `hd-card` などのコンテナ型コンポーネントは、`surface` 等の属性に応じてコンポーネント側で `--hd-heading-*` / `--hd-body-*` の設定値のみを切り替えます。これにより、配下の子要素やスロットコンテンツが正しくローカルコンテキストに応じた変数値を参照でき、漏洩やレイアウト崩れを完全に防ぐことができます。

---

## 7. 統一サイズ・ユーティリティ・命名規則
- **統一数値サフィックス**:
  余白、フォントサイズ、最大幅、ギャップなどのサイズにはセマンティックなサイズ表記（`xs`, `sm`, `md`, `lg` など）を使用せず、統一した数値サフィックス（`0` 〜 `6`）を使用します。
  - フォントサイズ: 数値サフィックスが小さくなるほどフォントサイズが大きくなり、大きくなるほど小さくなる（例: `1` が最も大きく、`6` が最も小さい）。
  - ギャップ・余白: 数値サフィックスが大きくなるほど余白サイズが大きくなり、小さくなるほど小さくなる。サフィックス `0` は `0px`（余白なし）を表す。
- **フォントウェイト**:
  数値ではなくセマンティックな名称を使用します（`.hd-text-weight-light`, `.hd-text-weight-normal`, `.hd-text-weight-medium`, `.hd-text-weight-semibold`, `.hd-text-weight-bold`, `.hd-text-weight-extrabold`）。
- **カラーユーティリティ**:
  テキストの文字色を直接変更するためのユーティリティクラスは `.hd-accent`（アクセントカラー）と `.hd-muted`（ミュートカラー）のみが利用可能です。テキストの標準色やプライマリカラーの定義は、個別のユーティリティクラスではなく、テーマ変数（`--hd-base-text-color` や `--hd-accent-color` など）の切り替えによって制御します。
- **印刷非表示ユーティリティ**:
  印刷時に特定の要素（プレゼンテーション外のコントロールパネルなど）を非表示にしたい場合は、ユーティリティクラス `.hd-no-print` を使用します。

