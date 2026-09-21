import { BarChart, ColumnChart, LineChart, Meter } from "../charts";
import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { money, pct } from "../format";
import {
  cashForecastValues,
  cashPositionValues,
  cashWeekLabels,
  closeChecklist,
  collectionMargins,
  monthChanges,
  overdueSuppliers,
  receivableAgeLabels,
  receivableAgeValues,
  type CloseChecklistItem,
  type CloseStatus,
} from "../data/finance";

function compactMoney(value: number) {
  return money(value, { compact: true });
}

function closeStatusTone(status: CloseStatus) {
  if (status === "Done") {
    return "ink";
  }

  return status === "In progress" ? "gold" : "muted";
}

const closeColumns: Array<TableColumn<CloseChecklistItem>> = [
  { header: "Step", key: "step" },
  {
    header: "Status",
    key: "status",
    render: (row) => <StatusTag tone={closeStatusTone(row.status)}>{row.status}</StatusTag>,
    width: "132px",
  },
  { header: "Owner", key: "owner", width: "132px" },
];

export function FinanceTab() {
  const completedCloseSteps = closeChecklist.filter((item) => item.status === "Done").length;

  return (
    <main className="app-dash-page app-fade">
      <PageHeader
        asOf="As of 8:00 this morning"
        eyebrow="Finance · for the CFO"
        lead="Julie Boucher can see margin, commission receivables and close readiness without waiting for month-end packets, with agent-drafted reconciliation work held for review."
        title="Margin, commissions and the close"
      />

      <Section>
        <KpiRow>
          <Kpi label="Gross bookings MTD" value="$6.9M" />
          <Kpi label="Net revenue MTD" value="$928K" />
          <Kpi label="Gross margin" value="13.4%" />
          <Kpi label="Commission receivable" value="$612K" />
          <Kpi label="Days to close" note="Was 11 before reconciliation automation" spark={[11, 10, 9, 8, 7, 6]} value="6" />
        </KpiRow>
      </Section>

      <Section title="Weekly margin by Collection">
        <BarChart format={pct} items={collectionMargins} max={0.18} />
        <p className="app-dash-fin-caption">
          Weekly gross margin is refreshed from Trams and booking status, giving the CFO a collection-level read before month end.
        </p>
      </Section>

      <Section title="Receivables and close">
        <div className="app-dash-fin-two-column">
          <section className="app-dash-fin-panel" aria-labelledby="finance-receivables-title">
            <h3 className="app-dash-fin-panel__title" id="finance-receivables-title">
              Commission receivable, by age
            </h3>
            <ColumnChart
              format={compactMoney}
              highlightIndex={3}
              labels={receivableAgeLabels}
              values={receivableAgeValues}
            />
            <div className="app-dash-fin-overdue">
              <h4 className="app-dash-fin-overdue__title">Top overdue suppliers</h4>
              <ul className="app-dash-fin-overdue__list">
                {overdueSuppliers.map((supplier) => (
                  <li className="app-dash-fin-overdue__item" key={supplier.id}>
                    <span>{supplier.supplier}</span>
                    <strong>{compactMoney(supplier.amount)}</strong>
                    <span>{supplier.days} days</span>
                  </li>
                ))}
              </ul>
              <p className="app-dash-fin-caption">Invoice Reconciler has drafted disputes for 3 of these.</p>
            </div>
          </section>

          <section className="app-dash-fin-panel" aria-labelledby="finance-close-title">
            <h3 className="app-dash-fin-panel__title" id="finance-close-title">
              Month-end close
            </h3>
            <Table columns={closeColumns} dense keyField="id" rows={closeChecklist} />
            <div className="app-dash-fin-close-progress">
              <Meter
                caption="Close day 4 of 6"
                label={`${completedCloseSteps}/8 complete`}
                target={0.75}
                value={completedCloseSteps / closeChecklist.length}
              />
            </div>
          </section>
        </div>
      </Section>

      <Section title="13-week cash view">
        <LineChart
          format={compactMoney}
          labels={cashWeekLabels}
          series={[
            { name: "Cash position", tone: "ink", values: cashPositionValues },
            { dashed: true, name: "Forecast", tone: "gold", values: cashForecastValues },
          ]}
        />
      </Section>

      <Section title="What changed this month" tone="bone">
        <ul className="app-dash-fin-note-list">
          {monthChanges.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
