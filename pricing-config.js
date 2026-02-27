window.OPERATIONS_SCENARIOS = [
    {
        id: "inventory",
        title: "Stockout in 19 hours.",
        summary: "TurnrSense flags it. Cart builds automatically. One tap to reorder from US Foods, Costco, or Instacart.",
        mobileSummary: "Flagged. Cart built. One tap to reorder.",
        image: "images/product-2.jpg"
    },
    {
        id: "staffing",
        title: "Friday needs 2 more servers.",
        summary: "TurnrForesight spots the gap. Available staff pinged. Shift filled before you check.",
        mobileSummary: "Gap spotted. Staff pinged. Shift filled.",
        image: "images/product-5.png"
    },
    {
        id: "turntime",
        title: "Tables turning 12 min slow.",
        summary: "TurnrOps catches the drift live. Resets prioritized. That's 7 more covers per hour recovered.",
        mobileSummary: "Drift caught. Resets prioritized. 7 more covers/hr.",
        image: "images/product-4.png"
    },
    {
        id: "policy",
        title: "Staff has a policy question.",
        summary: "TurnrAgent answers from your uploaded docs. Unsure? Escalates to you. Always grounded, never guessing.",
        mobileSummary: "Answered from your docs. Unsure? Escalates to you.",
        image: "images/product-3.jpg"
    }
];

window.METRIC_DEFINITIONS = [
    {
        label: "Table turn-time",
        formula: "avg(table_close_time - table_seated_time)",
        cadence: "Hourly service rollup"
    },
    {
        label: "Labor percentage",
        formula: "(total_labor_cost / net_sales) * 100",
        cadence: "Near-live + daily close"
    },
    {
        label: "Prime cost percentage",
        formula: "((COGS + labor_cost) / net_sales) * 100",
        cadence: "Daily close"
    },
    {
        label: "Forecast accuracy",
        formula: "100 - (abs(actual - forecast) / actual * 100)",
        cadence: "Daily and weekly average"
    },
    {
        label: "Covers per hour",
        formula: "total_covers / total_service_hours",
        cadence: "Hourly service rollup"
    }
];

window.CONVERSATION_THREADS = [
    {
        id: "staffing",
        time: "2:15 PM",
        messages: [
            { speaker: "Dana", role: "Regional", color: "#8b5cf6", message: "Friday dinner needs 5 servers. Only 3 booked." },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "Sarah available Fri 4pm\u2013close. Shift request sent." },
            { speaker: "Sarah", role: "Server", color: "#22c55e", message: "\u2713 Confirmed! See you Friday." }
        ]
    },
    {
        id: "inventory",
        time: "7:30 AM",
        messages: [
            { speaker: "Marco", role: "GM", color: "#3b82f6", message: "Eggs flagged below safety stock. @TurnrAgent prep restock." },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "Cart ready via US Foods: eggs + half-and-half. $487. Place order?" },
            { speaker: "Marco", role: "GM", color: "#3b82f6", message: "Place it." },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "\u2713 Ordered. ETA tomorrow 6 AM." }
        ]
    },
    {
        id: "reporting",
        time: "9:00 AM",
        messages: [
            { speaker: "James", role: "CEO", color: "#374151", message: "Need Q4 sales with discount and beverage numbers." },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "Q4: $847K net (+3.2%). Discounts: \u2212$31K. Bev: $186K (\u2193 8%). 12 stockout events on top SKUs." },
            { speaker: "Marco", role: "GM", color: "#3b82f6", message: "Fix the stockouts. Adjust thresholds." },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "\u2713 Safety stock updated. Next order ready for Friday." }
        ]
    },
    {
        id: "performance",
        time: "6:00 PM",
        messages: [
            { speaker: "Marco", role: "GM", color: "#3b82f6", message: "Who is top server this week?" },
            { speaker: "TurnrAgent", role: "AI", color: "#ff6b00", message: "Sarah: $8,420 rev (+22%), 74% bev attach, 4.9 rating." },
            { speaker: "Marco", role: "GM", color: "#3b82f6", message: "Great work @Sarah! Drinks on me after close." }
        ]
    }
];
