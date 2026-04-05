/**
 * Adds a consistent favicon + manifest block to every HTML page.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const version = "20260404";

const faviconBlock = [
  `<link rel="icon" type="image/x-icon" href="/favicon.ico?v=${version}" />`,
  `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=${version}" />`,
  `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=${version}" />`,
  `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=${version}" />`,
  `<link rel="manifest" href="/site.webmanifest?v=${version}" />`,
].join("\n    ");

function walkHtmlFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(abs, out);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      out.push(abs);
    }
  }
  return out;
}

function upsertFavicons(html) {
  if (!html.includes("<head")) return html;

  let next = html.replace(
    /\s*<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon|manifest)["'][^>]*>\s*/gi,
    "\n"
  );

  if (next.includes('href="/favicon.ico')) return next;

  if (/<meta[^>]+name=["']theme-color["'][^>]*>/i.test(next)) {
    return next.replace(
      /(<meta[^>]+name=["']theme-color["'][^>]*>\s*)/i,
      `$1\n    ${faviconBlock}\n`
    );
  }

  if (/<meta[^>]+name=["']viewport["'][^>]*>/i.test(next)) {
    return next.replace(
      /(<meta[^>]+name=["']viewport["'][^>]*>\s*)/i,
      `$1\n    ${faviconBlock}\n`
    );
  }

  return next.replace(/<head>/i, `<head>\n    ${faviconBlock}\n`);
}

const htmlFiles = walkHtmlFiles(rootDir);
let updated = 0;

for (const file of htmlFiles) {
  const orig = fs.readFileSync(file, "utf8");
  const next = upsertFavicons(orig);
  if (next !== orig) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
    console.log("updated", path.relative(rootDir, file));
  }
}

console.log("done:", updated, "files");
