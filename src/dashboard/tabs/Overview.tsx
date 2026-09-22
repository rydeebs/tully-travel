import { useEffect, useState } from "react";
import { Eyebrow, TextLink } from "../../components";
import { Feed } from "../Feed";
import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { LineChart } from "../charts";
import {
  overviewBookedRevenueSpark,
  overviewBookingLabels,
  overviewBookingSeries,
  overviewBusinessColumns,
  overviewCommissionsSpark,
  overviewFeedInitial,
  overviewFeedPool,
  overviewHoursSavedSpark,
  overviewHumanItems,
  overviewMarginSpark,
  overviewPipelineSpark,
  overviewSystemMetrics,
  type OverviewFeedItem,
  type OverviewSystemMetric,
} from "../data/overview";
import { money, pct } from "../format";
import type { TabId } from "../tabs";
import { jitter, useLiveTicker } from "../useLiveTicker";

const BOOKED_REVENUE_THIS_WEEK = 1_840_000;
const AGENT_HOURS_SAVED = 146;

const systemMetricColumns: Array<TableColumn<OverviewSystemMetric>> = [
  {
    header: "System",
    key: "system",
    render: (row) => (
      <div className="app-dash-ov-system-cell">
        <span className="app-dash-ov-system-cell__name">{row.system}</span>
        <span className="app-dash-ov-system-cell__description">{row.description}</span>
      </div>
    ),
    width: "24%",
  },
  { header: "Owner", key: "owner", width: "14%" },
  { header: "Metric", key: "metric", width: "18%" },
  { header: "Before", key: "before", width: "11%" },
  { header: "Now", key: "now", width: "13%" },
  { header: "Change", key: "change", width: "10%" },
  {
    header: "Status",
    key: "status",
    render: (row) => (
      <StatusTag tone={row.status === "Target met" ? "gold" : "muted"}>{row.status}</StatusTag>
    ),
    width: "10%",
  },
];

export function OverviewTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const tick = useLiveTicker(6000);
  const [feedItems, setFeedItems] = useState<OverviewFeedItem[]>(overviewFeedInitial);

  const bookedRevenue =
    tick === 0 ? BOOKED_REVENUE_THIS_WEEK : jitter(BOOKED_REVENUE_THIS_WEEK, tick, 11, 0.006);
  const hoursSaved = tick === 0 ? AGENT_HOURS_SAVED : jitter(AGENT_HOURS_SAVED, tick, 23, 0.015);

  useEffect(() => {
    if (tick === 0) {
      return;
    }

    const template = overviewFeedPool[(tick - 1) % overviewFeedPool.length];
    setFeedItems((current) =>
      [
        {
          ...template,
          id: `${template.id}-${tick}`,
        },
        ...current,
      ].slice(0, 12),
    );
  }, [tick]);

  return (
    <main className="app-dash-page app-dash-ov-page app-fade">
      <PageHeader
        asOf="Updated just now"
        eyebrow="Week 38 - 21 September 2026"
        lead="One read across Sales, Operations and Finance. Every number here is a live feed from the systems behind it."
        title="This week at Tully"
      />

      <section aria-label="Week 38 key measures" className="app-dash-ov-kpis">
        <KpiRow>
          <Kpi
            delta={{ direction: "up", text: "$210K vs last week" }}
            label="Booked revenue this week"
            spark={overviewBookedRevenueSpark}
            value={money(bookedRevenue, { compact: true })}
          />
          <Kpi
            delta={{ direction: "up", text: "$780K newly weighted" }}
            label="Weighted pipeline"
            spark={overviewPipelineSpark}
            value="$11.6M"
          />
          <Kpi
            delta={{ direction: "flat", text: "within target band" }}
            label="Gross margin"
            spark={overviewMarginSpark}
            value={pct(0.134)}
          />
          <Kpi
            delta={{ direction: "down", text: "$74K vs last week" }}
            label="Commissions outstanding"
            note="Decrease is good here."
            spark={overviewCommissionsSpark}
            value="$612K"
          />
          <Kpi
            delta={{ direction: "up", text: "18 h vs last week" }}
            label="Agent hours saved this week"
            spark={overviewHoursSavedSpark}
            value={`${Math.round(hoursSaved)} h`}
          />
        </KpiRow>
      </section>

      <Section title="Every system, its metric">
        <p className="app-dash-ov-system-lead">
          Each system earns its place against one number. Before is the manual baseline; now is this week.
        </p>
        <div className="app-dash-ov-system-table">
          <Table columns={systemMetricColumns} keyField="id" rows={overviewSystemMetrics} />
        </div>
      </Section>

      <Section title="Bookings, actual and forecast">
        <LineChart
          format={(value) => money(value, { compact: true })}
          labels={overviewBookingLabels}
          series={overviewBookingSeries}
        />
      </Section>

      <Section title="Sales / Operations / Finance">
        <div className="app-dash-ov-brief-grid">
          {overviewBusinessColumns.map((column) => (
            <article className="app-dash-ov-brief" key={column.eyebrow}>
              <Eyebrow>{column.eyebrow}</Eyebrow>
              <dl className="app-dash-ov-brief__metrics">
                {column.metrics.map((metric) => (
                  <div className="app-dash-ov-brief__metric" key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <TextLink onClick={() => onNavigate(column.tab)}>{column.linkLabel}</TextLink>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Needs a human" tone="bone">
        <ul className="app-dash-ov-human-list">
          {overviewHumanItems.map((item) => (
            <li className="app-dash-ov-human-item" key={item.id}>
              <div className="app-dash-ov-human-item__tag">
                <StatusTag tone={item.tone}>{item.status}</StatusTag>
              </div>
              <p className="app-dash-ov-human-item__description">{item.description}</p>
              <div className="app-dash-ov-human-item__owner">{item.owner}</div>
              <TextLink onClick={() => onNavigate(item.tab)}>Review</TextLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Live activity">
        <Feed items={feedItems} />
      </Section>
    </main>
  );
}
