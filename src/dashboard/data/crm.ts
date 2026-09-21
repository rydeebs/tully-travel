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
