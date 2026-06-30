# html-deck Standard Built-in Themes Parameters Reference

This document summarizes the core parameters and custom CSS variable overrides configured for each of the 6 standard built-in themes in `html-deck`. Refer to this document when choosing slide themes or designing customized color layouts.

---

## 🎨 Overview of Built-in Themes

| Theme Filename | Font Family | Default Background | Default Text Color | Main Brand Variant Accent | Secondary/Highlight Accent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Default (Minimalist)** | `system-ui` | `#ffffff` (White) | `#111827` (Dark Slate) | `#4f46e5` (Indigo) | `#ea580c` (Orange) |
| **Dark Slate** (`html-deck.theme-dark.css`) | `system-ui` | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | `#1e1b4b` (Deep Navy) | `#fb923c` (Orange 400) |
| **Warm Sepia** (`html-deck.theme-warm.css`) | `'Outfit'` | `#f7f4eb` (Warm Sand Dunes) | `#363028` (Charcoal Brown) | `#cb5334` (Desert Terracotta) | `#dfa12d` (Sunlit Amber) |
| **Corporate** (`html-deck.theme-corporate.css`) | `'Inter'` (body)<br>`'Outfit'` (headings) | `#fcfcfc` (Onyx White) | `#0b132b` (Deep Navy) | `#0a1931` (Trust Navy) | `#c25e2e` (Copper Orange) |
| **Neon Cyberpunk** (`html-deck.theme-neon.css`) | `'Space Grotesk'` | `#0c0d1e` (Midnight Blue) | `#f1f5f9` (Slate White) | `#00f2fe` (Neon Cyan) | `#fe019a` (Neon Pink) |
| **Serif Academic** (`html-deck.theme-serif.css`) | `'Lora'` (body)<br>`'Playfair Display'` (headings) | `#f5f4ef` (Paper White) | `#1c1917` (Ink Black) | `#44403c` (Stone Brown) | `#9a3412` (Academic Rust) |
| **Retro Dot-Matrix** (`html-deck.theme-dotted.css`) | `'DotGothic16'` | `#000000` (Black) | `#00ff66` (Phosphor Green) | `#001a07` (Deep Green) | `#ffb000` (Warning Amber) |

---

## 🛠️ Theme-Specific Parameters & Variable Mappings

All custom theme styles are configured via CSS variables defined under the `:root` selector. The primary color maps use state variables that propagate styling to specific elements (`--hd-base-*`, `--hd-main-*`, `--hd-accent-*`).

### 1. Default (Minimalist Clean)
- **Base (Standard)**:
  - Soft Surface: `--hd-base-soft-background-color: #ffffff`, `--hd-base-soft-text-color: #111827`
  - Solid Surface: Background is light grey (`rgba(0,0,0,0.05)`).
- **Main Brand (Indigo)**:
  - Soft Surface Background: Light indigo tint (`color-mix(in srgb, #4f46e5 6%, #ffffff)`)
  - Solid Surface Background: `#4f46e5` (Vibrant Indigo)
- **Accent (Orange)**:
  - Soft Surface Background: Light orange tint (`color-mix(in srgb, #ea580c 6%, #ffffff)`)
  - Solid Surface Background: `#ea580c` (Vibrant Orange)
- **Typography Scale**: Standard sizes (`64px`, `40px`, `24px`, `20px`, `16px`, `12px`).

### 2. Dark Slate Theme (`html-deck.theme-dark.css`)
- **Base (Standard)**:
  - Soft Surface: `--hd-base-soft-background-color: #0f172a` (Slate 900), Text: `#f8fafc` (Slate 50).
  - Solid Surface: `--hd-base-solid-background-color: #1e293b` (Slate 800).
- **Main Brand (Deep Navy & Indigo)**:
  - Soft Surface: Background: `#1e1b4b` (Deep Navy), Text: `#c7d2fe` (Indigo 200).
  - Solid Surface: Background: `#4f46e5` (Vibrant Indigo).
- **Accent (Rust/Amber)**:
  - Soft Surface: Background: `#431407` (Rust/Dark Orange), Text: `#fed7aa` (Orange 200).
  - Solid Surface: Background: `#ea580c` (Vibrant Orange).
- **Component Elevations**:
  - Shadow: `--hd-card-box-shadow: 0 4px 12px rgba(0,0,0,0.3)`
  - Code Block Background: `#0b0f19` (for high contrast inside dark slides).

### 3. Warm Sepia Theme (`html-deck.theme-warm.css`)
- **Fonts**: Loaded via `@import Outfit`. `--hd-font-family: 'Outfit', sans-serif`.
- **Base (Standard)**:
  - Soft Surface: Background: `linear-gradient(135deg, #f7f4eb 0%, #ede8dc 100%)` (Sand Dunes), Text: `#363028` (Charcoal Brown).
- **Main Brand (Terracotta)**:
  - Soft Surface: Background: `linear-gradient(135deg, #faebe3 0%, #f3dcd0 100%)` (Light Terracotta).
  - Solid Surface: Background: `linear-gradient(135deg, #cb5334 0%, #a83d21 100%)` (Vibrant Clay Terracotta).
- **Accent (Ochre)**:
  - Soft Surface: Background: `linear-gradient(135deg, #fdf6e2 0%, #f9edcb 100%)` (Light Ochre).
  - Solid Surface: Background: `linear-gradient(135deg, #dfa12d 0%, #c48818 100%)` (Vibrant Sunlit Ochre).
- **Decorations**:
  - Slide Border Width: `0px` (Borderless).
  - Card background is sand white with subtle warm shadows.

### 4. Corporate Theme (`html-deck.theme-corporate.css`)
- **Fonts**: Loaded via `@import Inter`. `--hd-font-family: 'Inter', sans-serif`, Headings font: `'Outfit'`.
- **Typography Scale**: Executive-sized compact scale (`48px`, `32px`, `20px`, `16px`, `13px`, `11px`).
- **Base (Standard)**:
  - Soft Surface: Background: `#fcfcfc` (Clean Onyx White), Text: `#0b132b` (Deep Obsidian).
- **Main Brand (Classic Navy)**:
  - Soft Surface: Background: `rgba(10, 25, 49, 0.06)` (Soft Navy Tint).
  - Solid Surface: Background: `#0a1931` (Classic Corporate Navy Blue).
- **Accent (Brand Copper)**:
  - Soft Surface: Background: `rgba(194, 94, 46, 0.06)` (Soft Copper Tint).
  - Solid Surface: Background: `#c25e2e` (Vibrant Copper).

### 5. Neon Cyberpunk Theme (`html-deck.theme-neon.css`)
- **Fonts**: Loaded via `@import Space Grotesk`. `--hd-font-family: 'Space Grotesk', sans-serif`.
- **Typography Scale**: Compact scale (`52px`, `36px`, `22px`, `18px`, `14px`, `12px`).
- **Base (Standard)**:
  - Soft Surface: Background: `radial-gradient(circle at 50% 50%, #0c0d1e 0%, #05050a 100%)` (Midnight Cyber Navy), Text: `#f1f5f9` (Slate White).
- **Main Brand (Neon Cyan)**:
  - Soft Surface: Background: `radial-gradient(circle at 50% 50%, #062b33 0%, #020c0f 100%)` (Cyan Midnight Glow).
  - Solid Surface: Background: `linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)` (Vibrant Cyber Cyan).
- **Accent (Neon Pink)**:
  - Soft Surface: Background: `radial-gradient(circle at 50% 50%, #330628 0%, #0f020c 100%)` (Pink Midnight Glow).
  - Solid Surface: Background: `linear-gradient(135deg, #fe019a 0%, #f9a8d4 100%)` (Vibrant Cyber Pink).
- **Component Glows**:
  - Code Block Border: Cyan-phosphor border glow.
  - Table and Blockquote: Muted cyber-border styles.

### 6. Serif Academic Theme (`html-deck.theme-serif.css`)
- **Fonts**: Headings use `'Playfair Display'`, body text uses `'Lora'`.
- **Base (Standard)**:
  - Soft Surface: Background: `#f5f4ef` (Paper White), Text: `#1c1917` (Stone Ink Black).
- **Main Brand (Stone Brown)**:
  - Soft Surface: Background: `#eae7df` (Deep Warm Grey).
  - Solid Surface: Background: `#44403c` (Deep Stone Brown).
- **Accent (Rust Academic)**:
  - Soft Surface: Background: `#f6ece9`.
  - Solid Surface: Background: `#9a3412` (Rich Rust).

### 7. Retro Dot-Matrix Theme (`html-deck.theme-dotted.css`)
- **Fonts**: Loaded via `@import DotGothic16`. `--hd-font-family: 'DotGothic16', monospace`.
- **Base (Standard)**:
  - Soft Surface: Background: `#000000` (Terminal Black), Text: `#00ff66` (Phosphor Green).
- **Main Brand (Green Phosphor)**:
  - Soft Surface: Background: `#001a07` (Deep Phosphor green).
  - Solid Surface: Background: `#00ff66` (Vibrant Phosphor Block Green).
- **Accent (Amber CRT)**:
  - Soft Surface: Background: `#1a0f00` (Amber Glow).
  - Solid Surface: Background: `#ffb000` (Warning Amber Block).
