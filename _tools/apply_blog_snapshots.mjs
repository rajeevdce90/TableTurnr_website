/**
 * Replaces each blog's Operations Data Snapshot with topic-specific KPIs, copy, and chart type.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.join(__dirname, "..", "blog");

function chartWrap(title, subtitle, kind, body) {
  return `        <div class="blog-mini-chart ${kind}" aria-label="${title.replace(/"/g, "&quot;")}">
            <div class="blog-mini-chart-head">
                <strong>${title}</strong>
                <span>${subtitle}</span>
            </div>
${body}
        </div>`;
}

function lineChart(title, subtitle) {
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--line",
    `            <svg class="chart-line-svg" viewBox="0 0 220 120" role="img" aria-label="Forecast error trend">
                <polyline class="chart-line-grid" points="12,24 208,24"></polyline>
                <polyline class="chart-line-grid" points="12,60 208,60"></polyline>
                <polyline class="chart-line-grid" points="12,96 208,96"></polyline>
                <polyline class="chart-line-forecast" points="12,74 44,68 76,70 108,63 140,60 172,56 204,54"></polyline>
                <polyline class="chart-line-actual" points="12,80 44,71 76,73 108,66 140,62 172,58 204,55"></polyline>
                <circle cx="12" cy="80" r="3"></circle><circle cx="44" cy="71" r="3"></circle><circle cx="76" cy="73" r="3"></circle>
                <circle cx="108" cy="66" r="3"></circle><circle cx="140" cy="62" r="3"></circle><circle cx="172" cy="58" r="3"></circle><circle cx="204" cy="55" r="3"></circle>
            </svg>
            <div class="chart-x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>`
  );
}

function groupedBarChart(title, subtitle, rows) {
  const groups = rows
    .map(
      (row) => `                <div class="chart-group">
                    <div class="chart-group-bars">
                        <span class="chart-bar chart-bar--plan" style="--bar-h: ${row.plan}%;"></span>
                        <span class="chart-bar chart-bar--actual" style="--bar-h: ${row.actual}%;"></span>
                    </div>
                    <span class="chart-group-label">${row.label}</span>
                </div>`
    )
    .join("\n");
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--grouped",
    `            <div class="chart-grouped-bars">
${groups}
            </div>
            <div class="chart-key"><span><i class="key-dot key-dot--plan"></i>Planned</span><span><i class="key-dot key-dot--actual"></i>Actual</span></div>`
  );
}

function donutChart(title, subtitle) {
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--donut",
    `            <div class="chart-donut-wrap">
                <div class="chart-donut" style="--donut-fill: conic-gradient(#fb923c 0 38%, #38bdf8 38% 67%, #a3e635 67% 86%, rgba(255,255,255,0.22) 86% 100%);">
                    <span>86%</span>
                </div>
                <ul class="chart-legend">
                    <li><i style="--c:#fb923c"></i>POS</li>
                    <li><i style="--c:#38bdf8"></i>Labor</li>
                    <li><i style="--c:#a3e635"></i>Inventory</li>
                    <li><i style="--c:rgba(255,255,255,0.28)"></i>Missing</li>
                </ul>
            </div>`
  );
}

function matrixChart(title, subtitle) {
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--matrix",
    `            <div class="chart-matrix">
                <div class="chart-matrix-cell"><span>Stars</span><strong>38%</strong></div>
                <div class="chart-matrix-cell"><span>Puzzles</span><strong>17%</strong></div>
                <div class="chart-matrix-cell"><span>Plow Horses</span><strong>31%</strong></div>
                <div class="chart-matrix-cell"><span>Dogs</span><strong>14%</strong></div>
            </div>
            <div class="chart-axis-note"><span>Low popularity</span><span>High popularity</span></div>`
  );
}

function funnelChart(title, subtitle) {
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--funnel",
    `            <div class="chart-funnel">
                <div class="chart-funnel-row" style="--w:100%">Onboarded teams <strong>100%</strong></div>
                <div class="chart-funnel-row" style="--w:84%">Weekly active <strong>84%</strong></div>
                <div class="chart-funnel-row" style="--w:62%">Workflow complete <strong>62%</strong></div>
                <div class="chart-funnel-row" style="--w:47%">Month-6 retained <strong>47%</strong></div>
            </div>`
  );
}

function timelineChart(title, subtitle) {
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--timeline",
    `            <div class="chart-timeline">
                <div class="chart-track"></div>
                <div class="chart-milestone" style="--p:9%"><span class="chart-dot"></span><strong>Pilot</strong><small>Week 1</small></div>
                <div class="chart-milestone" style="--p:34%"><span class="chart-dot"></span><strong>Integrations</strong><small>Week 2</small></div>
                <div class="chart-milestone" style="--p:63%"><span class="chart-dot"></span><strong>Training</strong><small>Week 3</small></div>
                <div class="chart-milestone" style="--p:88%"><span class="chart-dot"></span><strong>Scale-out</strong><small>Week 4</small></div>
            </div>`
  );
}

function heatmapChart(title, subtitle) {
  const cells = [
    "lvl-3", "lvl-2", "lvl-4", "lvl-3", "lvl-5", "lvl-4", "lvl-3",
    "lvl-2", "lvl-1", "lvl-3", "lvl-4", "lvl-5", "lvl-4", "lvl-2",
    "lvl-3", "lvl-2", "lvl-3", "lvl-4", "lvl-4", "lvl-5", "lvl-3",
  ];
  const grid = cells.map((lvl) => `<span class="chart-heat-cell ${lvl}"></span>`).join("");
  return chartWrap(
    title,
    subtitle,
    "blog-mini-chart--heatmap",
    `            <div class="chart-heatmap">${grid}</div>
            <div class="chart-heat-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>`
  );
}

function mockupBlock() {
  return `        <figure class="blog-mockup-card">
            <img src="../../images/product-2.jpg" alt="TableTurnr operations dashboard mockup" loading="lazy" />
            <figcaption>TableTurnr product mockup</figcaption>
        </figure>`;
}

function panel(h3, p, kpi1, kpi2, kpi3, chartHtml) {
  return `<div class="blog-data-panel">
    <h3>${h3}</h3>
    <p>${p}</p>
    <div class="blog-data-kpis">
        <div class="blog-data-kpi"><strong>${kpi1.v}</strong><span>${kpi1.l}</span></div>
        <div class="blog-data-kpi"><strong>${kpi2.v}</strong><span>${kpi2.l}</span></div>
        <div class="blog-data-kpi"><strong>${kpi3.v}</strong><span>${kpi3.l}</span></div>
    </div>
    <div class="blog-chart-and-mockup">
${mockupBlock()}
${chartHtml}
    </div>
</div>`;
}

const SNAPSHOTS = {
  "data-gaps-restaurant-ops": panel(
    "Signal coverage",
    "Unify POS, labor, and inventory signals before optimizing decisions.",
    { v: "78%", l: "Sources live" },
    { v: "2", l: "Feeds missing" },
    { v: "14", l: "Sync delays" },
    donutChart("Data completeness mix", "Source coverage")
  ),
  "forecast-accuracy-why-98-changes-everything": panel(
    "Forecast accuracy lens",
    "Hour-level precision improves prep, labor, and purchasing in one move.",
    { v: "98.2%", l: "Hit rate" },
    { v: "1.4%", l: "MAPE" },
    { v: "-12%", l: "Prep waste" },
    lineChart("Forecast vs actual", "7-day trend")
  ),
  "from-prototype-to-production": panel(
    "Go-live readiness",
    "Prototype validates value; production validates repeatability at scale.",
    { v: "11", l: "Sites on v2" },
    { v: "99.1%", l: "Uptime" },
    { v: "18d", l: "Avg rollout" },
    timelineChart("Rollout milestones", "30-day sequence")
  ),
  "how-to-reduce-restaurant-labor-costs": panel(
    "Labor cost snapshot",
    "Align demand, staffing hours, and overtime before the week closes.",
    { v: "28.4%", l: "Labor ratio" },
    { v: "1.8%", l: "Overtime" },
    { v: "+$4.2k", l: "Saved MTD" },
    groupedBarChart("Planned vs actual hours", "By daypart", [
      { label: "Open", plan: 55, actual: 51 },
      { label: "Lunch", plan: 78, actual: 72 },
      { label: "PM", plan: 90, actual: 84 },
      { label: "Late", plan: 44, actual: 39 },
    ])
  ),
  "menu-engineering-the-matrix-that-prints-money": panel(
    "Menu mix snapshot",
    "Stars sustain margin, Puzzles need promotion, and Dogs need action.",
    { v: "38%", l: "Stars mix" },
    { v: "+22%", l: "Margin lift" },
    { v: "12", l: "Items flagged" },
    matrixChart("Menu engineering matrix", "Profitability x popularity")
  ),
  "restaurant-management-tips": panel(
    "Daily ops rhythm",
    "Morning review, owner assignment, and mid-shift check-in every day.",
    { v: "97.1%", l: "On-time opens" },
    { v: "2.1", l: "Issues fixed" },
    { v: "4.4/5", l: "Handoff score" },
    heatmapChart("Execution heatmap", "Three-week consistency")
  ),
  "why-restaurant-tech-fails-in-year-one": panel(
    "Year-one adoption risk",
    "When usage slips, ROI fades; monitor weekly actives and workflow depth.",
    { v: "27%", l: "Seat churn" },
    { v: "2.1", l: "Logins / wk" },
    { v: "14%", l: "Feature depth" },
    funnelChart("Adoption funnel", "Month 1 to month 6")
  ),
};

function replaceDataPanel(html, newPanel) {
  const marker = '<div class="blog-data-panel">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
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
  return html.slice(0, start) + newPanel + html.slice(pos);
}

for (const slug of Object.keys(SNAPSHOTS)) {
  const file = path.join(blogRoot, slug, "index.html");
  if (!fs.existsSync(file)) {
    console.warn("missing file", slug);
    continue;
  }
  const orig = fs.readFileSync(file, "utf8");
  const next = replaceDataPanel(orig, SNAPSHOTS[slug]);
  if (next == null) {
    console.warn("no panel", slug);
    continue;
  }
  if (next !== orig) {
    fs.writeFileSync(file, next, "utf8");
    console.log("updated", slug);
  }
}
