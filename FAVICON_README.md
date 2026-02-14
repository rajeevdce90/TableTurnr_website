# Favicon setup

The following PNG favicons are in place:

- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)

To generate **favicon.ico** (multi-size 16×16 and 32×32) for older browsers:

1. Go to [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload `favicon-32x32.png` (or your TableTurnr logo)
3. Download the generated package and place `favicon.ico` in the site root

Alternatively, use any .ico generator and export from `favicon-32x32.png`. The `<link rel="icon" href="/favicon.ico">` in `index.html` will use it once the file exists.
