(function () {
  'use strict';

  var B = window.ROI_BENCHMARKS;
  var P = window.ROI_PRESETS;
  var TIERS = window.ROI_PRICING_TIERS;
  var CURRENCIES = window.ROI_CURRENCIES;

  var state = {
    step: 1,
    profile: {
      segment: 'casual_dining',
      currency: 'USD',
      annualRevenue: 1200000,
      locations: 1,
      posSystem: 'toast'
    },
    metrics: {
      labourPct: 33,
      foodCostPct: 32,
      wastePct: 8,
      purchaseVariancePct: 3,
      forecastAccuracy: 68,
      schedulingHoursPerWeek: 6,
      managerHourlyRate: 22,
      overtimeIncidentsPerMonth: 8,
      overtimePremiumPct: 50,
      invoicesPerWeek: 25,
      invoiceManualMinutes: 8,
      reportingHoursPerWeek: 4,
      adhocHoursPerWeek: 3
    }
  };

  function trackEvent(name, props) {
    if (typeof console !== 'undefined') console.log('[ROI Event]', name, props || {});
  }

  function getCurrency() {
    return CURRENCIES[state.profile.currency] || CURRENCIES.USD;
  }

  function fmtMoney(v) {
    var c = getCurrency();
    return new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.code, maximumFractionDigits: 0 }).format(v);
  }

  function fmtMonths(m) {
    if (m > 24) return '24+\u00A0mo';
    if (m < 1) return '< 1\u00A0mo';
    return m.toFixed(1) + '\u00A0mo';
  }

  function getTierCost(locations) {
    for (var i = 0; i < TIERS.length; i++) {
      if (locations <= TIERS[i].maxLocations) {
        return { perMonth: TIERS[i].perMonth, name: TIERS[i].name, annual: TIERS[i].perMonth * 12 * locations };
      }
    }
    var last = TIERS[TIERS.length - 1];
    return { perMonth: last.perMonth, name: last.name, annual: last.perMonth * 12 * locations };
  }

  function compute(assumptions) {
    var p = state.profile;
    var m = state.metrics;
    var a = assumptions;

    var rev = p.annualRevenue * p.locations;
    var labourSpend = rev * (m.labourPct / 100);
    var foodSpend = rev * (m.foodCostPct / 100);
    var rate = m.managerHourlyRate;

    var labourSavings = labourSpend * a.labourReduction;
    var avgShiftCost = (labourSpend / Math.max(1, p.locations)) / 12 / 60;
    var overtimeSavings = m.overtimeIncidentsPerMonth * p.locations * 12 * avgShiftCost * (m.overtimePremiumPct / 100) * a.overtimeReduction;
    var schedulingAdminSavings = m.schedulingHoursPerWeek * 52 * p.locations * rate * 0.65;
    var foodWasteSavings = foodSpend * (m.wastePct / 100) * a.wasteReduction;
    var invoiceVarianceSavings = foodSpend * (m.purchaseVariancePct / 100) * 0.50;
    var inventoryAdminSavings = 5 * 52 * p.locations * rate * 0.55;

    var currAcc = m.forecastAccuracy / 100;
    var targetAcc = 0.94;
    var fir = Math.max(0, (targetAcc - currAcc) / Math.max(0.01, 1 - currAcc));
    var revenueUplift = rev * a.revenueUpliftPct * fir;
    var invoiceProcessingSavings = m.invoicesPerWeek * 52 * p.locations * (m.invoiceManualMinutes * a.invoiceReduction / 60) * rate;
    var reportingSavings = m.reportingHoursPerWeek * 52 * p.locations * rate * a.reportingReduction;
    var adhocSavings = m.adhocHoursPerWeek * 52 * p.locations * rate * 0.70;

    var labourTotal = labourSavings + overtimeSavings + schedulingAdminSavings;
    var foodTotal = foodWasteSavings + invoiceVarianceSavings + inventoryAdminSavings;
    var adminTotal = invoiceProcessingSavings + reportingSavings + adhocSavings;
    var totalSavings = labourTotal + foodTotal + revenueUplift + adminTotal;

    var tier = getTierCost(p.locations);
    var cost = tier.annual;
    var netROI = totalSavings - cost;
    var payback = totalSavings > 0 ? cost / (totalSavings / 12) : 999;
    var multiple = cost > 0 ? totalSavings / cost : 0;

    return {
      labourSavings: labourSavings, overtimeSavings: overtimeSavings, schedulingAdminSavings: schedulingAdminSavings,
      foodWasteSavings: foodWasteSavings, invoiceVarianceSavings: invoiceVarianceSavings, inventoryAdminSavings: inventoryAdminSavings,
      revenueUplift: revenueUplift, invoiceProcessingSavings: invoiceProcessingSavings,
      reportingSavings: reportingSavings, adhocSavings: adhocSavings,
      labourTotal: labourTotal, foodTotal: foodTotal, adminTotal: adminTotal,
      totalSavings: totalSavings, tableturnrCost: cost,
      tierName: tier.name, tierPerMonth: tier.perMonth,
      netROI: netROI, paybackMonths: payback, roiMultiple: multiple,
      annualRevenue: rev, annualLabourSpend: labourSpend, annualFoodSpend: foodSpend,
      forecastImprovementRatio: fir
    };
  }

  function computeAllScenarios() {
    var out = {};
    ['conservative', 'balanced', 'optimistic'].forEach(function (key) {
      out[key] = compute(P[key]);
    });
    return out;
  }

  function computeSensitivity() {
    var pts = [];
    var baseRev = state.profile.annualRevenue;
    var a = P.balanced;
    for (var pct = 50; pct <= 200; pct += 10) {
      var oldRev = state.profile.annualRevenue;
      state.profile.annualRevenue = baseRev * pct / 100;
      var r = compute(a);
      pts.push({ revenue: state.profile.annualRevenue, netROI: r.netROI });
      state.profile.annualRevenue = oldRev;
    }
    var breakeven = null;
    for (var i = 1; i < pts.length; i++) {
      if ((pts[i - 1].netROI < 0 && pts[i].netROI >= 0) || (pts[i - 1].netROI >= 0 && pts[i].netROI < 0)) {
        var frac = Math.abs(pts[i - 1].netROI) / (Math.abs(pts[i - 1].netROI) + Math.abs(pts[i].netROI));
        breakeven = pts[i - 1].revenue + frac * (pts[i].revenue - pts[i - 1].revenue);
        break;
      }
    }
    return { points: pts, breakeven: breakeven };
  }

  function applyBenchmarks() {
    var seg = B[state.profile.segment];
    if (!seg) return;
    state.metrics.labourPct = seg.labourPct;
    state.metrics.foodCostPct = seg.foodCostPct;
    state.metrics.wastePct = seg.wastePct;
    state.metrics.forecastAccuracy = seg.forecastAccuracy;
  }

  function showStep(n) {
    state.step = n;
    document.querySelectorAll('.roi-step').forEach(function (el) {
      el.classList.toggle('active', el.dataset.step == n);
    });
    document.querySelectorAll('.roi-progress-step').forEach(function (el) {
      var s = parseInt(el.dataset.step);
      el.classList.toggle('completed', s < n);
      el.classList.toggle('active', s == n);
    });
    var bar = document.getElementById('roi-progress-fill');
    if (bar) bar.style.width = ((n - 1) / 2 * 100) + '%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 3) renderResults();
  }

  function bindStep1() {
    var segEl = document.getElementById('roi-segment');
    var curEl = document.getElementById('roi-currency');
    var revEl = document.getElementById('roi-revenue');
    var locEl = document.getElementById('roi-locations');
    var posEl = document.getElementById('roi-pos');

    function sync() {
      state.profile.segment = segEl.value;
      state.profile.currency = curEl.value;
      state.profile.annualRevenue = parseFloat(revEl.value) || 0;
      state.profile.locations = parseInt(locEl.value) || 1;
      state.profile.posSystem = posEl.value;
    }

    segEl.addEventListener('change', function () {
      sync();
      applyBenchmarks();
      populateStep2();
    });

    [curEl, revEl, locEl, posEl].forEach(function (el) {
      el.addEventListener('input', sync);
    });

    document.getElementById('roi-step1-next').addEventListener('click', function () {
      sync();
      var errs = [];
      if (state.profile.annualRevenue < 50000) errs.push('Annual revenue must be at least ' + fmtMoney(50000));
      if (state.profile.locations < 1 || state.profile.locations > 500) errs.push('Locations must be between 1 and 500');
      if (errs.length) { showValidation('roi-step1-errors', errs); return; }
      clearValidation('roi-step1-errors');
      applyBenchmarks();
      populateStep2();
      trackEvent('step_completed', { step: 1 });
      showStep(2);
    });
  }

  function showValidation(id, msgs) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = msgs.map(function (m) { return '<p class="roi-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#EF4444"/></svg> ' + m + '</p>'; }).join('');
  }

  function clearValidation(id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '';
  }

  function populateStep2() {
    var seg = B[state.profile.segment];
    var label = document.getElementById('roi-segment-label');
    if (label && seg) label.textContent = seg.label;

    var ids = {
      labourPct: 'roi-labour-pct', foodCostPct: 'roi-food-pct', wastePct: 'roi-waste-pct',
      forecastAccuracy: 'roi-forecast-acc', managerHourlyRate: 'roi-manager-rate',
      overtimeIncidentsPerMonth: 'roi-overtime-incidents', schedulingHoursPerWeek: 'roi-sched-hours',
      invoicesPerWeek: 'roi-invoices-week', reportingHoursPerWeek: 'roi-reporting-hours',
      purchaseVariancePct: 'roi-variance-pct'
    };
    Object.keys(ids).forEach(function (key) {
      var el = document.getElementById(ids[key]);
      if (el) el.value = state.metrics[key];
    });

    if (seg) {
      var badges = {
        'roi-labour-pct': seg.labourPct + '%',
        'roi-food-pct': seg.foodCostPct + '%',
        'roi-waste-pct': seg.wastePct + '%',
        'roi-forecast-acc': seg.forecastAccuracy + '%'
      };
      Object.keys(badges).forEach(function (id) {
        var badge = document.querySelector('[data-benchmark-for="' + id + '"]');
        if (badge) badge.textContent = 'Industry avg: ' + badges[id];
      });
    }
  }

  function bindStep2() {
    var fields = [
      { id: 'roi-labour-pct', key: 'labourPct' },
      { id: 'roi-food-pct', key: 'foodCostPct' },
      { id: 'roi-waste-pct', key: 'wastePct' },
      { id: 'roi-forecast-acc', key: 'forecastAccuracy' },
      { id: 'roi-manager-rate', key: 'managerHourlyRate' },
      { id: 'roi-overtime-incidents', key: 'overtimeIncidentsPerMonth' },
      { id: 'roi-sched-hours', key: 'schedulingHoursPerWeek' },
      { id: 'roi-invoices-week', key: 'invoicesPerWeek' },
      { id: 'roi-reporting-hours', key: 'reportingHoursPerWeek' },
      { id: 'roi-variance-pct', key: 'purchaseVariancePct' }
    ];

    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (!el) return;
      el.addEventListener('input', function () {
        state.metrics[f.key] = parseFloat(el.value) || 0;
      });
    });

    document.getElementById('roi-step2-next').addEventListener('click', function () {
      var warnings = [];
      if (state.metrics.labourPct > 45) warnings.push('Labour cost is above 45% — that means high savings potential');
      if (state.metrics.foodCostPct > 35) warnings.push('Food cost is above 35% — above most industry averages');
      if (warnings.length) showValidation('roi-step2-warnings', warnings);
      trackEvent('step_completed', { step: 2 });
      showStep(3);
    });

    document.getElementById('roi-step2-back').addEventListener('click', function () { showStep(1); });
  }

  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;
    var text = el.textContent;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * eased);
      el.textContent = fmtMoney(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderResults() {
    var scenarios = computeAllScenarios();
    var bal = scenarios.balanced;
    var sensitivity = computeSensitivity();
    var c = getCurrency();

    var map = {
      conservative: { savings: 'roi-sc-con-savings', payback: 'roi-sc-con-payback', roi: 'roi-sc-con-roi', cost: 'roi-sc-con-cost' },
      balanced:      { savings: 'roi-sc-bal-savings', payback: 'roi-sc-bal-payback', roi: 'roi-sc-bal-roi', cost: 'roi-sc-bal-cost' },
      optimistic:    { savings: 'roi-sc-opt-savings', payback: 'roi-sc-opt-payback', roi: 'roi-sc-opt-roi', cost: 'roi-sc-opt-cost' }
    };

    ['conservative', 'balanced', 'optimistic'].forEach(function (key) {
      var r = scenarios[key];
      var ids = map[key];
      var savEl = document.getElementById(ids.savings);
      if (savEl) animateValue(savEl, r.netROI, 800);
      setText(ids.payback, fmtMonths(r.paybackMonths));
      setText(ids.roi, r.roiMultiple.toFixed(1) + 'x return');
      setText(ids.cost, fmtMoney(r.tableturnrCost) + '/yr');

      var card = savEl ? savEl.closest('.roi-scenario-card') : null;
      if (card) {
        card.classList.toggle('negative-result', r.netROI < 0);
      }
    });

    var negMsg = document.getElementById('roi-negative-msg');
    if (negMsg) negMsg.style.display = bal.netROI < 0 ? 'block' : 'none';

    renderWaterfall(bal, c);
    renderModuleCards(bal);
    renderModuleRings(bal);
    window.ROICharts.sensitivityLine('roi-chart-sensitivity', sensitivity.points, sensitivity.breakeven, c);
    trackEvent('results_viewed', { netROI: bal.netROI, locations: state.profile.locations });
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderWaterfall(r, c) {
    var el = document.getElementById('roi-waterfall');
    if (!el) return;

    var items = [
      { label: 'Labour & Scheduling', value: r.labourTotal, color: '#FF6B35' },
      { label: 'Food & Inventory',    value: r.foodTotal,   color: '#38bdf8' },
      { label: 'Revenue Uplift',      value: r.revenueUplift, color: '#22c55e' },
      { label: 'Admin Automation',     value: r.adminTotal,  color: '#a78bfa' },
      { label: 'TableTurnr Cost',      value: -r.tableturnrCost, color: '#6b7280' }
    ];

    var maxVal = 0;
    items.forEach(function (it) { if (Math.abs(it.value) > maxVal) maxVal = Math.abs(it.value); });
    if (maxVal === 0) maxVal = 1;

    var fmt = new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.code, maximumFractionDigits: 0 });
    var html = '';
    items.forEach(function (it) {
      var pct = Math.abs(it.value) / maxVal * 100;
      var isNeg = it.value < 0;
      html += '<div class="roi-wf-row">';
      html += '<div class="roi-wf-label">' + it.label + '</div>';
      html += '<div class="roi-wf-bar-wrap">';
      html += '<div class="roi-wf-bar' + (isNeg ? ' negative' : '') + '" style="width:' + pct + '%;background:' + it.color + '"></div>';
      html += '</div>';
      html += '<div class="roi-wf-value' + (isNeg ? ' negative' : '') + '">' + (isNeg ? '\u2212' : '+') + fmt.format(Math.abs(it.value)) + '</div>';
      html += '</div>';
    });

    var net = r.netROI;
    html += '<div class="roi-wf-row roi-wf-total">';
    html += '<div class="roi-wf-label"><strong>Net Annual ROI</strong></div>';
    html += '<div class="roi-wf-bar-wrap"></div>';
    html += '<div class="roi-wf-value ' + (net >= 0 ? 'positive' : 'negative') + '"><strong>' + fmt.format(net) + '</strong></div>';
    html += '</div>';

    el.innerHTML = html;
  }

  function renderModuleRings(r) {
    var total = r.totalSavings || 1;
    var modules = [
      { id: 'roi-ring-labour',   value: r.labourTotal,   color: '#FF6B35' },
      { id: 'roi-ring-food',     value: r.foodTotal,     color: '#38bdf8' },
      { id: 'roi-ring-forecast', value: r.revenueUplift, color: '#22c55e' },
      { id: 'roi-ring-admin',    value: r.adminTotal,    color: '#a78bfa' }
    ];

    modules.forEach(function (mod) {
      var el = document.getElementById(mod.id);
      if (!el) return;
      var pct = Math.min(100, (mod.value / total) * 100);
      var circumference = 2 * Math.PI * 28;
      var offset = circumference - (pct / 100) * circumference;
      el.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#2E2E2E" stroke-width="5"/><circle cx="32" cy="32" r="28" fill="none" stroke="' + mod.color + '" stroke-width="5" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" transform="rotate(-90 32 32)" style="transition:stroke-dashoffset 0.8s ease"/><text x="32" y="35" text-anchor="middle" fill="' + mod.color + '" font-size="13" font-weight="700" font-family="JetBrains Mono,monospace">' + Math.round(pct) + '%</text></svg>';
    });
  }

  function renderModuleCards(r) {
    var m = state.metrics;

    setText('roi-mod-labour-total', fmtMoney(r.labourTotal));
    setText('roi-mod-food-total', fmtMoney(r.foodTotal));
    setText('roi-mod-forecast-total', fmtMoney(r.revenueUplift));
    setText('roi-mod-admin-total', fmtMoney(r.adminTotal));

    setHtml('roi-card-labour', [
      row('Scheduling optimization', fmtMoney(r.labourSavings), 'positive'),
      row('Overtime reduction', fmtMoney(r.overtimeSavings), 'positive'),
      row('Admin time saved', fmtMoney(r.schedulingAdminSavings), 'positive')
    ]);

    setHtml('roi-card-food', [
      row('Waste reduction', fmtMoney(r.foodWasteSavings), 'positive'),
      row('Invoice variance recovery', fmtMoney(r.invoiceVarianceSavings), 'positive'),
      row('Inventory admin saved', fmtMoney(r.inventoryAdminSavings), 'positive')
    ]);

    setHtml('roi-card-forecast', [
      row('Current accuracy', m.forecastAccuracy + '%', ''),
      row('Target accuracy', '94%', ''),
      row('Revenue uplift', fmtMoney(r.revenueUplift), 'positive')
    ]);

    setHtml('roi-card-admin', [
      row('Invoice processing', fmtMoney(r.invoiceProcessingSavings), 'positive'),
      row('Reporting automation', fmtMoney(r.reportingSavings), 'positive'),
      row('Ad-hoc queries saved', fmtMoney(r.adhocSavings), 'positive')
    ]);
  }

  function row(label, value, cls) {
    return '<div class="roi-card-row"><span>' + label + '</span><strong class="' + (cls || '') + '">' + value + '</strong></div>';
  }

  function setHtml(id, rows) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = rows.join('');
  }

  function bindResults() {
    document.getElementById('roi-step3-back').addEventListener('click', function () { showStep(2); });

    document.getElementById('roi-download-pdf').addEventListener('click', function () {
      trackEvent('pdf_downloaded');
      window.print();
    });

    document.getElementById('roi-book-demo').addEventListener('click', function () {
      trackEvent('demo_clicked');
    });

    var shareBtn = document.getElementById('roi-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var params = new URLSearchParams();
        params.set('seg', state.profile.segment);
        params.set('rev', state.profile.annualRevenue);
        params.set('loc', state.profile.locations);
        params.set('cur', state.profile.currency);
        var url = window.location.origin + window.location.pathname + '?' + params.toString();
        navigator.clipboard.writeText(url).then(function () {
          shareBtn.textContent = 'Link copied!';
          setTimeout(function () { shareBtn.textContent = 'Share Results'; }, 2000);
        });
      });
    }
  }

  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('seg')) state.profile.segment = params.get('seg');
    if (params.has('rev')) state.profile.annualRevenue = parseFloat(params.get('rev')) || state.profile.annualRevenue;
    if (params.has('loc')) state.profile.locations = parseInt(params.get('loc')) || state.profile.locations;
    if (params.has('cur')) state.profile.currency = params.get('cur');
  }

  function init() {
    loadFromURL();
    applyBenchmarks();
    bindStep1();
    bindStep2();
    bindResults();
    populateStep2();
    showStep(1);

    document.getElementById('roi-segment').value = state.profile.segment;
    document.getElementById('roi-currency').value = state.profile.currency;
    document.getElementById('roi-revenue').value = state.profile.annualRevenue;
    document.getElementById('roi-locations').value = state.profile.locations;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
