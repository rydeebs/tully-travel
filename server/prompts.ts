import { VOICE_REGISTERS } from '../src/prompts/houseVoice.js';
import type { Brief, Proposal, RegenerateTarget, Voice } from '../src/shared/proposal.js';

export function briefBlock(brief: Brief): string {
  return `<brief>
Destination(s): ${brief.destination}
Collection: ${brief.collection}
Party: ${brief.party}
Length/dates: ${brief.length}
Budget tier: ${brief.budget}
Special interests/notes: ${brief.notes}
</brief>`;
}

export function draftMessage(brief: Brief, voice: Voice): string {
  return `${VOICE_REGISTERS[voice]}

Create the full first-draft proposal from this client brief.

${briefBlock(brief)}

Return the complete proposal JSON only.`;
}

export function regenerateMessage(
  brief: Brief,
  voice: Voice,
  proposal: Proposal,
  target: RegenerateTarget,
): string {
  const current = JSON.stringify(proposal, null, 2);
  const request =
    target.kind === 'day'
      ? `Return only a single day object for days[${target.index}]. Keep day set to ${
          target.index + 1
        }. Make it a fresh take, consistent with the days before and after.`
      : target.section === 'intro'
        ? 'Return only an object with { "title": string, "overview": string }.'
        : target.section === 'stays'
          ? 'Return only an object with { "stays": [...] }.'
          : 'Return only an object with { "accessTouches": [...] }.';

  return `${VOICE_REGISTERS[voice]}

Regenerate only the targeted piece of the proposal from this client brief.

${briefBlock(brief)}

The CURRENT proposal JSON may contain the Designer's edits. Treat those edits as authoritative context and keep consistent with them.

<currentProposal>
${current}
</currentProposal>

${request}

Return the targeted JSON only.`;
}

export function revoiceMessage(brief: Brief, voice: Voice, proposal: Proposal): string {
  return `${VOICE_REGISTERS[voice]}

Rewrite all copy in the chosen register while keeping the same number of days, the same places, the same structure, and the substance of every Designer edit.

${briefBlock(brief)}

The CURRENT proposal JSON may contain the Designer's edits. Treat those edits as authoritative context.

<currentProposal>
${JSON.stringify(proposal, null, 2)}
</currentProposal>

Return the complete proposal JSON only.`;
}
