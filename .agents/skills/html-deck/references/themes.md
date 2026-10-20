# Built-In Themes Reference

The `html-deck` library includes 8 built-in themes designed around the **3-Variant (`base`, `main`, `accent`) × 2-Surface (`soft`, `solid`)** 48-Color Matrix architecture. Each theme derives its complete color matrix from a 4-color base palette (`--hd-theme-background-color`, `--hd-theme-text-color`, `--hd-theme-main-color`, `--hd-theme-accent-color`) and pairs it with tailored typography, container geometry, shadows, dividers, and surface treatments.

## Available Themes

1. **Default** (No extra import required; bundled in `html-deck`)
   - **Concept**: *Minimalist Modern Clean*
   - **Palette**: Crisp daylight white (`#ffffff`), slate ink (`#0f172a`), electric indigo (`#3730a3`), and vibrant burnt orange (`#c2410c`).
   - **Characteristics**: Clean system sans-serif typography, `8px` rounded containers, subtle tinted `soft` surfaces, deep slate/indigo/burnt-orange `solid` surfaces with high-saturation `hsl(from ...)` cross-highlights, and soft elevation shadows.
   - **Best For**: General technical presentations, software engineering talks, and clean modern decks.

2. **Dark (`html-deck/theme-dark`)**
   - **Concept**: *Deep Slate Night*
   - **Palette**: Midnight slate (`#0b1120`), frost white (`#f8fafc`), luminous indigo (`#6366f1`), and luminous mint emerald (`#34d399`).
   - **Characteristics**: Elevated dark slate container surfaces, `10px` rounded corners, deep drop shadows, and high-contrast syntax/code blocks with emerald and luminous indigo highlights.
   - **Best For**: Low-light environments, developer conferences, and dark-mode technical demos.

3. **Warm (`html-deck/theme-warm`)**
   - **Concept**: *Sunlit Adobe & Hibiscus Berry*
   - **Palette**: Sunlit adobe sand (`#f7efe2`), roasted espresso ink (`#26150d`), warm amber ochre (`#8a4208`), and hibiscus berry rose (`#ac1442`).
   - **Characteristics**: Geometric rounded `'Outfit'` typography, warm sun-drenched adobe canvas with ambient radiance overlay, generous organic `24px` pillowed container radii, warm drop-shadows, and a dual-tone hibiscus-rose & ochre heading divider.
   - **Best For**: Design systems, lifestyle, creative storytelling, architecture, and human-centric presentations.

4. **Corporate (`html-deck/theme-corporate`)**
   - **Concept**: *Executive Boardroom & Strategic Briefing*
   - **Palette**: Executive ice slate (`#f0f4f8`), Oxford ink (`#091626`), executive sapphire navy (`#0f3460`), and FinTech emerald-teal (`#046648`).
   - **Characteristics**: `'Outfit'` headings paired with `'Inter'` body text, left-aligned cover layout, clean ice-slate canvas with a `6px` executive navy-and-emerald top status bar, emerald-accented heading banner rule, crisp `2px` architectural corners, and `5px` emerald left accent bars on cards and boxes.
   - **Best For**: Business pitches, quarterly reviews, enterprise architecture, and financial reports.

5. **Neon (`html-deck/theme-neon`)**
   - **Concept**: *Tokyo Midnight Cyberpunk*
   - **Palette**: Deep cyber void (`#070913`), ice white (`#f0f6fc`), electric cyan (`#00f2fe`), and laser magenta (`#ff2a85`).
   - **Characteristics**: `'Space Grotesk'` display headers with neon text-shadow glow, dual radial-glow slide canvas, laser magenta `.hd-highlight` accents on base surfaces, glowing cyan/magenta container borders and box-shadows, and geometric `▸`/`▹`/`▪` list markers.
   - **Best For**: Gaming, AI/cybersecurity, futuristic tech showcases, and lightning talks.

6. **Serif (`html-deck/theme-serif`)**
   - **Concept**: *Academic Folio & Classical Ultramarine*
   - **Palette**: Archival folio paper (`#f4eee1`), letterpress ink (`#1a1311`), imperial oxblood burgundy (`#631422`), and classical ultramarine blue (`#1e3a8a`).
   - **Characteristics**: `'Playfair Display'` centered headings paired with `'Lora'` literary serif body, signature `6px double` oxblood slide frame, ultramarine-and-oxblood double heading rule, crisp `0px` sharp bookplate corners with ultramarine offset shadows, and classical typography proportions.
   - **Best For**: Academic research papers, humanities, literature, and formal keynote lectures.

7. **Dotted (`html-deck/theme-dotted`)**
   - **Concept**: *Retro Phosphor CRT Terminal*
   - **Palette**: Pure CRT black (`#000000`), phosphor green (`#00ff66`), matrix green (`#00cc52`), and warning amber (`#ffb000`).
   - **Characteristics**: `'DotGothic16'` pixel monospace font with tuned compact sizing, sharp `0px` corners, `2px dotted` borders and dividers, inverse-video `solid` blocks, animated blinking block/underscore cursors (`█` / `_`), `>` terminal list prompts, and a CRT scanline viewport overlay.
   - **Best For**: Retro computing, low-level systems/kernel talks, security CTFs, and pixel-art decks.

8. **Nouveau (`html-deck/theme-nouveau`)**
   - **Concept**: *Botanical Art Nouveau & Wisteria Amethyst*
   - **Palette**: Gilded silk parchment (`#f6f2e6`), deep moss ink (`#161e17`), botanical celadon emerald (`#1b4332`), and wisteria amethyst purple (`#6b21a8`).
   - **Characteristics**: `'Shippori Mincho'` / `'Cormorant Garamond'` centered display serif with `'Lora'` / `'Noto Serif JP'` body, signature perimeter filigree frame with wisteria corner flourishes (`5px..8px` inset so peripheral headers/footers remain clear), wisteria-and-celadon double heading rule, asymmetric `20px 4px 20px 4px` botanical leaf-curved containers, and floral list markers (`✿`, `❀`, `♣`).
   - **Best For**: Art history, cultural/culinary presentations, botanical/organic branding, and refined editorial decks.

## Usage

### Via Bundler (Vite, Webpack, Rollup)

Import the desired theme after `html-deck` in your module script:

```html
<script type="module">
  import 'html-deck';
  import 'html-deck/theme-corporate';
</script>
```

### Via CDN (`unpkg`)

Load the theme stylesheet via `<link rel="stylesheet">`:

```html
<script type="module" src="https://unpkg.com/html-deck"></script>
<link rel="stylesheet" href="https://unpkg.com/html-deck/dist/themes/html-deck.theme-corporate.css">
```
