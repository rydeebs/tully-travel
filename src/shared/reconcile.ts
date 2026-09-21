import { z } from 'zod';

export const SupplierStatementLineSchema = z.object({
  ref: z.string(),
  client: z.string(),
  travelDates: z.string(),
  grossFare: z.number(),
  commissionRatePaid: z.number(),
  commissionPaid: z.number(),
});
export type SupplierStatementLine = z.infer<typeof SupplierStatementLineSchema>;

export const SupplierStatementSchema = z.object({
  id: z.string(),
  supplier: z.string(),
  period: z.string(),
  currency: z.literal('USD'),
  lines: z.array(SupplierStatementLineSchema),
});
export type SupplierStatement = z.infer<typeof SupplierStatementSchema>;

export const BookingRecordSchema = z.object({
  ref: z.string(),
  client: z.string(),
  supplier: z.string(),
  travelDates: z.string(),
  grossFare: z.number(),
  contractedRate: z.number(),
  expectedCommission: z.number(),
  status: z.string(),
});
export type BookingRecord = z.infer<typeof BookingRecordSchema>;

export const ReconcileRequestSchema = z.object({
  statementId: z.string(),
});
export type ReconcileRequest = z.infer<typeof ReconcileRequestSchema>;

export const ReconcileOutcomeSchema = z.enum([
  'matched',
  'short_paid',
  'rate_mismatch',
  'missing_from_statement',
  'not_in_ledger',
]);
export type ReconcileOutcome = z.infer<typeof ReconcileOutcomeSchema>;

export const ReconcileLineSchema = z.object({
  ref: z.string(),
  client: z.string(),
  outcome: ReconcileOutcomeSchema,
  expected: z.number(),
  paid: z.number(),
  variance: z.number(),
  note: z.string(),
});
export type ReconcileLine = z.infer<typeof ReconcileLineSchema>;

export const ReconcileResultSchema = z.object({
  summary: z.string(),
  lines: z.array(ReconcileLineSchema),
  totals: z.object({
    expected: z.number(),
    paid: z.number(),
    variance: z.number(),
    matchedCount: z.number(),
    exceptionCount: z.number(),
  }),
  disputeEmail: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  confidence: z.enum(['high', 'medium', 'low']),
});
export type ReconcileResult = z.infer<typeof ReconcileResultSchema>;
