window.ROI_BENCHMARKS = {
  fine_dining:   { labourPct: 35, foodCostPct: 30, wastePct: 7,  forecastAccuracy: 72, label: 'Fine Dining' },
  casual_dining: { labourPct: 33, foodCostPct: 32, wastePct: 8,  forecastAccuracy: 68, label: 'Casual Dining' },
  fast_casual:   { labourPct: 28, foodCostPct: 28, wastePct: 6,  forecastAccuracy: 74, label: 'Fast Casual' },
  qsr:           { labourPct: 25, foodCostPct: 30, wastePct: 5,  forecastAccuracy: 78, label: 'QSR' },
  coffee_bakery: { labourPct: 38, foodCostPct: 27, wastePct: 12, forecastAccuracy: 65, label: 'Coffee & Bakery' },
  ghost_kitchen: { labourPct: 20, foodCostPct: 31, wastePct: 9,  forecastAccuracy: 70, label: 'Ghost Kitchen' },
  franchise:     { labourPct: 30, foodCostPct: 30, wastePct: 7,  forecastAccuracy: 71, label: 'Franchise Group' }
};

window.ROI_PRESETS = {
  conservative: {
    labourReduction: 0.04,
    overtimeReduction: 0.15,
    wasteReduction: 0.10,
    invoiceReduction: 0.50,
    revenueUpliftPct: 0.005,
    reportingReduction: 0.30
  },
  balanced: {
    labourReduction: 0.08,
    overtimeReduction: 0.35,
    wasteReduction: 0.22,
    invoiceReduction: 0.75,
    revenueUpliftPct: 0.025,
    reportingReduction: 0.60
  },
  optimistic: {
    labourReduction: 0.15,
    overtimeReduction: 0.55,
    wasteReduction: 0.38,
    invoiceReduction: 0.88,
    revenueUpliftPct: 0.05,
    reportingReduction: 0.80
  }
};

window.ROI_ASSUMPTION_META = [
  { key: 'labourReduction',    label: 'Labour cost reduction',         min: 0.03, max: 0.20, step: 0.01, fmt: '%', source: 'Based on TableTurnr customer avg across 47 locations' },
  { key: 'overtimeReduction',  label: 'Overtime reduction',            min: 0.10, max: 0.60, step: 0.01, fmt: '%', source: 'Based on AI scheduling adoption data' },
  { key: 'wasteReduction',     label: 'Food waste reduction',          min: 0.05, max: 0.40, step: 0.01, fmt: '%', source: 'Based on Foresight demand forecasting results' },
  { key: 'invoiceReduction',   label: 'Invoice processing time saved', min: 0.40, max: 0.90, step: 0.01, fmt: '%', source: 'SnapTurnr OCR automation benchmark' },
  { key: 'revenueUpliftPct',   label: 'Revenue uplift from staffing',  min: 0.005,max: 0.06, step: 0.005,fmt: '%', source: 'Conservative estimate from better coverage' },
  { key: 'reportingReduction', label: 'Admin hours saved (reporting)',  min: 0.20, max: 0.80, step: 0.01, fmt: '%', source: 'TurnrAgent automation benchmark' }
];

window.ROI_CURRENCIES = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  GBP: { symbol: '\u00A3', code: 'GBP', locale: 'en-GB' },
  EUR: { symbol: '\u20AC', code: 'EUR', locale: 'de-DE' },
  AUD: { symbol: 'A$', code: 'AUD', locale: 'en-AU' }
};

window.ROI_PRICING_TIERS = [
  { maxLocations: 3,    perMonth: 149, name: 'Starter' },
  { maxLocations: 10,   perMonth: 249, name: 'Growth' },
  { maxLocations: 9999, perMonth: 399, name: 'Enterprise' }
];
