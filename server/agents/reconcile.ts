import { generate } from '../anthropic.js';
import { findSampleStatement, ledgerForSupplier } from '../../src/shared/reconcileSamples.js';
import { ReconcileResultSchema } from '../../src/shared/reconcile.js';
import type { BookingRecord, ReconcileLine, ReconcileResult, SupplierStatement } from '../../src/shared/reconcile.js';

export const reconcileSystemPrompt = `You are Tully's Invoice Reconciler agent. Compare supplier commission statement lines to Tully's booking ledger from Trams.

Rules:
- A variance of $5 or less counts as matched. Keep a note when a tolerated rounding difference exists.
- Never invent bookings, clients, references, payment amounts, or ledger records.
- If a statement line is absent from Trams, mark it not_in_ledger.
- If a confirmed Trams booking for the supplier is absent from the statement, mark it missing_from_statement.
- If paid commission is below expected while the rate is otherwise aligned, mark it short_paid.
- If the statement rate differs from the contracted Trams rate, mark it rate_mismatch.
- Draft a courteous supplier dispute email. Do not accuse. Ask for review and remittance of the variance with booking references.
- The email should stay calm, concise, and suitable for Julie Boucher's finance approval queue.

Return JSON only.`;

export function reconcileMessage(statement: SupplierStatement, ledger: BookingRecord[]): string {
  return `Reconcile this supplier statement against the Trams booking ledger.

<supplierStatement>
${JSON.stringify(statement, null, 2)}
</supplierStatement>

<tramsBookingLedger>
${JSON.stringify(ledger, null, 2)}
</tramsBookingLedger>`;
}

export function hasSampleStatement(statementId: string): boolean {
  return findSampleStatement(statementId) !== undefined;
}

export async function runReconcile(statementId: string): Promise<ReconcileResult | null> {
  const statement = findSampleStatement(statementId);

  if (statement === undefined) {
    return null;
  }

  const ledger = ledgerForSupplier(statement.supplier);
  const result = await generate(
    ReconcileResultSchema,
    reconcileMessage(statement, ledger),
    { system: reconcileSystemPrompt, maxTokens: 8000 },
  );

  return withServerTotals(result);
}

function withServerTotals(result: ReconcileResult): ReconcileResult {
  const lines = result.lines.map((line) => ({
    ...line,
    variance: roundMoney(line.expected - line.paid),
  }));
  const totals = totalsFromLines(lines);

  return { ...result, lines, totals };
}

function totalsFromLines(lines: ReconcileLine[]): ReconcileResult['totals'] {
  const totals = lines.reduce(
    (current, line) => ({
      expected: current.expected + line.expected,
      paid: current.paid + line.paid,
      matchedCount: current.matchedCount + (line.outcome === 'matched' ? 1 : 0),
      exceptionCount: current.exceptionCount + (line.outcome === 'matched' ? 0 : 1),
    }),
    { expected: 0, paid: 0, matchedCount: 0, exceptionCount: 0 },
  );

  return {
    expected: roundMoney(totals.expected),
    paid: roundMoney(totals.paid),
    variance: roundMoney(totals.expected - totals.paid),
    matchedCount: totals.matchedCount,
    exceptionCount: totals.exceptionCount,
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
