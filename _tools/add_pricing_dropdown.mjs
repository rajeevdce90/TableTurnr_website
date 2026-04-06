import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();

function walk(dir, list = []) {
  for (const f of readdirSync(dir)) {
    if (f.startsWith('.') || f === 'node_modules' || f === '_tools') continue;
    const full = join(dir, f);
    if (statSync(full).isDirectory()) walk(full, list);
    else if (f.endsWith('.html')) list.push(full);
  }
  return list;
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  let html = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).replace(/\\/g, '/');

  const depth = rel.split('/').length - 1;
  const prefix = depth === 0 ? '' : '../'.repeat(depth);

  const escaped = prefix.replace(/\//g, '\\/');
  const pricingPattern = new RegExp(
    `<a\\s+href=["']${escaped}pricing\\/["']>Pricing<\\/a>`
  );

  if (!pricingPattern.test(html)) continue;

  const dropdown = `<div class="nav-dropdown">
                    <a href="#" class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Pricing <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:3px"><polyline points="6 9 12 15 18 9"/></svg></a>
                    <div class="nav-dropdown-menu">
                        <a href="${prefix}pricing/">Plans &amp; Pricing</a>
                        <a href="${prefix}roi-calculator/">ROI Calculator <span class="nav-new-badge">NEW</span></a>
                    </div>
                </div>`;

  html = html.replace(pricingPattern, dropdown);

  const roiStandalone = new RegExp(
    `\\s*<a\\s+href=["']${escaped}roi-calculator\\/["']>ROI Calculator<\\/a>`,
    'g'
  );
  html = html.replace(roiStandalone, '');

  writeFileSync(file, html);
  changed++;
  console.log('Updated:', rel);
}

console.log(`\nDone. ${changed} files updated.`);
