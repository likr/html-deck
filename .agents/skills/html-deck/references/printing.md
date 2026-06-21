# html-deck PDF Export & Printing Reference

`html-deck` has built-in print styles that format your deck into standard PDF documents. Rather than taking screenshots manually, you can export your deck to PDF directly via the browser's print dialog.

---

## 🖨️ How to Export to PDF (Step-by-Step)

1. Open your presentation slide deck in Chrome or any Chromium-based browser (e.g. Edge, Brave).
2. Press **Ctrl + P** (Windows/Linux) or **Cmd + P** (macOS) to open the browser print dialog.
3. Apply the following settings in the print options panel:
   - **Destination**: Set to **Save as PDF** (or Microsoft Print to PDF).
   - **Layout / Orientation**: Set to **Landscape** (Horizontal).
   - **Pages**: Set to **All** (or input specific slides if needed).
   - **Margins**: Set to **None** (Crucial to prevent page breaks and whitespace gaps).
   - **Background graphics**: **Check / Enable** this option (Crucial to ensure theme colors, slide background overrides, and code syntax highlights render).
4. Click **Save** to export the PDF.

---

## ⚙️ How the Printing Mechanism Works

`html-deck` automatically configures print boundaries to prevent text overlaps and page breaks.

### 1. Dimension Match Alignment (`@page` Setup)
To match standard computer screen viewports with printable page sizes, the library automatically registers a global printing page size under `@media print` inside the `<hd-deck>` component.

The calculation is based on a standard **5.625-inch height** (5.625 inches * 96 DPI equals exactly **540px**, matching the core presentation coordinate space height). The page width is derived from this base height multiplied by the slide's active `aspect-ratio` attribute.

For example, when `aspect-ratio="16:9"` (ratio = `1.777`):
- **Calculated Width**: `5.625 * (16 / 9) = 10 inches`.
- **Generated CSS Rule**:
  ```css
  @media print {
    @page {
      size: 10in 5.625in;
      margin: 0;
    }
  }
  ```
This ensures a pixel-perfect 1:1 conversion without layout shifts or text overlaps.

### 2. Print Style Overrides
When switching into the print rendering pipeline, the following styles are automatically applied:
- **Visibility Toggle**: Controls, stopwatch timers, and progress indicator bars are set to `display: none !important;`.
- **Slide Flattening**: All slides are set to `opacity: 1`, `visibility: visible`, and `position: relative`, which stacks pages vertically for the print driver.
- **Page Breaks**: Each slide receives `page-break-after: always !important;` and `break-inside: avoid !important;` to ensure each slide exports to its own single PDF page.
