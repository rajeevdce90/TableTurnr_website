(function () {
  'use strict';

  var COLORS = [
    '#FF6B35', '#38bdf8', '#22c55e', '#f59e0b',
    '#a78bfa', '#fb7185', '#2dd4bf', '#818cf8',
    '#f97316', '#84cc16'
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  window.ROICharts = {
    stackedBar: function (containerId, items, currency) {
      var el = document.getElementById(containerId);
      if (!el) return;
      var total = items.reduce(function (s, i) { return s + i.value; }, 0);
      if (total <= 0) { el.innerHTML = '<p style="color:var(--text-soft)">No savings to display.</p>'; return; }

      var fmt = new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 0 });
      var barH = 56;
      var html = '<svg viewBox="0 0 800 ' + (barH + 110) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Savings breakdown chart" style="width:100%;height:auto;display:block">';

      var x = 0;
      items.forEach(function (item, idx) {
        if (item.value <= 0) return;
        var w = (item.value / total) * 780;
        var color = COLORS[idx % COLORS.length];
        html += '<rect x="' + (10 + x) + '" y="10" width="' + w + '" height="' + barH + '" rx="4" fill="' + color + '" opacity="0.92">';
        html += '<title>' + esc(item.label) + ': ' + fmt.format(item.value) + '</title></rect>';
        if (w > 60) {
          html += '<text x="' + (10 + x + w / 2) + '" y="' + (10 + barH / 2 + 5) + '" text-anchor="middle" fill="#fff" font-size="12" font-family="JetBrains Mono,monospace" font-weight="600">' + fmt.format(item.value) + '</text>';
        }
        x += w;
      });

      var ly = barH + 36;
      var lx = 10;
      items.forEach(function (item, idx) {
        if (item.value <= 0) return;
        var color = COLORS[idx % COLORS.length];
        html += '<rect x="' + lx + '" y="' + ly + '" width="12" height="12" rx="3" fill="' + color + '"/>';
        html += '<text x="' + (lx + 18) + '" y="' + (ly + 10) + '" fill="#9CA3AF" font-size="11" font-family="Inter,sans-serif">' + esc(item.label) + '</text>';
        lx += Math.max(item.label.length * 7 + 30, 100);
        if (lx > 700) { lx = 10; ly += 22; }
      });

      html += '</svg>';
      el.innerHTML = html;
    },

    sensitivityLine: function (containerId, dataPoints, breakeven, currency) {
      var el = document.getElementById(containerId);
      if (!el || !dataPoints.length) return;

      var fmt = new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 0, notation: 'compact' });
      var fmtFull = new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 0 });

      var W = 700, H = 280, PAD = 60, PADR = 30, PADT = 20, PADB = 40;
      var minX = dataPoints[0].revenue, maxX = dataPoints[dataPoints.length - 1].revenue;
      var minY = Infinity, maxY = -Infinity;
      dataPoints.forEach(function (d) {
        if (d.netROI < minY) minY = d.netROI;
        if (d.netROI > maxY) maxY = d.netROI;
      });
      var rangeBuffer = (maxY - minY) * 0.1 || 10000;
      minY -= rangeBuffer; maxY += rangeBuffer;

      function sx(v) { return PAD + (v - minX) / (maxX - minX) * (W - PAD - PADR); }
      function sy(v) { return PADT + (1 - (v - minY) / (maxY - minY)) * (H - PADT - PADB); }

      var pts = dataPoints.map(function (d) { return sx(d.revenue) + ',' + sy(d.netROI); }).join(' ');

      var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sensitivity analysis chart" style="width:100%;height:auto;display:block">';

      var zeroY = sy(0);
      if (zeroY > PADT && zeroY < H - PADB) {
        html += '<line x1="' + PAD + '" y1="' + zeroY + '" x2="' + (W - PADR) + '" y2="' + zeroY + '" stroke="#374151" stroke-width="1" stroke-dasharray="4 4"/>';
        html += '<text x="' + (PAD - 5) + '" y="' + (zeroY + 4) + '" text-anchor="end" fill="#9CA3AF" font-size="10" font-family="JetBrains Mono,monospace">$0</text>';
      }

      for (var g = 0; g < 5; g++) {
        var gv = minY + (maxY - minY) * g / 4;
        var gy = sy(gv);
        html += '<line x1="' + PAD + '" y1="' + gy + '" x2="' + (W - PADR) + '" y2="' + gy + '" stroke="#1f2937" stroke-width="0.5"/>';
        html += '<text x="' + (PAD - 5) + '" y="' + (gy + 4) + '" text-anchor="end" fill="#6b7280" font-size="9" font-family="JetBrains Mono,monospace">' + fmt.format(gv) + '</text>';
      }

      for (var t = 0; t < dataPoints.length; t += Math.max(1, Math.floor(dataPoints.length / 5))) {
        var tx = sx(dataPoints[t].revenue);
        html += '<text x="' + tx + '" y="' + (H - 10) + '" text-anchor="middle" fill="#6b7280" font-size="9" font-family="JetBrains Mono,monospace">' + fmt.format(dataPoints[t].revenue) + '</text>';
      }

      html += '<polyline points="' + pts + '" fill="none" stroke="#FF6B35" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';

      if (breakeven > minX && breakeven < maxX) {
        var bx = sx(breakeven);
        html += '<line x1="' + bx + '" y1="' + PADT + '" x2="' + bx + '" y2="' + (H - PADB) + '" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="6 3"/>';
        html += '<text x="' + bx + '" y="' + (PADT - 4) + '" text-anchor="middle" fill="#EF4444" font-size="10" font-weight="600" font-family="Inter,sans-serif">Breakeven: ' + fmtFull.format(breakeven) + '</text>';
      }

      dataPoints.forEach(function (d) {
        var cx = sx(d.revenue), cy = sy(d.netROI);
        html += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#FF6B35" stroke="#0F0F0F" stroke-width="1.5">';
        html += '<title>Revenue: ' + fmtFull.format(d.revenue) + ' | Net ROI: ' + fmtFull.format(d.netROI) + '</title></circle>';
      });

      html += '<text x="' + (W / 2) + '" y="' + (H - 0) + '" text-anchor="middle" fill="#6b7280" font-size="10" font-family="Inter,sans-serif">Annual Revenue per Location</text>';
      html += '</svg>';
      el.innerHTML = html;
    }
  };
})();
