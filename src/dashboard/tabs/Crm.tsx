import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "../../components";
import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { ColumnChart, Funnel, Meter } from "../charts";
import {
  crmDesignerLeaderboard,
  crmEngagementFunnelStages,
  crmEngagementKpis,
  crmEngagementSignalPool,
  crmEngagementSignals,
  crmInboundLeads,
  crmPipelineStages,
  crmQ4ForecastKpis,
  crmQ4ForecastMoves,
  crmQ4ForecastRows,
  crmQuietDeals,
  crmRepeatBookingValues,
  crmRepeatBookingYears,
  crmRepeatMetrics,
  type CrmDesignerRow,
  type CrmEngagementSignal,
  type CrmForecastRow,
  type CrmLead,
  type ScoreTier,
} from "../data/crm";
import { money, num, pct } from "../format";
import { useLiveTicker } from "../useLiveTicker";

type ForecastMetricKey = "bookedToDate" | "commit" | "bestCase" | "target";

const forecastMetrics: Array<{ key: ForecastMetricKey; label: string }> = [
  { key: "bookedToDate", label: "Booked" },
  { key: "commit", label: "Commit" },
  { key: "bestCase", label: "Best case" },
  { key: "target", label: "Target" },
];

function toneForTier(tier: ScoreTier) {
  if (tier === "Hot") {
    return "gold";
  }

  if (tier === "Warm") {
    return "ink";
  }

  return "muted";
}

function toneForSignal(status: CrmEngagementSignal["status"]) {
  return status === "Triggers follow-up" ? "gold" : "muted";
}

function forecastMoney(value: number) {
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

function forecastShare(value: number, scale: number) {
  const bounded = Math.min(Math.max(value / scale, 0), 1);
  return `${bounded * 100}%`;
}

// Months share one scale so their bars compare; the quarter total gets its own.
function forecastScale(row: CrmForecastRow) {
  const rows = crmQ4ForecastRows.filter((item) => Boolean(item.total) === Boolean(row.total));
  return Math.max(...rows.flatMap((item) => [item.bestCase, item.target]));
}

function ForecastBulletRow({ row }: { row: CrmForecastRow }) {
  const scale = forecastScale(row);

  return (
    <li className={row.total ? "app-dash-crm-bullet-row app-dash-crm-bullet-row--total" : "app-dash-crm-bullet-row"}>
      <div className="app-dash-crm-bullet-row__label">{row.label}</div>
      <div
        aria-label={`${row.label}: booked to date ${forecastMoney(row.bookedToDate)}, commit ${forecastMoney(
          row.commit,
        )}, best case ${forecastMoney(row.bestCase)}, target ${forecastMoney(row.target)}`}
        className="app-dash-crm-bullet"
        role="img"
      >
        <span className="app-dash-crm-bullet__track" style={{ width: forecastShare(row.bestCase, scale) }} />
        <span className="app-dash-crm-bullet__commit" style={{ width: forecastShare(row.commit, scale) }} />
        <span
          className="app-dash-crm-bullet__booked"
          style={{ width: forecastShare(row.bookedToDate, scale) }}
        />
        <span className="app-dash-crm-bullet__target" style={{ left: forecastShare(row.target, scale) }} />
      </div>
      <dl className="app-dash-crm-bullet-values">
        {forecastMetrics.map((metric) => (
          <div className="app-dash-crm-bullet-values__item" key={metric.key}>
            <dt>{metric.label}</dt>
            <dd>{forecastMoney(row[metric.key])}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
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

const engagementColumns: Array<TableColumn<CrmEngagementSignal>> = [
  { header: "Time", key: "time", width: "8%" },
  { header: "Client", key: "client", width: "16%" },
  { header: "Signal", key: "signal", width: "28%" },
  { header: "Source", key: "source", width: "16%" },
  {
    header: "HubSpot property written",
    key: "hubspotProperty",
    render: (row) => <code className="app-dash-crm-property">{row.hubspotProperty}</code>,
    width: "20%",
  },
  {
    header: "Status",
    key: "status",
    render: (row) => <StatusTag tone={toneForSignal(row.status)}>{row.status}</StatusTag>,
    width: "12%",
  },
];

export function CrmTab() {
  const engagementTick = useLiveTicker(12000);
  const lastSignalTick = useRef(0);
  const [recentSignals, setRecentSignals] = useState(() => crmEngagementSignals);
  const sortedLeads = [...crmInboundLeads].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (engagementTick === 0 || engagementTick % 2 === 1 || lastSignalTick.current === engagementTick) {
      return;
    }

    lastSignalTick.current = engagementTick;
    const poolIndex = (engagementTick / 2 - 1) % crmEngagementSignalPool.length;
    const nextSignal = crmEngagementSignalPool[poolIndex];

    setRecentSignals((current) => [
      { ...nextSignal, id: `${nextSignal.id}-${engagementTick}` },
      ...current,
    ].slice(0, 7));
  }, [engagementTick]);

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

      <Section aside={<Eyebrow tone="muted">Weekly forecast layer</Eyebrow>} title="Pipeline forecast, Q4 2026">
        <div className="app-dash-crm-forecast">
          <KpiRow>
            {crmQ4ForecastKpis.map((kpi) => (
              <Kpi key={kpi.label} label={kpi.label} note={kpi.note} value={kpi.value} />
            ))}
          </KpiRow>

          <div className="app-dash-crm-forecast-grid">
            <div className="app-dash-crm-panel app-dash-crm-forecast-panel">
              <div className="app-dash-crm-bullet-legend" aria-label="Forecast legend">
                <span className="app-dash-crm-bullet-legend__item">
                  <span className="app-dash-crm-bullet-legend__key app-dash-crm-bullet-legend__key--booked" />
                  Booked
                </span>
                <span className="app-dash-crm-bullet-legend__item">
                  <span className="app-dash-crm-bullet-legend__key app-dash-crm-bullet-legend__key--commit" />
                  Commit
                </span>
                <span className="app-dash-crm-bullet-legend__item">
                  <span className="app-dash-crm-bullet-legend__key app-dash-crm-bullet-legend__key--best" />
                  Best case
                </span>
                <span className="app-dash-crm-bullet-legend__item">
                  <span className="app-dash-crm-bullet-legend__key app-dash-crm-bullet-legend__key--target" />
                  Target
                </span>
              </div>

              <ol className="app-dash-crm-bullet-list">
                {crmQ4ForecastRows.map((row) => (
                  <ForecastBulletRow key={row.id} row={row} />
                ))}
              </ol>
            </div>

            <div className="app-dash-crm-panel">
              <h3 className="app-dash-crm-panel__title">What moved this week</h3>
              <ul className="app-dash-crm-move-list">
                {crmQ4ForecastMoves.map((move) => (
                  <li className="app-dash-crm-move-list__item" key={move}>
                    {move}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="app-dash-crm-section-caption">
            Rebuilt every Monday 06:00 from HubSpot stages, deposit history in Trams and designer-level win rates.
          </p>
        </div>
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

      <Section title="Client engagement, written back to HubSpot">
        <div className="app-dash-crm-engagement">
          <KpiRow>
            {crmEngagementKpis.map((kpi) => (
              <Kpi key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </KpiRow>

          <div className="app-dash-crm-engagement-grid">
            <div className="app-dash-crm-panel">
              <h3 className="app-dash-crm-panel__title">Client lifecycle</h3>
              <Funnel labelWidth={230} stages={crmEngagementFunnelStages} />
            </div>

            <div className="app-dash-crm-panel app-dash-crm-signals-panel">
              <h3 className="app-dash-crm-panel__title">Recent signals</h3>
              <Table columns={engagementColumns} dense keyField="id" rows={recentSignals} />
            </div>
          </div>

          <p className="app-dash-crm-section-caption">
            Every signal lands on the HubSpot contact within a minute, so designers see who is leaning in and the
            Lead Enricher scores repeat clients on real behaviour.
          </p>
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
