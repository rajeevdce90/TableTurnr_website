# Performance & Image Optimization

## Image optimization (for Core Web Vitals)

- **WebP:** The HTML uses `<picture>` with `<source type="image/webp">` and `<img>` fallbacks. Generate WebP versions of all PNG/JPG assets (e.g. with `cwebp` or an image tool) and place them alongside the originals with the same name and `.webp` extension. Example: `TableTurnr_Logo.png` → `TableTurnr_Logo.webp`, `app-screenshots/Sales view.png` → `app-screenshots/Sales view.webp`.
- **Dimensions:** All `<img>` tags now have `width` and `height` to reduce CLS.
- **Lazy loading:** Images below the fold use `loading="lazy"`; hero/above-the-fold images do not.
- **Descriptive filenames:** For SEO, consider renaming `app-screenshots/IMG_3566.png` to `app-screenshots/tableturnr-restaurant-dashboard-mobile.png` and update the `<img src>` in `index.html` to match.
- **Compression:** Aim for screenshots under ~100KB and logos/icons under ~20KB (e.g. with TinyPNG, ImageOptim, or `cwebp -q 80`).

## Minify CSS and JS

When Node.js is available, generate minified assets:

```bash
npx terser script.js -o script.min.js
npx clean-css-cli -o styles.min.css styles.css
```

Then in `index.html` reference `styles.min.css` and `script.min.js` instead of `styles.css` and `script.js` for production.

## Targets

- **LCP** &lt; 2.5s: Preload hero image and fonts; use WebP and lazy load below-fold images.
- **FID** &lt; 100ms: Scripts are deferred; reduce main-thread work if needed.
- **CLS** &lt; 0.1: All images have explicit width/height.
