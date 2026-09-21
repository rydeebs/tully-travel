import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, getHealth, reconcile } from "../../api";
import { Button, Eyebrow } from "../../components";
import { SAMPLE_RESULTS, SAMPLE_STATEMENTS } from "../../shared/reconcileSamples";
import type { ReconcileOutcome, ReconcileResult } from "../../shared/reconcile";
import { Feed } from "../Feed";
import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";
import { PageHeader } from "../PageHeader";
import { Section } from "../Section";
import { StatusTag, Table, type TableColumn } from "../Table";
import { money, num } from "../format";
import { jitter, useLiveTicker } from "../useLiveTicker";
import {
  AGENT_FLEET,
  APPROVAL_INBOX,
  RUN_LOG,
  RUN_LOG_POOL,
  type AgentFleetItem,
  type AgentRunLogItem,
  type AgentStatus,
  type ApprovalInboxItem,
} from "../data/agents";
import "../../styles/dash-agents.css";

type ResultMode = "live" | "sample";
type ApprovalDecision = "approved" | "declined";

type AgentRow = Record<string, unknown> & AgentFleetItem & { id: string };
type LineRow = Record<string, unknown> &
  ReconcileResult["lines"][number] & {
    id: string;
  };

const STEP_LABELS = [
  "Reading the supplier statement",
  "Matching lines to Trams bookings",
  "Checking contracted commission rates",
  "Drafting the dispute for review",
];

const STEP_DELAY_MS = 900;

const OUTCOME_LABELS: Record<ReconcileOutcome, string> = {
  matched: "Matched",
  short_paid: "Short-paid",
  rate_mismatch: "Rate mismatch",
  missing_from_statement: "Missing",
  not_in_ledger: "Not in ledger",
};

const STATUS_TONES: Record<AgentStatus, "ink" | "gold" | "muted"> = {
  Running: "ink",
  Idle: "muted",
  Paused: "gold",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AgentOpsTab() {
  const liveTick = useLiveTicker(6000);
  const logTick = useLiveTicker(7000);
  const reducedMotion = useReducedMotion();
  const [healthLive, setHealthLive] = useState<boolean | null>(null);
  const [selectedStatementId, setSelectedStatementId] = useState(SAMPLE_STATEMENTS[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [result, setResult] = useState<ReconcileResult | null>(null);
  const [resultMode, setResultMode] = useState<ResultMode | null>(null);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);
  const [approvalInbox, setApprovalInbox] = useState(APPROVAL_INBOX);
  const [approvalFeed, setApprovalFeed] = useState<AgentRunLogItem[]>([]);
  const [runLog, setRunLog] = useState(RUN_LOG);
  const [forcedSample] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return new URLSearchParams(window.location.search).has("sample");
  });

  const selectedStatement =
    SAMPLE_STATEMENTS.find((statement) => statement.id === selectedStatementId) ??
    SAMPLE_STATEMENTS[0];
  const stepDelay = reducedMotion ? 70 : STEP_DELAY_MS;
  const baseRunsToday = AGENT_FLEET.reduce((sum, agent) => sum + agent.runsToday, 0);
  const runsToday = Math.round(jitter(baseRunsToday + liveTick, liveTick, 5, 0.006));
  const lineRows = useMemo<LineRow[]>(
    () => result?.lines.map((line) => ({ ...line, id: line.ref })) ?? [],
    [result],
  );
  const agentRows = useMemo<AgentRow[]>(
    () => AGENT_FLEET.map((agent) => ({ ...agent, id: agent.name })),
    [],
  );

  useEffect(() => {
    let active = true;

    getHealth()
      .then((health) => {
        if (active) {
          setHealthLive(health.live);
        }
      })
      .catch(() => {
        if (active) {
          setHealthLive(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (running === false || activeStep >= STEP_LABELS.length - 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveStep((current) => Math.min(current + 1, STEP_LABELS.length - 1));
    }, stepDelay);

    return () => window.clearTimeout(timeout);
  }, [activeStep, running, stepDelay]);

  useEffect(() => {
    if (logTick === 0) {
      return;
    }

    const template = RUN_LOG_POOL[(logTick - 1) % RUN_LOG_POOL.length];
    setRunLog((current) => [
      { ...template, id: `live-${logTick}-${template.id}` },
      ...current,
    ].slice(0, 12));
  }, [logTick]);

  const resetResult = useCallback(() => {
    setResult(null);
    setResultMode(null);
    setRunError(null);
    setQueueMessage(null);
  }, []);

  const handleSelectStatement = useCallback(
    (statementId: string) => {
      if (running) {
        return;
      }

      setSelectedStatementId(statementId);
      resetResult();
    },
    [resetResult, running],
  );

  const shouldUseSample = useCallback(async () => {
    if (forcedSample || healthLive === false) {
      return true;
    }

    if (healthLive === null) {
      try {
        const health = await getHealth();
        setHealthLive(health.live);
        return health.live === false;
      } catch {
        setHealthLive(false);
        return true;
      }
    }

    return false;
  }, [forcedSample, healthLive]);

  const runAgent = useCallback(async () => {
    setRunning(true);
    setActiveStep(0);
    setRunError(null);
    setResult(null);
    setResultMode(null);
    setQueueMessage(null);

    const minimumRun = wait(stepDelay * (STEP_LABELS.length - 1) + (reducedMotion ? 20 : 150));

    try {
      if (await shouldUseSample()) {
        await minimumRun;
        setResult(SAMPLE_RESULTS[selectedStatementId]);
        setResultMode("sample");
        return;
      }

      const [liveResult] = await Promise.all([reconcile(selectedStatementId), minimumRun]);
      setResult(liveResult);
      setResultMode("live");
    } catch (error) {
      await minimumRun;

      if (error instanceof ApiError && error.code === "nokey") {
        setResult(SAMPLE_RESULTS[selectedStatementId]);
        setResultMode("sample");
        return;
      }

      setRunError(messageFromError(error));
    } finally {
      setRunning(false);
    }
  }, [reducedMotion, selectedStatementId, shouldUseSample, stepDelay]);

  const handleApproval = useCallback((item: ApprovalInboxItem, decision: ApprovalDecision) => {
    const verb = decision === "approved" ? "Approved" : "Declined";

    setApprovalInbox((current) => current.filter((candidate) => candidate.id !== item.id));
    setApprovalFeed((current) => [
      {
        id: `${decision}-${item.id}`,
        time: "Now",
        agent: item.agent,
        outcome: `${verb}: ${item.action}. The audit trail stays attached for review.`,
      },
      ...current,
    ].slice(0, 4));
  }, []);

  return (
    <main className="app-dash-page app-dash-ag-page app-fade">
      <PageHeader
        asOf="As of 21 Sep 2026 · live operations view"
        eyebrow="Operations · Agentic layer"
        lead="Agents take the high-volume, low-judgment work. People keep every decision that touches a client or a supplier relationship."
        title="The work that runs itself"
      />

      <KpiRow>
        <Kpi label="Runs today" note="Across the agent fleet." value={num(runsToday)} />
        <Kpi label="Auto-resolved" note="Low-risk runs closed without human review." value="87%" />
        <Kpi label="Awaiting approval" note="Items held for a person." value={String(approvalInbox.length)} />
        <Kpi label="Hours saved this week" note="Estimated from run class and handle time." value="146 h" />
        <Kpi label="Exceptions routed to people" note="Supplier- or client-sensitive runs held for a person today." value="11" />
      </KpiRow>

      <Section eyebrow="Finance agent" title="Run the Invoice Reconciler" tone="bone">
        <div className={cx("app-dash-ag-reconciler", result && "app-dash-ag-reconciler--has-result")}>
          <div className="app-dash-ag-reconciler__controls">
            <div
              aria-label="Supplier statements"
              className="app-dash-ag-statement-list"
              role="radiogroup"
            >
              {SAMPLE_STATEMENTS.map((statement) => {
                const selected = statement.id === selectedStatement.id;

                return (
                  <button
                    aria-checked={selected}
                    className={cx(
                      "app-dash-ag-statement",
                      selected && "app-dash-ag-statement--selected",
                    )}
                    disabled={running}
                    key={statement.id}
                    onClick={() => handleSelectStatement(statement.id)}
                    role="radio"
                    type="button"
                  >
                    <span className="app-dash-ag-statement__main">
                      <span className="app-dash-ag-statement__supplier">{statement.supplier}</span>
                      <span className="app-dash-ag-statement__period">{statement.period}</span>
                    </span>
                    <span className="app-dash-ag-statement__meta">
                      <span>{statement.lines.length} lines</span>
                      <span>{money(statementTotal(statement))}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="app-dash-ag-runbar">
              <Button disabled={running} onClick={() => void runAgent()}>
                {running ? "Running" : "Run the agent"}
              </Button>
              {resultMode === "sample" ? (
                <Eyebrow tone="muted">Sample run · add an API key for live reconciliation</Eyebrow>
              ) : null}
              {resultMode === "live" ? <Eyebrow tone="muted">Model: live</Eyebrow> : null}
            </div>

            {running ? <StepList activeStep={activeStep} /> : null}
            {runError ? (
              <div className="app-dash-ag-message" role="status">
                <p>{runError}</p>
                <Button onClick={() => void runAgent()} size="sm" variant="quiet">
                  Retry
                </Button>
              </div>
            ) : null}
          </div>

          <div className="app-dash-ag-reconciler__result">
            {result ? (
              <ReconcileResultView
                mode={resultMode ?? "sample"}
                onApprove={() =>
                  setQueueMessage("Queued for Julie Boucher's approval · nothing sent to the supplier yet")
                }
                onEdit={() =>
                  setQueueMessage("Draft marked for editing · nothing sent to the supplier yet")
                }
                queueMessage={queueMessage}
                result={result}
                rows={lineRows}
              />
            ) : (
              <div className="app-dash-ag-empty">
                <Eyebrow tone="muted">Ready</Eyebrow>
                <p>
                  Choose a supplier statement and run the agent to match statement lines against
                  Trams, isolate exceptions, and draft the supplier note for review.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section eyebrow="Agent fleet" title="High-volume work under control">
        <Table columns={agentColumns} keyField="id" rows={agentRows} />
      </Section>

      <div className="app-dash-ag-two-col">
        <Section eyebrow="Human review" title="Awaiting your approval">
          <div className="app-dash-ag-inbox">
            {approvalInbox.length === 0 ? (
              <p className="app-dash-ag-muted">No items are waiting for approval.</p>
            ) : (
              approvalInbox.map((item) => (
                <article className="app-dash-ag-inbox-item" key={item.id}>
                  <div className="app-dash-ag-inbox-item__copy">
                    <Eyebrow>{item.agent}</Eyebrow>
                    <h3>{item.action}</h3>
                    <p>{item.context}</p>
                    <p className="app-dash-ag-muted">{item.value}</p>
                  </div>
                  <div className="app-dash-ag-inbox-item__actions">
                    <Button
                      onClick={() => handleApproval(item, "approved")}
                      size="sm"
                      variant="secondary"
                    >
                      Approve
                    </Button>
                    <Button onClick={() => handleApproval(item, "declined")} size="sm" variant="quiet">
                      Decline
                    </Button>
                  </div>
                </article>
              ))
            )}
            {approvalFeed.length > 0 ? <Feed items={toFeedItems(approvalFeed)} /> : null}
          </div>
        </Section>

        <Section eyebrow="Recent runs" title="Run log">
          <Feed items={toFeedItems(runLog)} />
        </Section>
      </div>
    </main>
  );
}

function StepList({ activeStep }: { activeStep: number }) {
  return (
    <ol className="app-dash-ag-steps" aria-label="Invoice Reconciler progress">
      {STEP_LABELS.map((label, index) => (
        <li
          className={cx(
            "app-dash-ag-step",
            index < activeStep && "app-dash-ag-step--done",
            index === activeStep && "app-dash-ag-step--current",
          )}
          key={label}
        >
          <span className="app-dash-ag-step__marker">{String(index + 1).padStart(2, "0")}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function ReconcileResultView({
  mode,
  onApprove,
  onEdit,
  queueMessage,
  result,
  rows,
}: {
  mode: ResultMode;
  onApprove: () => void;
  onEdit: () => void;
  queueMessage: string | null;
  result: ReconcileResult;
  rows: LineRow[];
}) {
  return (
    <div className="app-dash-ag-result">
      <div className="app-dash-ag-result__header">
        <Eyebrow tone="muted">{mode === "live" ? "Model: live" : "Sample"}</Eyebrow>
        <p>{result.summary}</p>
      </div>

      <KpiRow>
        <Kpi label="Expected" value={money(result.totals.expected)} />
        <Kpi label="Paid" value={money(result.totals.paid)} />
        <Kpi label="Variance" value={money(result.totals.variance)} />
      </KpiRow>

      <Table columns={lineColumns} dense keyField="id" rows={rows} />

      <article className="app-dash-ag-letter">
        <Eyebrow tone="muted">Subject · {result.disputeEmail.subject}</Eyebrow>
        <p className="app-dash-ag-letter__body">{result.disputeEmail.body}</p>
      </article>

      <div className="app-dash-ag-actions">
        <Button onClick={onApprove} variant="secondary">
          Approve and queue to send
        </Button>
        <Button onClick={onEdit} variant="quiet">
          Edit before sending
        </Button>
      </div>

      {queueMessage ? (
        <p className="app-dash-ag-confirmation" role="status">
          {queueMessage}
        </p>
      ) : null}
    </div>
  );
}

const lineColumns: Array<TableColumn<LineRow>> = [
  {
    key: "ref",
    header: "Reference",
    render: (row) => (
      <div className="app-dash-ag-line-ref">
        <strong>{row.ref}</strong>
        <span>{row.client}</span>
      </div>
    ),
  },
  {
    key: "outcome",
    header: "Outcome",
    render: (row) => (
      <StatusTag tone={row.outcome === "matched" ? "muted" : "gold"}>
        {OUTCOME_LABELS[row.outcome]}
      </StatusTag>
    ),
  },
  {
    align: "right",
    key: "expected",
    header: "Expected",
    render: (row) => money(row.expected),
  },
  {
    align: "right",
    key: "paid",
    header: "Paid",
    render: (row) => money(row.paid),
  },
  {
    align: "right",
    key: "variance",
    header: "Variance",
    render: (row) => (
      <span className={cx(row.variance !== 0 && "app-dash-ag-variance")}>
        {money(row.variance)}
      </span>
    ),
  },
  {
    key: "note",
    header: "Note",
    render: (row) => <span className="app-dash-ag-note">{row.note}</span>,
  },
];

const agentColumns: Array<TableColumn<AgentRow>> = [
  {
    key: "name",
    header: "Agent",
    render: (row) => (
      <div className="app-dash-ag-agent-cell">
        <strong>{row.name}</strong>
        <span>{row.description}</span>
      </div>
    ),
    width: "28%",
  },
  {
    key: "domain",
    header: "Domain",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusTag tone={STATUS_TONES[row.status]}>{row.status}</StatusTag>,
  },
  {
    align: "right",
    key: "runsToday",
    header: "Runs today",
    render: (row) => num(row.runsToday),
  },
  {
    align: "right",
    key: "autoResolved",
    header: "Auto-resolved",
    render: (row) => `${row.autoResolved}%`,
  },
  {
    key: "lastRun",
    header: "Last run",
  },
  {
    key: "policy",
    header: "Human-in-the-loop policy",
  },
];

function statementTotal(statement: (typeof SAMPLE_STATEMENTS)[number]) {
  return statement.lines.reduce((sum, line) => sum + line.commissionPaid, 0);
}

function toFeedItems(items: AgentRunLogItem[]) {
  return items.map((item) => ({
    id: item.id,
    source: item.agent,
    text: item.outcome,
    time: item.time,
  }));
}

function messageFromError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "The reconciler could not complete the review. Please try again.";
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(query.matches);

    handleChange();
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
