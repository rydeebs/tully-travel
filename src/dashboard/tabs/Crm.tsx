import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { ColumnChart, Funnel, Meter } from "../charts";
import {
  crmDesignerLeaderboard,
  crmInboundLeads,
  crmPipelineStages,
  crmQuietDeals,
  crmRepeatBookingValues,
  crmRepeatBookingYears,
  crmRepeatMetrics,
  type CrmDesignerRow,
  type CrmLead,
  type ScoreTier,
} from "../data/crm";
import { money, num, pct } from "../format";

function toneForTier(tier: ScoreTier) {
  if (tier === "Hot") {
    return "gold";
  }

  if (tier === "Warm") {
    return "ink";
  }

  return "muted";
}

const leadColumns: Array<TableColumn<CrmLead>> = [
  { header: "Client", key: "client", width: "16%" },
  { header: "Source", key: "source", width: "14%" },
  { header: "Interest", key: "interest", width: "14%" },
  { header: "Party size/travel window", key: "partyWindow", width: "18%" },
  {
    align: "right",
    header: "Estimated value",
    key: "estimatedValue",
    render: (row) => money(row.estimatedValue, { compact: true }),
    width: "11%",
  },
  { header: "Wealth signal", key: "wealthSignal", width: "10%" },
  {
    header: "Score",
    key: "score",
    render: (row) => (
      <div className="app-dash-crm-score">
        <span>{row.score}</span>
        <Meter value={row.score / 100} />
      </div>
    ),
    width: "10%",
  },
  { header: "Assigned designer", key: "assignedDesigner", width: "12%" },
  {
    header: "Tier",
    key: "tier",
    render: (row) => <StatusTag tone={toneForTier(row.tier)}>{row.tier}</StatusTag>,
    width: "9%",
  },
];

const designerColumns: Array<TableColumn<CrmDesignerRow>> = [
  { header: "Designer", key: "designer" },
  {
    align: "right",
    header: "Bookings QTD",
    key: "bookingsQtd",
    render: (row) => num(row.bookingsQtd),
  },
  {
    align: "right",
    header: "Revenue QTD",
    key: "revenueQtd",
    render: (row) => money(row.revenueQtd, { compact: true }),
  },
  { align: "right", header: "Avg response", key: "avgResponse" },
  {
    align: "right",
    header: "Conversion",
    key: "conversion",
    render: (row) => pct(row.conversion, 0),
  },
];

export function CrmTab() {
  const sortedLeads = [...crmInboundLeads].sort((a, b) => b.score - a.score);

  return (
    <main className="app-dash-page app-dash-crm-page app-fade">
      <PageHeader
        asOf="Synced 2 min ago"
        eyebrow="Sales - HubSpot"
        lead="Pipeline health, lead scoring and repeat-client signals are pulled into one calm view for the team."
        title="Pipeline and clients"
      />

      <section aria-label="Sales key measures" className="app-dash-crm-kpis">
        <KpiRow>
          <Kpi delta={{ direction: "up", text: "6 vs last week" }} label="New inquiries (wk)" value="38" />
          <Kpi delta={{ direction: "up", text: "55% of new inquiries" }} label="Qualified" value="21" />
          <Kpi
            delta={{ direction: "up", text: "4 pts vs last quarter" }}
            label="Proposal to deposit conversion"
            value="41%"
          />
          <Kpi delta={{ direction: "down", text: "0.7 h faster" }} label="Median first response" value="2.4 h" />
          <Kpi label="Repeat-client share" note="Twelve-month gross bookings mix." value="64%" />
        </KpiRow>
      </section>

      <Section title="Pipeline by stage">
        <Funnel stages={crmPipelineStages} />
      </Section>

      <Section title="Inbound leads, enriched and scored">
        <Table columns={leadColumns} keyField="id" rows={sortedLeads} />
        <p className="app-dash-crm-leads-note">
          Scores blend source, budget signal, fit with Collections and past-client graph. Enriched
          automatically by the Lead Enricher agent.
        </p>
      </Section>

      <Section title="Repeat and designer performance">
        <div className="app-dash-crm-two-column">
          <div className="app-dash-crm-panel">
            <h3 className="app-dash-crm-panel__title">Repeat and retention</h3>
            <div className="app-dash-crm-meter-list">
              {crmRepeatMetrics.map((metric) => (
                <Meter
                  caption={metric.caption}
                  key={metric.label}
                  label={metric.label}
                  target={metric.target}
                  value={metric.value}
                />
              ))}
            </div>
            <div className="app-dash-crm-repeat-chart">
              <ColumnChart
                format={(value) => num(value)}
                highlightIndex={crmRepeatBookingValues.length - 1}
                labels={crmRepeatBookingYears}
                values={crmRepeatBookingValues}
              />
            </div>
          </div>

          <div className="app-dash-crm-panel">
            <h3 className="app-dash-crm-panel__title">Designer leaderboard</h3>
            <Table columns={designerColumns} dense keyField="id" rows={crmDesignerLeaderboard} />
          </div>
        </div>
      </Section>

      <Section title="Going quiet" tone="bone">
        <ul className="app-dash-crm-quiet-list">
          {crmQuietDeals.map((deal) => (
            <li className="app-dash-crm-quiet-item" key={deal.id}>
              <div className="app-dash-crm-quiet-item__client">
                <span>{deal.client}</span>
                <small>{deal.stage}</small>
              </div>
              <div className="app-dash-crm-quiet-item__value">{money(deal.value, { compact: true })}</div>
              <div className="app-dash-crm-quiet-item__meta">
                {deal.daysQuiet} days quiet / {deal.designer}
              </div>
              <p className="app-dash-crm-quiet-item__next">{deal.nextStep}</p>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
