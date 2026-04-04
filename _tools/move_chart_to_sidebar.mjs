/**
 * Removes blog-mini-chart from data panel body, replaces sidebar figures with that chart.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.join(__dirname, "..", "blog");

const NEW_ASIDE = `<aside class="blog-article__sidebar" aria-label="Seven-day revenue trend">
  <figure class="blog-article__figure blog-article__figure--chart">
    <div class="blog-mini-chart" aria-label="Seven day trend chart">
      <div class="blog-mini-chart-head">
        <strong>7-Day Revenue Trend</strong>
        <span>Live read</span>
      </div>
      <div class="blog-mini-bars">
        <div class="blog-mini-bar" style="--bar-h: 62%;"><span>Mon</span></div>
        <div class="blog-mini-bar" style="--bar-h: 69%;"><span>Tue</span></div>
        <div class="blog-mini-bar" style="--bar-h: 58%;"><span>Wed</span></div>
        <div class="blog-mini-bar" style="--bar-h: 84%;"><span>Thu</span></div>
        <div class="blog-mini-bar" style="--bar-h: 74%;"><span>Fri</span></div>
        <div class="blog-mini-bar" style="--bar-h: 92%;"><span>Sat</span></div>
        <div class="blog-mini-bar" style="--bar-h: 65%;"><span>Sun</span></div>
      </div>
    </div>
    <figcaption class="blog-article__caption">7-Day Revenue Trend</figcaption>
  </figure>
</aside>`;

function removeMiniChart(html) {
  const open = '<div class="blog-mini-chart"';
  const start = html.indexOf(open);
  if (start === -1) return html;
  let pos = html.indexOf(">", start) + 1;
  let depth = 1;
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", pos);
    const nextClose = html.indexOf("</div>", pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = html.indexOf(">", nextOpen) + 1;
    } else {
      depth--;
      pos = nextClose + 6;
    }
  }
  return html.slice(0, start) + html.slice(pos);
}

function replaceAside(html) {
  return html.replace(
    /<aside class="blog-article__sidebar"[^>]*>[\s\S]*?<\/aside>/,
    NEW_ASIDE
  );
}

const dirs = fs
  .readdirSync(blogRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const slug of dirs) {
  const file = path.join(blogRoot, slug, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("blog-article__sidebar")) continue;
  const before = html;
  html = removeMiniChart(html);
  html = replaceAside(html);
  if (html === before) {
    console.warn("No changes:", slug);
    continue;
  }
  fs.writeFileSync(file, html, "utf8");
  console.log("Updated:", slug);
}
