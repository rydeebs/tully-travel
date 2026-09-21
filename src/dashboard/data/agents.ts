export type AgentStatus = "Running" | "Idle" | "Paused";

export type AgentFleetItem = {
  name: string;
  domain: string;
  description: string;
  status: AgentStatus;
  runsToday: number;
  autoResolved: number;
  lastRun: string;
  policy: string;
  hoursSavedWeek: number;
};

export type ApprovalInboxItem = {
  id: string;
  agent: string;
  action: string;
  context: string;
  value: string;
};

export type AgentRunLogItem = {
  id: string;
  time: string;
  agent: string;
  outcome: string;
};

export const AGENT_FLEET: AgentFleetItem[] = [
  {
    name: "Invoice Reconciler",
    domain: "Finance",
    description: "Matches supplier commission statements to Trams and drafts disputes.",
    status: "Running",
    runsToday: 179,
    autoResolved: 84,
    lastRun: "4 min ago",
    policy: "Drafts disputes; a person sends",
    hoursSavedWeek: 36,
  },
  {
    name: "Lead Enricher & Scorer",
    domain: "Sales",
    description: "Adds source context, trip fit, and priority scoring for inbound leads.",
    status: "Running",
    runsToday: 86,
    autoResolved: 91,
    lastRun: "7 min ago",
    policy: "Never changes owner without approval",
    hoursSavedWeek: 19,
  },
  {
    name: "Supplier Follow-up",
    domain: "Operations",
    description: "Finds overdue supplier responses and prepares concise follow-up drafts.",
    status: "Running",
    runsToday: 121,
    autoResolved: 82,
    lastRun: "9 min ago",
    policy: "Drafts only for preferred partners",
    hoursSavedWeek: 24,
  },
  {
    name: "Booking Confirmation Checker",
    domain: "Operations",
    description: "Checks confirmations against Trams, ClientBase, and supplier records.",
    status: "Idle",
    runsToday: 97,
    autoResolved: 89,
    lastRun: "12 min ago",
    policy: "Routes mismatches to operations",
    hoursSavedWeek: 18,
  },
  {
    name: "Document Chaser",
    domain: "Operations",
    description: "Tracks missing passports, forms, and supplier documents before deadlines.",
    status: "Running",
    runsToday: 74,
    autoResolved: 78,
    lastRun: "15 min ago",
    policy: "Never contacts clients directly",
    hoursSavedWeek: 17,
  },
  {
    name: "Pre-trip Client Brief",
    domain: "Client experience",
    description: "Assembles internal pre-trip briefs from itinerary and preference data.",
    status: "Paused",
    runsToday: 53,
    autoResolved: 86,
    lastRun: "31 min ago",
    policy: "Designer approves every client note",
    hoursSavedWeek: 14,
  },
  {
    name: "Proposal Drafter",
    domain: "Sales",
    description: "Turns qualified briefs into editable first-draft itinerary copy.",
    status: "Running",
    runsToday: 68,
    autoResolved: 96,
    lastRun: "18 min ago",
    policy: "Designer edits before client view",
    hoursSavedWeek: 18,
  },
];

export const APPROVAL_INBOX: ApprovalInboxItem[] = [
  {
    id: "approval-singita-q3",
    agent: "Invoice Reconciler",
    action: "Queue Singita Q3 dispute draft",
    context: "$5,780 commission variance across two references.",
    value: "Recover revenue without a manual statement review.",
  },
  {
    id: "approval-explora-aug",
    agent: "Invoice Reconciler",
    action: "Ask Explora to confirm a cancelled reference",
    context: "Net $336 variance after one rate mismatch and one extra statement line.",
    value: "Keeps the commission ledger clean before month close.",
  },
  {
    id: "approval-villa-followup",
    agent: "Supplier Follow-up",
    action: "Send follow-up to a villa partner",
    context: "Arrival transfer details are missing for a VIP family trip.",
    value: "Protects the designer from three manual chase steps.",
  },
  {
    id: "approval-brief-review",
    agent: "Pre-trip Client Brief",
    action: "Publish an internal pre-trip brief",
    context: "Dietary notes and room preferences were merged from two systems.",
    value: "Gives the relationship manager one clean brief to review.",
  },
  {
    id: "approval-lead-reassign",
    agent: "Lead Enricher & Scorer",
    action: "Move a high-fit safari lead to senior sales",
    context: "No-limit budget signal, family office email domain, August 2027 timing.",
    value: "Surfaces a priority lead inside the same day.",
  },
];

export const RUN_LOG: AgentRunLogItem[] = [
  {
    id: "run-001",
    time: "4 min ago",
    agent: "Invoice Reconciler",
    outcome: "Matched 42 supplier lines and routed 3 exceptions to finance.",
  },
  {
    id: "run-002",
    time: "7 min ago",
    agent: "Lead Enricher & Scorer",
    outcome: "Scored 18 inbound leads and promoted 4 to senior sales review.",
  },
  {
    id: "run-003",
    time: "9 min ago",
    agent: "Supplier Follow-up",
    outcome: "Prepared 11 partner follow-up drafts for overdue confirmations.",
  },
  {
    id: "run-004",
    time: "12 min ago",
    agent: "Booking Confirmation Checker",
    outcome: "Closed 23 confirmation checks and routed 2 date mismatches.",
  },
  {
    id: "run-005",
    time: "15 min ago",
    agent: "Document Chaser",
    outcome: "Cleared 9 passport reminders and held 2 client-touch items for review.",
  },
  {
    id: "run-006",
    time: "18 min ago",
    agent: "Proposal Drafter",
    outcome: "Drafted 3 first-pass journeys for designer edit.",
  },
  {
    id: "run-007",
    time: "21 min ago",
    agent: "Invoice Reconciler",
    outcome: "Accepted 6 rounding variances under tolerance.",
  },
  {
    id: "run-008",
    time: "25 min ago",
    agent: "Supplier Follow-up",
    outcome: "Found 4 stale requests with no supplier response after 72 hours.",
  },
  {
    id: "run-009",
    time: "29 min ago",
    agent: "Pre-trip Client Brief",
    outcome: "Compiled 5 internal briefs and sent each to its designer queue.",
  },
  {
    id: "run-010",
    time: "34 min ago",
    agent: "Lead Enricher & Scorer",
    outcome: "Merged CRM context for 14 leads without changing ownership.",
  },
  {
    id: "run-011",
    time: "38 min ago",
    agent: "Document Chaser",
    outcome: "Prepared visa document reminders for operations approval.",
  },
  {
    id: "run-012",
    time: "44 min ago",
    agent: "Booking Confirmation Checker",
    outcome: "Verified 31 supplier confirmations against Trams booking references.",
  },
];

export const RUN_LOG_POOL: AgentRunLogItem[] = [
  {
    id: "pool-invoice",
    time: "Now",
    agent: "Invoice Reconciler",
    outcome: "Reconciled a supplier batch and held 1 variance for finance review.",
  },
  {
    id: "pool-confirmation",
    time: "Now",
    agent: "Booking Confirmation Checker",
    outcome: "Verified 8 confirmations and routed 1 room-category mismatch.",
  },
  {
    id: "pool-docs",
    time: "Now",
    agent: "Document Chaser",
    outcome: "Cleared 5 document reminders and paused one client-touch draft.",
  },
  {
    id: "pool-followup",
    time: "Now",
    agent: "Supplier Follow-up",
    outcome: "Prepared 6 supplier follow-up drafts for operations review.",
  },
];
