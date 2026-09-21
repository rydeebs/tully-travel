import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { HOUSE_VOICE } from '../src/prompts/houseVoice.js';
import type { Day, Proposal, Stay } from '../src/shared/proposal.js';

export const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

export type DraftErrorCode =
  | 'auth'
  | 'busy'
  | 'network'
  | 'refusal'
  | 'incomplete'
  | 'malformed'
  | 'request'
  | 'nokey'
  | 'unknown';

const STATUS_BY_CODE: Record<DraftErrorCode, number> = {
  auth: 502,
  busy: 503,
  network: 502,
  refusal: 422,
  incomplete: 502,
  malformed: 502,
  request: 400,
  nokey: 503,
  unknown: 500,
};

export class DraftError extends Error {
  code: DraftErrorCode;
  status: number;

  constructor(code: DraftErrorCode, status = STATUS_BY_CODE[code]) {
    super(code);
    this.name = 'DraftError';
    this.code = code;
    this.status = status;
  }
}

export const CALM_MESSAGES: Record<DraftErrorCode, string> = {
  auth: "Live drafting could not authenticate with Anthropic. Please check this machine's API key.",
  busy: 'The drafting service is momentarily busy. Please try again in a moment.',
  network: 'The drafting service could not be reached. Please check the connection and try again.',
  refusal: "This brief couldn't be drafted as written. You may wish to adjust the notes and try again.",
  incomplete: 'The draft stopped before it was complete. Please try again.',
  malformed: "The draft didn't come together cleanly. Please try again.",
  request: 'The drafting request was not accepted. Please review the brief and try again.',
  nokey: "Live drafting isn't configured on this machine yet. Set ANTHROPIC_API_KEY (in .env locally, or in the Vercel project settings) to continue.",
  unknown: 'The draft could not be created just now. Please try again in a moment.',
};

let client: Anthropic | undefined;

function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

export function hasApiKey(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.ANTHROPIC_AUTH_TOKEN?.trim(),
  );
}

export async function generate<T>(
  schema: z.ZodType<T>,
  userMessage: string,
  opts?: { maxTokens?: number; system?: string },
): Promise<T> {
  if (!hasApiKey()) {
    throw new DraftError('nokey');
  }

  let lastMalformed = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const stream = getClient().beta.messages.stream({
        model: MODEL,
        max_tokens: opts?.maxTokens ?? 16000,
        system: opts?.system ?? HOUSE_VOICE,
        messages: [{ role: 'user', content: userMessage }],
        output_config: { effort: 'medium', format: betaZodOutputFormat(schema) },
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      });
      const message = await stream.finalMessage();

      if (message.stop_reason === 'refusal') {
        throw new DraftError('refusal');
      }
      if (message.stop_reason === 'max_tokens') {
        throw new DraftError('incomplete');
      }

      const text = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      try {
        const parsedJson: unknown = JSON.parse(text);
        const parsed = schema.safeParse(parsedJson);
        if (parsed.success) {
          return parsed.data;
        }
      } catch {
        // Retry once below; no brief or response content is logged.
      }

      lastMalformed = true;
    } catch (err) {
      if (err instanceof DraftError) {
        throw err;
      }
      throw mapSdkError(err);
    }
  }

  if (lastMalformed) {
    throw new DraftError('malformed');
  }
  throw new DraftError('unknown');
}

function mapSdkError(err: unknown): DraftError {
  const status = err instanceof Anthropic.APIError ? err.status : undefined;
  console.error('Anthropic error', {
    name: err instanceof Error ? err.constructor.name : typeof err,
    status,
  });

  if (err instanceof Anthropic.AuthenticationError) return new DraftError('auth');
  if (err instanceof Anthropic.PermissionDeniedError) return new DraftError('auth');
  if (err instanceof Anthropic.RateLimitError) return new DraftError('busy');
  if (err instanceof Anthropic.InternalServerError) return new DraftError('busy');
  if (err instanceof Anthropic.APIConnectionError) return new DraftError('network');
  if (err instanceof Anthropic.BadRequestError) return new DraftError('request');
  if (err instanceof Anthropic.APIError) return new DraftError('unknown');
  return new DraftError('unknown');
}

function cleanString(value: string): string {
  return value.trim().replace(/!+/g, '.');
}

export function normalizeDay(day: Day, dayNumber: number): Day {
  return {
    day: dayNumber,
    title: cleanString(day.title),
    narrative: cleanString(day.narrative),
    highlights: day.highlights.map(cleanString).filter(Boolean).slice(0, 4),
  };
}

export function normalizeStays(stays: Stay[]): Stay[] {
  return stays
    .map((stay) => ({
      location: cleanString(stay.location),
      suggestion: cleanString(stay.suggestion),
    }))
    .filter((stay) => stay.location || stay.suggestion);
}

export function normalizeTouches(touches: string[]): string[] {
  return touches.map(cleanString).filter(Boolean);
}

export function normalizeProposal(proposal: Proposal): Proposal {
  return {
    title: cleanString(proposal.title),
    overview: cleanString(proposal.overview),
    days: proposal.days.map((day, index) => normalizeDay(day, index + 1)),
    stays: normalizeStays(proposal.stays),
    accessTouches: normalizeTouches(proposal.accessTouches),
    disclaimer: cleanString(proposal.disclaimer),
  };
}
