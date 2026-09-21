import express, { type NextFunction, type Request, type Response } from 'express';
import {
  CALM_MESSAGES,
  DraftError,
  MODEL,
  generate,
  hasApiKey,
  normalizeDay,
  normalizeProposal,
  normalizeStays,
  normalizeTouches,
} from './anthropic.js';
import { draftMessage, regenerateMessage, revoiceMessage } from './prompts.js';
import {
  BriefSchema,
  DaySchema,
  IntroSchema,
  ProposalSchema,
  RegenerateTargetSchema,
  StaysPieceSchema,
  TouchesPieceSchema,
  VOICES,
} from '../src/shared/proposal.js';
import type { RegenerateTarget, Voice } from '../src/shared/proposal.js';
import { z } from 'zod';
import { ReconcileRequestSchema } from '../src/shared/reconcile.js';
import { hasSampleStatement, runReconcile } from './agents/reconcile.js';

// Routes only. Local dev (server/index.ts) and Vercel (api/index.ts) both mount this app.
export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));

app.use('/api', (req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.baseUrl}${req.path} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ live: hasApiKey(), model: MODEL });
});

const VoiceSchema = z.enum(VOICES);
const DraftBodySchema = z.object({ brief: BriefSchema, voice: VoiceSchema });
const ProposalBodySchema = DraftBodySchema.extend({ proposal: ProposalSchema });
const RegenerateBodySchema = ProposalBodySchema.extend({ target: RegenerateTargetSchema });

app.post('/api/draft', async (req, res, next) => {
  const body = DraftBodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
  }
  if (!hasApiKey()) {
    return res.status(503).json({ error: { code: 'nokey', message: CALM_MESSAGES.nokey } });
  }

  try {
    const proposal = await generate(ProposalSchema, draftMessage(body.data.brief, body.data.voice));
    res.json({ proposal: normalizeProposal(proposal) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/regenerate', async (req, res, next) => {
  const body = RegenerateBodySchema.safeParse(req.body);
  if (!body.success || !validTarget(body.data.target, body.data.proposal.days.length)) {
    return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
  }
  if (!hasApiKey()) {
    return res.status(503).json({ error: { code: 'nokey', message: CALM_MESSAGES.nokey } });
  }

  const { brief, voice, proposal, target } = body.data;

  try {
    const piece = await generateForTarget(brief, voice, proposal, target);
    res.json({ piece });
  } catch (err) {
    next(err);
  }
});

app.post('/api/revoice', async (req, res, next) => {
  const body = ProposalBodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
  }
  if (!hasApiKey()) {
    return res.status(503).json({ error: { code: 'nokey', message: CALM_MESSAGES.nokey } });
  }

  try {
    const proposal = await generate(
      ProposalSchema,
      revoiceMessage(body.data.brief, body.data.voice, body.data.proposal),
      { maxTokens: 16000 },
    );
    res.json({ proposal: normalizeProposal(proposal) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/agents/reconcile', async (req, res, next) => {
  const body = ReconcileRequestSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
  }
  if (!hasSampleStatement(body.data.statementId)) {
    return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
  }
  if (!hasApiKey()) {
    return res.status(503).json({ error: { code: 'nokey', message: CALM_MESSAGES.nokey } });
  }

  try {
    const result = await runReconcile(body.data.statementId);
    if (result === null) {
      return res.status(400).json({ error: { code: 'request', message: CALM_MESSAGES.request } });
    }

    res.json({ result });
  } catch (err) {
    next(err);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof DraftError) {
    return res
      .status(err.status)
      .json({ error: { code: err.code, message: CALM_MESSAGES[err.code] } });
  }

  console.error('Server error', { name: err instanceof Error ? err.constructor.name : typeof err });
  res.status(500).json({ error: { code: 'unknown', message: CALM_MESSAGES.unknown } });
});

function validTarget(target: RegenerateTarget, dayCount: number): boolean {
  return target.kind !== 'day' || target.index < dayCount;
}

async function generateForTarget(
  brief: z.infer<typeof BriefSchema>,
  voice: Voice,
  proposal: z.infer<typeof ProposalSchema>,
  target: RegenerateTarget,
) {
  const message = regenerateMessage(brief, voice, proposal, target);

  if (target.kind === 'day') {
    const day = await generate(DaySchema, message);
    return normalizeDay(day, target.index + 1);
  }
  if (target.section === 'intro') {
    const intro = await generate(IntroSchema, message);
    return { title: normalizeText(intro.title), overview: normalizeText(intro.overview) };
  }
  if (target.section === 'stays') {
    const piece = await generate(StaysPieceSchema, message);
    return { stays: normalizeStays(piece.stays) };
  }

  const piece = await generate(TouchesPieceSchema, message);
  return { accessTouches: normalizeTouches(piece.accessTouches) };
}

function normalizeText(value: string): string {
  return value.trim().replace(/!+/g, '.');
}
