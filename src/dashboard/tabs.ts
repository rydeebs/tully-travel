export type TabId = "overview" | "proposals" | "agents" | "crm" | "erp" | "finance";

export type DashboardTab = {
  id: TabId;
  label: string;
  eyebrow: string;
  status: string;
};

export const TABS: DashboardTab[] = [
  {
    id: "overview",
    label: "Overview",
    eyebrow: "Command",
    status: "Week 38",
  },
  {
    id: "proposals",
    label: "Proposal Engine",
    eyebrow: "Sales",
    status: "12 drafts this week",
  },
  {
    id: "agents",
    label: "Agentic Operations",
    eyebrow: "Operations",
    status: "5 awaiting approval",
  },
  {
    id: "crm",
    label: "CRM",
    eyebrow: "Integrations",
    status: "HubSpot · synced",
  },
  {
    id: "erp",
    label: "ERP · Back Office",
    eyebrow: "Operations",
    status: "ClientBase · Trams · Travefy",
  },
  {
    id: "finance",
    label: "Finance",
    eyebrow: "Finance",
    status: "Close day 4 of 6",
  },
];

export function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}
