# Site Clone Workflow

This document explains how the project replicates the `https://growagarden-recipes.com/` homepage and `/recipes` page, plus how we validate visual parity. Follow these steps whenever you need to resync the clone or rerun the automated checks.

## 1. Environment Setup
- Install dependencies:
  ```bash
  npm install
  ```
- Download the Playwright Chromium binary:
  ```bash
  npx playwright install chromium
  ```

## 2. Sync the Latest Site Markup
1. Fetch the live homepage HTML from the repository root:
   ```powershell
   (Invoke-WebRequest -Uri https://growagarden-recipes.com/ -UseBasicParsing).Content | Out-File growagarden_home.html -Encoding utf8
   ```
2. Fetch the `/recipes` HTML snapshot:
   ```powershell
   (Invoke-WebRequest -Uri https://growagarden-recipes.com/recipes -UseBasicParsing).Content | Out-File growagarden_recipes.html -Encoding utf8
   ```
3. Extract the `<head>` and `<body>` fragments into the Next.js data directory (the script processes every downloaded snapshot that it knows about):
   ```bash
   node scripts/extractHtml.js
   ```
4. Regenerate the static homepage snapshot used for baseline comparisons:
   ```bash
   node scripts/updateOriginalHtml.js
   ```
   This writes the combined markup to `public/original.html`.
5. Download static assets (CSS, JS files):
   ```bash
   node scripts/downloadAssets.js
   ```
   This downloads all referenced assets from the original site to `public/assets/` (the union of assets referenced by every stored `<head>` fragment).
6. Refresh SEO assets (robots.txt, sitemap.xml):
   ```bash
   node scripts/updateSeoAssets.js
   ```
   The latest versions are saved to `public/robots.txt` and `public/sitemap.xml`.

## 3. Next.js Rendering Notes
- `app/layout.tsx` now only provides the global `<html>` and `<body>` shell while individual routes handle their own `<head>` fragments.
- `lib/loadHtmlFragment.ts` centralizes loading any stored fragment from `/data`, so each route can pull whichever file it needs.
- `components/HeadInjector.tsx` uses `useServerInsertedHTML` to stream stored `<head>` markup into the document during SSR.
- `app/(home)/page.tsx` and `app/recipes/page.tsx` both rely on those helpers to inject `*-head.html` and render the corresponding `*-body.html` with `dangerouslySetInnerHTML`, allowing the upstream SPA bundle to hydrate identically to the production site.
- `app/globals.css` only imports Tailwind so the cloned CSS from the source site remains untouched.

## 4. Build Verification
Compile the project in production mode to make sure everything builds cleanly:
```bash
npm run build
```

## 5. Screenshot Capture and Pixel Diff
1. Launch the local server:
   ```bash
   npm run start
   ```
2. Capture screenshots (Playwright Chromium, JavaScript disabled, 1440×900 viewport, full page):
   ```bash
   node scripts/captureScreenshots.js
   ```
   Outputs:
   - `screenshots/original.png` — remote site capture
   - `screenshots/clone.png` — local clone capture
3. Produce the diff overlay and statistics:
   ```bash
   node scripts/compareScreenshots.js
   ```
   - Prints the number and percentage of differing pixels
   - Saves `screenshots/diff.png`
4. Narrow down the differing region (optional):
   ```bash
   node scripts/analyzeRawDiff.js
   ```
   This reports the bounding box covering all differing pixels for easier inspection.

## 6. Typical Sources of Difference
- The live site loads ads, analytics, and other dynamic assets, so a small variance (around 2–3%) is normal even with JavaScript disabled.
- To reduce noise you can block third-party requests before capturing screenshots or compare against `public/original.html`, which mirrors the stored snapshot exactly.

Repeat these steps whenever you refresh the data or want an automated visual regression check on the cloned homepage.
