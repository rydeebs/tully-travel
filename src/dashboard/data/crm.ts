export type ScoreTier = "Hot" | "Warm" | "Nurture";

export type CrmPipelineStage = {
  count: number;
  label: string;
  value: string;
};

export type CrmLead = Record<string, unknown> & {
  assignedDesigner: string;
  client: string;
  estimatedValue: number;
  id: string;
  interest: string;
  partyWindow: string;
  score: number;
  source: "Referral" | "Conde Nast listing" | "Website" | "Partner - Singita" | "Instagram";
  tier: ScoreTier;
  wealthSignal: "Band A" | "Band B" | "Band C";
};

export type CrmRepeatMetric = {
  caption: string;
  label: string;
  target?: number;
  value: number;
};

export type CrmDesignerRow = Record<string, unknown> & {
  avgResponse: string;
  bookingsQtd: number;
  conversion: number;
  designer: string;
  id: string;
  revenueQtd: number;
};

export type CrmQuietDeal = {
  client: string;
  daysQuiet: number;
  designer: string;
  id: string;
  nextStep: string;
  stage: string;
  value: number;
};

export type CrmDashboardKpi = {
  label: string;
  note?: string;
  value: string;
};

export type CrmForecastRow = {
  bestCase: number;
  bookedToDate: number;
  commit: number;
  id: string;
  label: string;
  target: number;
  total?: boolean;
};

export type CrmEngagementSignalStatus = "Written back" | "Triggers follow-up";

export type CrmEngagementSignal = Record<string, unknown> & {
  client: string;
  hubspotProperty: string;
  id: string;
  signal: string;
  source: "Proposal Engine" | "Travefy" | "Pre-trip Brief agent" | "Survey";
  status: CrmEngagementSignalStatus;
  time: string;
};

export const crmDesignerNames = [
  "Amelia R.",
  "Jonah M.",
  "Clara V.",
  "Naomi S.",
  "Theo B.",
  "Isabelle K.",
  "Marcus D.",
  "Priya N.",
  "Evelyn C.",
  "Samuel L.",
];

export const crmPipelineStages: CrmPipelineStage[] = [
  { count: 212, label: "Inquiry", value: "$32.8M / 212" },
  { count: 138, label: "Discovery call", value: "$24.1M / 138" },
  { count: 86, label: "Proposal sent", value: "$17.4M / 86" },
  { count: 41, label: "Deposit", value: "$9.2M / 41" },
  { count: 33, label: "Booked", value: "$7.8M / 33" },
];

export const crmQ4ForecastKpis: CrmDashboardKpi[] = [
  { label: "Commit", value: "$21.4M" },
  { label: "Best case", value: "$26.9M" },
  { label: "Target", value: "$24.0M" },
  { label: "Coverage", note: "Weighted pipeline ÷ remaining target.", value: "2.1x" },
  {
    label: "Forecast accuracy last quarter",
    note: "was ±22% before the forecast layer",
    value: "±6%",
  },
];

export const crmQ4ForecastRows: CrmForecastRow[] = [
  {
    bestCase: 8_600_000,
    bookedToDate: 3_100_000,
    commit: 7_400_000,
    id: "forecast-oct-2026",
    label: "Oct",
    target: 8_000_000,
  },
  {
    bestCase: 9_000_000,
    bookedToDate: 2_200_000,
    commit: 7_000_000,
    id: "forecast-nov-2026",
    label: "Nov",
    target: 8_000_000,
  },
  {
    bestCase: 9_300_000,
    bookedToDate: 1_500_000,
    commit: 7_000_000,
    id: "forecast-dec-2026",
    label: "Dec",
    target: 8_000_000,
  },
  {
    bestCase: 26_900_000,
    bookedToDate: 6_800_000,
    commit: 21_400_000,
    id: "forecast-q4-2026",
    label: "Q4 total",
    target: 24_000_000,
    total: true,
  },
];

export const crmQ4ForecastMoves = [
  "+$1.2M to commit: Harcourt family Noble Estates deposit received",
  "-$640K from best case: M. Okafor safari moved into Q1",
  "Nov target gap narrowed to $1.0M after the Watanabe Eastern Soul hold",
];

export const crmInboundLeads: CrmLead[] = [
  {
    assignedDesigner: "Amelia R.",
    client: "The Harcourt family",
    estimatedValue: 1_480_000,
    id: "lead-harcourt",
    interest: "Noble Estates",
    partyWindow: "6 guests / March 2027",
    score: 96,
    source: "Referral",
    tier: "Hot",
    wealthSignal: "Band A",
  },
  {
    assignedDesigner: "Clara V.",
    client: "M. Okafor",
    estimatedValue: 920_000,
    id: "lead-okafor",
    interest: "Wild & Untamed",
    partyWindow: "4 guests / November 2026",
    score: 94,
    source: "Partner - Singita",
    tier: "Hot",
    wealthSignal: "Band A",
  },
  {
    assignedDesigner: "Jonah M.",
    client: "H. Laurent",
    estimatedValue: 680_000,
    id: "lead-laurent",
    interest: "Vintage & Vineyard",
    partyWindow: "2 guests / May 2027",
    score: 88,
    source: "Conde Nast listing",
    tier: "Hot",
    wealthSignal: "Band B",
  },
  {
    assignedDesigner: "Naomi S.",
    client: "The Watanabe family",
    estimatedValue: 780_000,
    id: "lead-watanabe",
    interest: "Eastern Soul",
    partyWindow: "5 guests / April 2027",
    score: 82,
    source: "Website",
    tier: "Warm",
    wealthSignal: "Band A",
  },
  {
    assignedDesigner: "Priya N.",
    client: "S. El-Amin",
    estimatedValue: 610_000,
    id: "lead-el-amin",
    interest: "Epicurean Worlds",
    partyWindow: "2 guests / February 2027",
    score: 79,
    source: "Referral",
    tier: "Warm",
    wealthSignal: "Band B",
  },
  {
    assignedDesigner: "Theo B.",
    client: "R. Whitcomb",
    estimatedValue: 420_000,
    id: "lead-whitcomb",
    interest: "Peak & Panorama",
    partyWindow: "3 guests / January 2027",
    score: 72,
    source: "Instagram",
    tier: "Warm",
    wealthSignal: "Band B",
  },
  {
    assignedDesigner: "Isabelle K.",
    client: "The Bianchi family",
    estimatedValue: 540_000,
    id: "lead-bianchi",
    interest: "Cruise & Coastline",
    partyWindow: "4 guests / June 2027",
    score: 68,
    source: "Website",
    tier: "Nurture",
    wealthSignal: "Band C",
  },
  {
    assignedDesigner: "Marcus D.",
    client: "C. Vale",
    estimatedValue: 350_000,
    id: "lead-vale",
    interest: "Grand Tour",
    partyWindow: "2 guests / September 2027",
    score: 61,
    source: "Instagram",
    tier: "Nurture",
    wealthSignal: "Band C",
  },
];

export const crmEngagementKpis: CrmDashboardKpi[] = [
  { label: "Proposal open rate", value: "88%" },
  { label: "Median time to first open", value: "3.2 h" },
  { label: "Itinerary views per trip", value: "14" },
  { label: "Pre-trip brief read", value: "91%" },
  { label: "Post-trip score", value: "9.6 / 10" },
];

export const crmEngagementFunnelStages = [
  { count: 184, label: "Proposal opened", value: "184 Q3" },
  { count: 166, label: "Itinerary viewed in Travefy", value: "166 Q3" },
  { count: 137, label: "Deposit paid", value: "137 Q3" },
  { count: 126, label: "Pre-trip brief read", value: "126 Q3" },
  { count: 92, label: "Post-trip survey answered", value: "92 Q3" },
];

export const crmEngagementSignals: CrmEngagementSignal[] = [
  {
    client: "The Harcourt family",
    hubspotProperty: "engagement_score",
    id: "signal-harcourt-proposal",
    signal: "Opened proposal 4 times",
    source: "Proposal Engine",
    status: "Triggers follow-up",
    time: "09:42",
  },
  {
    client: "M. Okafor",
    hubspotProperty: "last_itinerary_view",
    id: "signal-okafor-day-six",
    signal: "Viewed Day 6 in Travefy",
    source: "Travefy",
    status: "Written back",
    time: "09:18",
  },
  {
    client: "The Watanabe family",
    hubspotProperty: "pre_trip_brief_read",
    id: "signal-watanabe-brief",
    signal: "Read pre-trip brief",
    source: "Pre-trip Brief agent",
    status: "Written back",
    time: "08:57",
  },
  {
    client: "H. Laurent",
    hubspotProperty: "proposal_reopen_count",
    id: "signal-laurent-reopen",
    signal: "Reopened Burgundy rail pricing",
    source: "Proposal Engine",
    status: "Triggers follow-up",
    time: "08:31",
  },
  {
    client: "S. El-Amin",
    hubspotProperty: "last_itinerary_view",
    id: "signal-el-amin-travefy",
    signal: "Shared Sicily villa day with spouse",
    source: "Travefy",
    status: "Written back",
    time: "08:04",
  },
  {
    client: "L. Morandi",
    hubspotProperty: "deposit_intent",
    id: "signal-morandi-deposit",
    signal: "Opened deposit terms",
    source: "Proposal Engine",
    status: "Written back",
    time: "07:46",
  },
  {
    client: "The Bellamy family",
    hubspotProperty: "nps_last_trip",
    id: "signal-bellamy-survey",
    signal: "Post-trip score 10 · The Lebombo sunrise",
    source: "Survey",
    status: "Written back",
    time: "07:21",
  },
];

export const crmEngagementSignalPool: CrmEngagementSignal[] = [
  {
    client: "V. Rao",
    hubspotProperty: "last_itinerary_view",
    id: "live-signal-rao-kyoto",
    signal: "Viewed Aman Kyoto sequence",
    source: "Travefy",
    status: "Written back",
    time: "Now",
  },
  {
    client: "The Kenner family",
    hubspotProperty: "engagement_score",
    id: "live-signal-kenner-yacht",
    signal: "Returned to yacht hold page",
    source: "Proposal Engine",
    status: "Triggers follow-up",
    time: "Now",
  },
  {
    client: "R. Whitcomb",
    hubspotProperty: "pre_trip_brief_read",
    id: "live-signal-whitcomb-brief",
    signal: "Read weather and packing brief",
    source: "Pre-trip Brief agent",
    status: "Written back",
    time: "Now",
  },
  {
    client: "The Bianchi family",
    hubspotProperty: "last_itinerary_view",
    id: "live-signal-bianchi-coastline",
    signal: "Viewed Capri arrival day",
    source: "Travefy",
    status: "Written back",
    time: "Now",
  },
  {
    client: "C. Vale",
    hubspotProperty: "nps_last_trip",
    id: "live-signal-vale-survey",
    signal: "Post-trip score 9 · The private guide",
    source: "Survey",
    status: "Written back",
    time: "Now",
  },
];

export const crmRepeatMetrics: CrmRepeatMetric[] = [
  {
    caption: "64% repeat rate, target 70%",
    label: "12-month repeat rate",
    target: 0.7,
    value: 0.64,
  },
  {
    caption: "38% of inquiries this quarter",
    label: "Referral-sourced",
    value: 0.38,
  },
  {
    caption: "52% of active households have future travel held",
    label: "Clients with a trip in next 12 months",
    value: 0.52,
  },
];

export const crmRepeatBookingYears = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

export const crmRepeatBookingValues = [316, 148, 204, 279, 344, 392, 436, 468];

export const crmDesignerLeaderboard: CrmDesignerRow[] = [
  {
    avgResponse: "1.4 h",
    bookingsQtd: 31,
    conversion: 0.49,
    designer: "Amelia R.",
    id: "designer-amelia",
    revenueQtd: 4_860_000,
  },
  {
    avgResponse: "1.7 h",
    bookingsQtd: 28,
    conversion: 0.46,
    designer: "Clara V.",
    id: "designer-clara",
    revenueQtd: 4_210_000,
  },
  {
    avgResponse: "2.1 h",
    bookingsQtd: 25,
    conversion: 0.43,
    designer: "Jonah M.",
    id: "designer-jonah",
    revenueQtd: 3_740_000,
  },
  {
    avgResponse: "1.9 h",
    bookingsQtd: 23,
    conversion: 0.42,
    designer: "Naomi S.",
    id: "designer-naomi",
    revenueQtd: 3_280_000,
  },
  {
    avgResponse: "2.4 h",
    bookingsQtd: 21,
    conversion: 0.39,
    designer: "Theo B.",
    id: "designer-theo",
    revenueQtd: 2_960_000,
  },
  {
    avgResponse: "2.2 h",
    bookingsQtd: 19,
    conversion: 0.38,
    designer: "Priya N.",
    id: "designer-priya",
    revenueQtd: 2_640_000,
  },
];

export const crmQuietDeals: CrmQuietDeal[] = [
  {
    client: "The Bellamy family",
    daysQuiet: 11,
    designer: "Clara V.",
    id: "quiet-bellamy",
    nextStep: "Share the Singita Lebombo hold before Friday",
    stage: "Proposal sent",
    value: 1_250_000,
  },
  {
    client: "L. Morandi",
    daysQuiet: 9,
    designer: "Amelia R.",
    id: "quiet-morandi",
    nextStep: "Send the Belmond rail option with the Noble Estates villa terms",
    stage: "Discovery call",
    value: 980_000,
  },
  {
    client: "The Kenner family",
    daysQuiet: 13,
    designer: "Naomi S.",
    id: "quiet-kenner",
    nextStep: "Confirm Four Seasons yacht availability and ask for deposit timing",
    stage: "Proposal sent",
    value: 875_000,
  },
  {
    client: "V. Rao",
    daysQuiet: 8,
    designer: "Jonah M.",
    id: "quiet-rao",
    nextStep: "Offer the Aman Kyoto sequence with Eastern Soul private access",
    stage: "Discovery call",
    value: 740_000,
  },
];
