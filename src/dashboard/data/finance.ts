export type CollectionMargin = {
  highlight?: boolean;
  label: string;
  note: string;
  value: number;
};

export type OverdueSupplier = {
  amount: number;
  days: number;
  id: string;
  supplier: string;
};

export type CloseStatus = "Done" | "In progress" | "Not started";

export type CloseChecklistItem = {
  [key: string]: unknown;
  id: string;
  owner: string;
  step: string;
  status: CloseStatus;
};

export const collectionMargins: CollectionMargin[] = [
  { label: "Cruise & Coastline", value: 0.128, note: "$1.5M booked" },
  { label: "Noble Estates", value: 0.158, note: "best mix", highlight: true },
  { label: "Peak & Panorama", value: 0.136, note: "private guides" },
  { label: "Eastern Soul", value: 0.142, note: "Japan demand" },
  { label: "Wild & Untamed", value: 0.149, note: "camp inventory" },
  { label: "Epicurean Worlds", value: 0.131, note: "chef access" },
  { label: "Vintage & Vineyard", value: 0.124, note: "villa-heavy" },
  { label: "Grand Tour", value: 0.137, note: "rail and hotels" },
];

export const receivableAgeLabels = ["0-30", "31-60", "61-90", "90+"];

export const receivableAgeValues = [238000, 186000, 118000, 70000];

export const overdueSuppliers: OverdueSupplier[] = [
  { id: "belmond", supplier: "Belmond", amount: 84000, days: 74 },
  { id: "crystal", supplier: "Crystal", amount: 67000, days: 91 },
  { id: "wilderness", supplier: "Wilderness Safaris", amount: 43000, days: 68 },
  { id: "explora", supplier: "Explora Journeys", amount: 39000, days: 56 },
];

export const closeChecklist: CloseChecklistItem[] = [
  { id: "bank-feeds", step: "Bank feeds reconciled", status: "Done", owner: "Agent" },
  { id: "supplier-statements", step: "Supplier statements matched", status: "Done", owner: "Agent" },
  { id: "commission-accruals", step: "Commission accruals booked", status: "Done", owner: "Julie Boucher" },
  { id: "unearned-deposits", step: "Unearned deposits rolled", status: "Done", owner: "Maya Laurent" },
  { id: "fx-revaluation", step: "FX revaluation", status: "Done", owner: "Agent" },
  { id: "designer-payouts", step: "Designer payouts calculated", status: "In progress", owner: "Finance Ops" },
  { id: "management-pack", step: "Management pack drafted", status: "In progress", owner: "Agent" },
  { id: "cfo-review", step: "CFO review", status: "Not started", owner: "Julie Boucher" },
];

export const cashWeekLabels = [
  "W35",
  "W36",
  "W37",
  "W38",
  "W39",
  "W40",
  "W41",
  "W42",
  "W43",
  "W44",
  "W45",
  "W46",
  "W47",
];

// Actuals run through W38 (this week); the forecast carries on from the same point.
export const cashPositionValues: Array<number | null> = [
  7100000,
  7400000,
  7000000,
  7300000,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

export const cashForecastValues = [
  null,
  null,
  null,
  7300000,
  7500000,
  7400000,
  8000000,
  8200000,
  8500000,
  8700000,
  8600000,
  9000000,
  9400000,
];

export const monthChanges = [
  "Supplier-commission loop closed by the Invoice Reconciler, with disputes drafted before close review.",
  "Financial close shortened from 11 days to 6 by matching statements, accruals and bank feeds earlier.",
  "Collection margin moved to weekly visibility, so Julie Boucher can see mix shifts before month end.",
];
