import type { TabId } from "../tabs";

export type OverviewBookingSeries = {
  dashed?: boolean;
  name: string;
  tone: "ink" | "gold";
  values: Array<number | null>;
};

export type OverviewMetric = {
  label: string;
  value: string;
};

export type OverviewBusinessColumn = {
  eyebrow: "Sales" | "Operations" | "Finance";
  linkLabel: string;
  metrics: OverviewMetric[];
  tab: TabId;
};

export type OverviewHumanItem = {
  description: string;
  id: string;
  owner: string;
  status: string;
  tab: TabId;
  tone: "ink" | "gold" | "muted";
};

export type OverviewFeedItem = {
  id: string;
  source: string;
  text: string;
  time: string;
};

export type OverviewSystemMetric = {
  [key: string]: unknown;
  before: string;
  change: string;
  description: string;
  id: string;
  metric: string;
  now: string;
  owner: "Sales" | "Operations" | "Finance" | "Client experience";
  status: "Target met" | "On track";
  system: string;
};

export const overviewBookedRevenueSpark = [
  1_280_000, 1_340_000, 1_290_000, 1_410_000, 1_520_000, 1_480_000, 1_630_000, 1_710_000,
  1_690_000, 1_780_000, 1_820_000, 1_840_000,
];

export const overviewPipelineSpark = [
  9_800_000, 10_100_000, 9_900_000, 10_600_000, 10_900_000, 11_100_000, 10_800_000,
  11_300_000, 11_500_000, 11_200_000, 11_400_000, 11_600_000,
];

export const overviewMarginSpark = [
  0.127, 0.129, 0.128, 0.131, 0.132, 0.13, 0.133, 0.134, 0.132, 0.135, 0.134, 0.134,
];

export const overviewCommissionsSpark = [
  742_000, 728_000, 701_000, 688_000, 664_000, 671_000, 648_000, 633_000, 641_000, 626_000,
  618_000, 612_000,
];

export const overviewHoursSavedSpark = [86, 94, 101, 108, 112, 119, 123, 128, 137, 141, 144, 146];

export const overviewBookingLabels = [
  "W30",
  "W31",
  "W32",
  "W33",
  "W34",
  "W35",
  "W36",
  "W37",
  "W38",
  "W39",
  "W40",
  "W41",
  "W42",
];

export const overviewBookingSeries: OverviewBookingSeries[] = [
  {
    name: "This year actual",
    tone: "ink",
    values: [
      1_320_000,
      1_470_000,
      1_390_000,
      1_560_000,
      1_640_000,
      1_510_000,
      1_720_000,
      1_780_000,
      1_840_000,
      null,
      null,
      null,
      null,
    ],
  },
  {
    dashed: true,
    name: "Forecast",
    tone: "gold",
    values: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1_840_000,
      1_960_000,
      2_080_000,
      2_140_000,
      2_220_000,
    ],
  },
];

export const overviewSystemMetrics: OverviewSystemMetric[] = [
  {
    id: "proposal-engine",
    system: "Proposal Engine",
    description: "Turns qualified briefs into editable first-draft itinerary copy.",
    owner: "Sales",
    metric: "Brief to first draft",
    before: "3.5 days",
    now: "38 s",
    change: "≈8,000× faster",
    status: "Target met",
  },
  {
    id: "lead-enricher-scorer",
    system: "Lead Enricher & Scorer",
    description: "Adds source context, trip fit, and priority scoring for inbound leads.",
    owner: "Sales",
    metric: "Median first response",
    before: "9.5 h",
    now: "2.4 h",
    change: "-75%",
    status: "Target met",
  },
  {
    id: "invoice-reconciler",
    system: "Invoice Reconciler",
    description: "Matches supplier commission statements to Trams and drafts disputes.",
    owner: "Finance",
    metric: "Statement reconciliation",
    before: "6 days",
    now: "4 min",
    change: "≈2,000× faster",
    status: "Target met",
  },
  {
    id: "pipeline-forecast",
    system: "Pipeline forecast layer",
    description: "Weights open opportunities by stage, designer history, and source quality.",
    owner: "Sales",
    metric: "Forecast accuracy",
    before: "±22%",
    now: "±6%",
    change: "-16 pts",
    status: "Target met",
  },
  {
    id: "supplier-reliability",
    system: "Supplier reliability scoring",
    description: "Ranks preferred partners from confirmation speed, payment history, and issues.",
    owner: "Operations",
    metric: "Confirmation speed",
    before: "3.1 days",
    now: "1.6 days",
    change: "-48%",
    status: "On track",
  },
  {
    id: "month-end-close",
    system: "Month-end close",
    description: "Matches statements, accruals, and bank feeds before close review.",
    owner: "Finance",
    metric: "Close cycle",
    before: "11 days",
    now: "6 days",
    change: "-45%",
    status: "Target met",
  },
  {
    id: "warehouse-margin",
    system: "Data warehouse & margin dashboards",
    description: "Models bookings, commissions, and collection margin once for leadership.",
    owner: "Finance",
    metric: "Margin visibility",
    before: "Monthly",
    now: "Weekly",
    change: "4x cadence",
    status: "Target met",
  },
  {
    id: "engagement-writeback",
    system: "Client engagement write-back",
    description: "Writes proposal, email, and trip signals back to the client record.",
    owner: "Client experience",
    metric: "Signals captured in CRM",
    before: "0%",
    now: "92% of active clients",
    change: "+92 pts",
    status: "On track",
  },
];

export const overviewBusinessColumns: OverviewBusinessColumn[] = [
  {
    eyebrow: "Sales",
    linkLabel: "Open the CRM",
    metrics: [
      { label: "New inquiries", value: "38" },
      { label: "Qualified this week", value: "21" },
      { label: "Proposal value sent", value: "$4.9M" },
    ],
    tab: "crm",
  },
  {
    eyebrow: "Operations",
    linkLabel: "Open Agentic Operations",
    metrics: [
      { label: "Departures this week", value: "27" },
      { label: "Documents complete", value: "94%" },
      { label: "Agent hours saved", value: "146 h" },
    ],
    tab: "agents",
  },
  {
    eyebrow: "Finance",
    linkLabel: "Open Finance",
    metrics: [
      { label: "Receipts posted today", value: "$239K" },
      { label: "Gross margin", value: "13.4%" },
      { label: "Close progress", value: "Day 4 of 6" },
    ],
    tab: "finance",
  },
];

export const overviewHumanItems: OverviewHumanItem[] = [
  {
    description: "Singita buyout revision needs Mary Jean's sign-off before the client call.",
    id: "human-approval-singita",
    owner: "Mary Jean Tully",
    status: "Approval",
    tab: "agents",
    tone: "gold",
  },
  {
    description: "The Harcourt family has not been touched since the Amalfi villa shortlist.",
    id: "human-stale-harcourt",
    owner: "Amelia R.",
    status: "Stale lead",
    tab: "crm",
    tone: "muted",
  },
  {
    description: "Crystal invoice 4281 is $18K above the deposit schedule.",
    id: "human-dispute-crystal",
    owner: "Julie Boucher",
    status: "Dispute",
    tab: "finance",
    tone: "ink",
  },
  {
    description: "M. Okafor departs for Kyoto in 72 h with rail transfers still unconfirmed.",
    id: "human-departure-okafor",
    owner: "Kelly Sousa",
    status: "Departure",
    tab: "agents",
    tone: "gold",
  },
  {
    description: "Aman Tokyo suite extension moved the trip below the 12% margin floor.",
    id: "human-margin-aman",
    owner: "Ralph Crawford",
    status: "Margin watch",
    tab: "finance",
    tone: "muted",
  },
];

export const overviewFeedInitial: OverviewFeedItem[] = [
  {
    id: "feed-initial-1",
    source: "Invoice Reconciler",
    text: "Matched $84K in Crystal commission receipts to September departures.",
    time: "2 min",
  },
  {
    id: "feed-initial-2",
    source: "HubSpot",
    text: "Scored The Harcourt family at 96 after a referral from a Noble Estates client.",
    time: "5 min",
  },
  {
    id: "feed-initial-3",
    source: "Proposal Engine",
    text: "Drafted a Peak & Panorama itinerary for C. Vale with Belmond rail options.",
    time: "9 min",
  },
  {
    id: "feed-initial-4",
    source: "ClientBase",
    text: "Updated passport expiries for four Eastern Soul departures in October.",
    time: "13 min",
  },
  {
    id: "feed-initial-5",
    source: "Trams",
    text: "Posted $239K in receipts across 11 deposited journeys.",
    time: "18 min",
  },
  {
    id: "feed-initial-6",
    source: "Proposal Engine",
    text: "Flagged an Epicurean Worlds trip where margin moved under target after air changes.",
    time: "24 min",
  },
  {
    id: "feed-initial-7",
    source: "HubSpot",
    text: "Advanced M. Okafor from Discovery call to Proposal sent.",
    time: "31 min",
  },
  {
    id: "feed-initial-8",
    source: "ClientBase",
    text: "Confirmed Wilderness Safaris supplier notes for two Wild & Untamed files.",
    time: "38 min",
  },
];

export const overviewFeedPool: OverviewFeedItem[] = [
  {
    id: "feed-pool-1",
    source: "Invoice Reconciler",
    text: "Cleared a $42K Belmond variance against the final supplier statement.",
    time: "now",
  },
  {
    id: "feed-pool-2",
    source: "HubSpot",
    text: "Raised lead score for L. Morandi after a Forbes Travel Guide referral marker appeared.",
    time: "now",
  },
  {
    id: "feed-pool-3",
    source: "ClientBase",
    text: "Added anniversary preferences to The Bellamy family profile.",
    time: "now",
  },
  {
    id: "feed-pool-4",
    source: "Proposal Engine",
    text: "Prepared an Aman and Four Seasons comparison for a Grand Tour request.",
    time: "now",
  },
  {
    id: "feed-pool-5",
    source: "Trams",
    text: "Imported Silversea commission detail for three Cruise & Coastline bookings.",
    time: "now",
  },
  {
    id: "feed-pool-6",
    source: "HubSpot",
    text: "Assigned a Partner - Singita inquiry to Clara V. based on past conversion.",
    time: "now",
  },
  {
    id: "feed-pool-7",
    source: "Invoice Reconciler",
    text: "Queued Julie Boucher review for a $18K supplier mismatch.",
    time: "now",
  },
  {
    id: "feed-pool-8",
    source: "Proposal Engine",
    text: "Finished a Noble Estates villa deck for The Watanabe family.",
    time: "now",
  },
  {
    id: "feed-pool-9",
    source: "ClientBase",
    text: "Synced dietary notes for an Epicurean Worlds departure in Lyon.",
    time: "now",
  },
  {
    id: "feed-pool-10",
    source: "Trams",
    text: "Marked $126K in cruise deposits as cleared funds.",
    time: "now",
  },
  {
    id: "feed-pool-11",
    source: "HubSpot",
    text: "Moved H. Laurent to Proposal sent after the Vintage & Vineyard call.",
    time: "now",
  },
  {
    id: "feed-pool-12",
    source: "Proposal Engine",
    text: "Flagged a rail transfer gap on an Eastern Soul journey for Kelly Sousa.",
    time: "now",
  },
  {
    id: "feed-pool-13",
    source: "ClientBase",
    text: "Merged duplicate household records for The Laurent family.",
    time: "now",
  },
  {
    id: "feed-pool-14",
    source: "Invoice Reconciler",
    text: "Reopened an Explora Journeys receipt because the agency commission changed.",
    time: "now",
  },
  {
    id: "feed-pool-15",
    source: "Trams",
    text: "Closed out eight September files with complete advisor fee lines.",
    time: "now",
  },
];
