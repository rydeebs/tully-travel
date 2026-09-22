import { BarChart, Meter } from "../charts";
import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { money, num, pct } from "../format";
import { useLiveTicker } from "../useLiveTicker";
import {
  bookingStatusItems,
  dataBackboneConsumers,
  dataBackboneModels,
  dataBackboneSources,
  dataBackboneStats,
  supplierReliability,
  systemConnections,
  upcomingDepartures,
  type DataBackboneSource,
  type Departure,
  type DepartureStatus,
  type SupplierReliability,
} from "../data/erp";

function departureStatusTone(status: DepartureStatus) {
  return status === "Ready" ? "ink" : "gold";
}

function backboneFreshnessLabel(source: DataBackboneSource, tick: number) {
  if (source.freshness.kind === "synced") {
    return `synced ${source.freshness.baseSeconds + tick}s ago`;
  }

  return source.freshness.label;
}

function backboneFreshnessTone(source: DataBackboneSource) {
  return source.freshness.kind === "fixed" && source.freshness.label === "streaming"
    ? "gold"
    : "muted";
}

function ReliabilityScore({ score, highlighted = false }: { highlighted?: boolean; score: number }) {
  return (
    <div className="app-dash-erp-score">
      <div className="app-dash-erp-score__track" aria-hidden="true">
        <span
          className={highlighted ? "app-dash-erp-score__fill app-dash-erp-score__fill--leader" : "app-dash-erp-score__fill"}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="app-dash-erp-score__value">{score}</span>
    </div>
  );
}

const departureColumns: Array<TableColumn<Departure>> = [
  { header: "Departs", key: "departs", width: "88px" },
  { header: "Client", key: "client" },
  { header: "Journey", key: "journey" },
  { header: "Collection", key: "collection" },
  { header: "Designer", key: "designer" },
  {
    align: "right",
    header: "Value",
    key: "value",
    render: (row) => money(row.value),
    width: "104px",
  },
  {
    header: "Readiness",
    key: "readiness",
    render: (row) => (
      <div className="app-dash-erp-readiness">
        <Meter caption={`${row.readiness}%`} value={row.readiness / 100} />
      </div>
    ),
    width: "132px",
  },
  {
    header: "Status",
    key: "status",
    render: (row) => <StatusTag tone={departureStatusTone(row.status)}>{row.status}</StatusTag>,
    width: "148px",
  },
];

const supplierColumns: Array<TableColumn<SupplierReliability>> = [
  {
    header: "Supplier",
    key: "supplier",
    render: (row) => (
      <div className="app-dash-erp-supplier-name">
        <span>{row.supplier}</span>
        {row.isLeader ? <StatusTag tone="gold">Top score</StatusTag> : null}
      </div>
    ),
  },
  {
    align: "right",
    header: "Bookings YTD",
    key: "bookingsYtd",
    render: (row) => num(row.bookingsYtd),
  },
  {
    align: "right",
    header: "Confirmation speed",
    key: "confirmationDays",
    render: (row) => `${row.confirmationDays.toFixed(1)} days`,
  },
  {
    align: "right",
    header: "Commission paid on time",
    key: "commissionPaidOnTime",
    render: (row) => pct(row.commissionPaidOnTime, 0),
  },
  {
    align: "right",
    header: "Issues per 100",
    key: "issuesPer100",
    render: (row) => row.issuesPer100.toFixed(1),
  },
  {
    header: "Reliability score",
    key: "score",
    render: (row) => <ReliabilityScore highlighted={row.isLeader} score={row.score} />,
    width: "164px",
  },
];

export function ErpTab() {
  const tick = useLiveTicker(1000);
  const backboneRecordsSyncedToday =
    dataBackboneStats.recordsSyncedToday + tick * dataBackboneStats.recordsPerTick;

  return (
    <main className="app-dash-page app-fade">
      <PageHeader
        asOf="Synced 40s ago"
        eyebrow="Operations · ClientBase · Trams · Travefy"
        lead="Bookings in flight, near-term departures and supplier reliability are held in one operating view, so the leadership team can see where the back office needs attention before the client feels it."
        title="The back office, in one place"
      />

      <Section eyebrow="Systems and data" title="The data backbone">
        <p className="app-dash-backbone__lead">
          Every source lands in one warehouse, is modelled once, and feeds every view in this dashboard.
        </p>

        <div className="app-dash-backbone__diagram" aria-label="Tully data backbone">
          <div className="app-dash-backbone__column app-dash-backbone__column--sources">
            <h3 className="app-dash-backbone__column-title">Sources</h3>
            <ul className="app-dash-backbone__source-list">
              {dataBackboneSources.map((source) => (
                <li className="app-dash-backbone__source" key={source.id}>
                  <div className="app-dash-backbone__source-heading">
                    <span className="app-dash-backbone__source-name">{source.name}</span>
                    <StatusTag tone={backboneFreshnessTone(source)}>
                      {backboneFreshnessLabel(source, tick)}
                    </StatusTag>
                  </div>
                  <p className="app-dash-backbone__source-role">{source.contribution}</p>
                </li>
              ))}
            </ul>
          </div>

          <span className="app-dash-backbone__connector" aria-hidden="true" />

          <div className="app-dash-backbone__warehouse">
            <div className="app-dash-backbone__warehouse-heading">
              <h3 className="app-dash-backbone__warehouse-title">Tully warehouse</h3>
              <p className="app-dash-backbone__warehouse-subtitle">Postgres · modelled with dbt</p>
            </div>
            <ul className="app-dash-backbone__model-list">
              {dataBackboneModels.map((model) => (
                <li className="app-dash-backbone__model" key={model.id}>
                  <span>{model.name}</span>
                  <span>{num(model.rowCount)} rows</span>
                </li>
              ))}
            </ul>
            <p className="app-dash-backbone__warehouse-run">
              Last full model run 06:00 · incremental every 15 min
            </p>
          </div>

          <span className="app-dash-backbone__connector" aria-hidden="true" />

          <div className="app-dash-backbone__column app-dash-backbone__column--consumers">
            <h3 className="app-dash-backbone__column-title">Consumers</h3>
            <ul className="app-dash-backbone__consumer-list">
              {dataBackboneConsumers.map((consumer) => (
                <li className="app-dash-backbone__consumer" key={consumer.id}>
                  {consumer.name}
                </li>
              ))}
            </ul>
            <p className="app-dash-backbone__consumer-note">
              Agents read and write through the same models
            </p>
          </div>
        </div>

        <div className="app-dash-backbone__stats" aria-label="Backbone health">
          <KpiRow>
            <Kpi label="Sources connected" value={num(dataBackboneStats.sourcesConnected)} />
            <Kpi label="Records synced today" value={num(backboneRecordsSyncedToday)} />
            <Kpi label="Data latency" value={dataBackboneStats.dataLatency} />
            <Kpi label="Failed syncs (24h)" value={num(dataBackboneStats.failedSyncs24h)} />
          </KpiRow>
        </div>
      </Section>

      <Section title="Connected systems">
        <div className="app-dash-erp-system-grid">
          {systemConnections.map((system) => {
            const syncedToday = system.recordsSyncedToday + tick * system.recordsPerTick;
            const syncAge = system.baseSyncSeconds + tick;

            return (
              <article className="app-dash-erp-system" key={system.id}>
                <div className="app-dash-erp-system__heading">
                  <h3 className="app-dash-erp-system__name">{system.name}</h3>
                  <StatusTag tone={system.statusTone}>{system.status}</StatusTag>
                </div>
                <p className="app-dash-erp-system__role">{system.role}</p>
                <dl className="app-dash-erp-system__metrics">
                  <div>
                    <dt>Last sync</dt>
                    <dd>{syncAge}s ago</dd>
                  </div>
                  <div>
                    <dt>Records today</dt>
                    <dd>{num(syncedToday)}</dd>
                  </div>
                  <div>
                    <dt>Errors</dt>
                    <dd>{system.errors}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <KpiRow>
          <Kpi label="Bookings in flight" value="412" />
          <Kpi label="Departing next 30 days" value="57" />
          <Kpi label="Confirmations pending" value="18" />
          <Kpi label="Documents outstanding" value="23" />
          <Kpi label="Avg supplier confirmation" note="days" value="1.6" />
        </KpiRow>
      </Section>

      <Section title="Bookings in flight by status">
        <BarChart format={num} items={bookingStatusItems} />
      </Section>

      <Section title="Departures, next 30 days">
        <Table columns={departureColumns} keyField="id" rows={upcomingDepartures} />
      </Section>

      <Section title="Supplier reliability scorecard" tone="bone">
        <Table columns={supplierColumns} dense keyField="id" rows={supplierReliability} />
        <p className="app-dash-erp-caption">
          Scored weekly from Trams payment history, extranet response times and designer-reported issues.
        </p>
      </Section>
    </main>
  );
}
