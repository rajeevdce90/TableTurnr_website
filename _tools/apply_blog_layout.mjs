import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BLOG = path.join(ROOT, "blog");

const OPEN_RE =
  /<section class="section">\s*<div class="container" style="max-width:820px">/i;
const MAIN_CLOSE_RE = /<\/div>\s*<\/section>\s*<\/main>/i;
function mainCloseBlock() {
  return `</div>
</div></div></section>
</main>`;
}

function transformContent(html) {
  if (html.includes("blog-article__layout")) return null;
  if (!OPEN_RE.test(html)) return null;
  let out = html.replace(
    OPEN_RE,
    '<section class="section blog-article-section"><div class="container blog-article-container"><div class="blog-article__layout"><div class="blog-article__content blog-prose">'
  );
  if (!MAIN_CLOSE_RE.test(out)) return null;
  out = out.replace(MAIN_CLOSE_RE, mainCloseBlock());
  return out;
}

function transformStandalone(html) {
  if (html.includes("blog-article__layout")) return null;
  const pat =
    /<main id="main-content" class="container"[^>]*max-width:\s*720px[^>]*>\s*<article>/i;
  if (!pat.test(html)) return null;
  let out = html.replace(
    pat,
    '<main id="main-content" class="blog-post-page" style="padding: 5.5rem 1.25rem 4rem;"><article class="blog-article"><div class="container blog-article-container"><div class="blog-article__layout"><div class="blog-article__content blog-prose">'
  );
  out = out.replace(
    /<div style="margin:\s*1\.5rem 0;\s*text-align:\s*center;">\s*<img[^>]+simple_prototype_to_production\.png[^>]+>\s*<\/div>/is,
    ""
  );
  const closePat = /<\/article>\s*<\/main>/i;
  if (!closePat.test(out)) return null;
  const close = `</div>
</div></div></article></main>`;
  out = out.replace(closePat, close);
  return out;
}

function normalize(html) {
  let h = html.replace(
    /<h2 style="margin-top:\s*2rem;\s*font-size:\s*1\.4rem;">/g,
    "<h2>"
  );
  h = h.replace(
    /<div style="margin:2rem 0;padding:1\.5rem 2rem;background:linear-gradient\([^)]+\);border-radius:12px;text-align:center">/g,
    '<div class="blog-article__cta">'
  );
  return h;
}

const dirs = fs.readdirSync(BLOG, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let count = 0;
for (const d of dirs.sort()) {
  const fp = path.join(BLOG, d, "index.html");
  if (!fs.existsSync(fp)) continue;
  const orig = fs.readFileSync(fp, "utf8");
  let next = transformContent(orig) ?? transformStandalone(orig);
  if (next == null) continue;
  next = normalize(next);
  if (next !== orig) {
    fs.writeFileSync(fp, next, "utf8");
    count++;
    console.log("updated", path.relative(ROOT, fp));
  }
}
console.log("done,", count, "files");
