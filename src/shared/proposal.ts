/* The proposal contract, shared by the server (validation, structured output)
   and the client (types, rendering). The shape mirrors the brief exactly. */
import { z } from 'zod';

export const COLLECTIONS = [
  'Cruise & Coastline',
  'Noble Estates',
  'Peak & Panorama',
  'Eastern Soul',
  'Wild & Untamed',
  'Epicurean Worlds',
  'Vintage & Vineyard',
  'Grand Tour',
  'Safari',
  'Honeymoon',
  'Family',
  'Multi-generational',
  'Solo',
  'Couples',
] as const;

export const BUDGET_TIERS = ['Premium', 'Ultra-Luxury', 'No-Limit'] as const;

export const VOICES = ['understated', 'evocative'] as const;
export type Voice = (typeof VOICES)[number];

export const BriefSchema = z.object({
  destination: z.string().max(300),
  collection: z.string().max(80),
  party: z.string().max(300),
  length: z.string().max(200),
  budget: z.string().max(40),
  notes: z.string().max(2000),
});
export type Brief = z.infer<typeof BriefSchema>;

export const DaySchema = z.object({
  day: z.number(),
  title: z.string(),
  narrative: z.string(),
  highlights: z.array(z.string()),
});
export type Day = z.infer<typeof DaySchema>;

export const StaySchema = z.object({
  location: z.string(),
  suggestion: z.string(),
});
export type Stay = z.infer<typeof StaySchema>;

export const ProposalSchema = z.object({
  title: z.string(),
  overview: z.string(),
  days: z.array(DaySchema),
  stays: z.array(StaySchema),
  accessTouches: z.array(z.string()),
  disclaimer: z.string(),
});
export type Proposal = z.infer<typeof ProposalSchema>;

/* Pieces returned by "regenerate" — only the targeted part comes back. */
export const IntroSchema = z.object({ title: z.string(), overview: z.string() });
export const StaysPieceSchema = z.object({ stays: z.array(StaySchema) });
export const TouchesPieceSchema = z.object({ accessTouches: z.array(z.string()) });

export type Section = 'intro' | 'stays' | 'accessTouches';
export type RegenerateTarget =
  | { kind: 'day'; index: number }
  | { kind: 'section'; section: Section };

export const RegenerateTargetSchema = z.union([
  z.object({ kind: z.literal('day'), index: z.number().int().min(0) }),
  z.object({ kind: z.literal('section'), section: z.enum(['intro', 'stays', 'accessTouches']) }),
]);

/* The one sentence that always frames the output, verbatim. */
export const DESIGNER_DISCLAIMER =
  'First draft generated for Designer review. Pricing, availability, and final curation confirmed by your Tully Travel Designer.';

export const EXAMPLE_BRIEF: Brief = {
  destination: 'Kenya + Seychelles',
  collection: 'Honeymoon',
  party: '2 adults, honeymoon',
  length: '12 nights, late February',
  budget: 'Ultra-Luxury',
  notes: 'Private guides, no long drives, celebrating our anniversary',
};
