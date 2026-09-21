import type { FormEvent, ReactNode } from "react";
import { Button, Eyebrow, Input, Rule, TextLink } from "../components";
import {
  BUDGET_TIERS,
  COLLECTIONS,
  DESIGNER_DISCLAIMER,
  type Brief,
} from "../shared/proposal";
import { LoadingLines } from "./LoadingLines";

type BriefScreenProps = {
  brief: Brief;
  drafting: boolean;
  draftError: string | null;
  hasProposal: boolean;
  reducedMotion: boolean;
  sampleMode: boolean;
  onBriefChange: (brief: Brief) => void;
  onClear: () => void;
  onDraft: () => void;
  onReturnToDraft: () => void;
  /** Optional summary shown under the hero copy, e.g. engine stats in the dashboard. */
  stats?: ReactNode;
};

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function BriefScreen({
  brief,
  drafting,
  draftError,
  hasProposal,
  onBriefChange,
  onClear,
  onDraft,
  onReturnToDraft,
  reducedMotion,
  sampleMode,
  stats,
}: BriefScreenProps) {
  const updateField =
    (field: keyof Brief) =>
    (event: React.ChangeEvent<FieldElement>) => {
      onBriefChange({ ...brief, [field]: event.currentTarget.value });
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onDraft();
  };

  const canDraft = drafting || brief.destination.trim().length === 0;

  return (
    <div className="app-fade">
      <main>
        <div className="app-container">
          <section className="app-brief-hero" aria-labelledby="brief-title">
            <Eyebrow>For Tully Travel Designers</Eyebrow>
            <h1 className="app-hero-title" id="brief-title">
              Begin with the essentials. You shape the rest.
            </h1>
            <p className="app-brief-lead">
              Share the heart of your client's enquiry. A considered first draft is composed in
              the house voice for you to refine, with your access, your relationships, and your
              judgment brought to every detail.
            </p>
            {stats}
            <Rule className="app-brief-hero__rule" />
          </section>

          <form className="app-brief-form" onSubmit={handleSubmit}>
            <Input
              label="Destination(s) or region"
              onChange={updateField("destination")}
              placeholder="Kenya + Seychelles"
              value={brief.destination}
            />
            <Input
              as="select"
              label="Collection"
              onChange={updateField("collection")}
              value={brief.collection}
            >
              {COLLECTIONS.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </Input>
            <Input
              hint="Who is travelling, and the occasion."
              label="Party"
              onChange={updateField("party")}
              placeholder="2 adults, honeymoon"
              value={brief.party}
            />
            <Input
              hint="Nights, a date range, or flexible."
              label="Length or dates"
              onChange={updateField("length")}
              placeholder="12 nights, late February"
              value={brief.length}
            />
            <Input
              as="select"
              hint="Qualitative only. Pricing is set later by your Designer."
              label="Budget tier"
              onChange={updateField("budget")}
              value={brief.budget}
            >
              {BUDGET_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </Input>
            <Input
              as="textarea"
              label="Special interests and notes"
              onChange={updateField("notes")}
              placeholder="Wine, private guides, no long drives, a 30th anniversary"
              rows={3}
              value={brief.notes}
            />

            <div className="app-action-row">
              <Button disabled={canDraft} size="lg" type="submit">
                Draft the journey
              </Button>
              <Button disabled={drafting} onClick={onClear} size="md" variant="quiet">
                Clear the brief
              </Button>
              {hasProposal ? (
                <TextLink disabled={drafting} onClick={onReturnToDraft}>
                  Return to the draft
                </TextLink>
              ) : null}
            </div>

            {sampleMode ? (
              <p className="app-small-note">
                Live drafting is not configured on this machine, so a prepared sample draft will
                be shown.
              </p>
            ) : null}

            {drafting ? <LoadingLines reducedMotion={reducedMotion} /> : null}

            {draftError ? (
              <div className="app-brief-error">
                <Rule />
                <p>
                  <span>{draftError}</span>
                  <TextLink onClick={onDraft}>Try again</TextLink>
                </p>
              </div>
            ) : null}
          </form>
        </div>
      </main>

      <section className="app-disclaimer-band" aria-labelledby="brief-disclaimer-title">
        <div className="app-disclaimer-band__inner">
          <div className="app-disclaimer-band__copy">
            <Eyebrow id="brief-disclaimer-title">A first draft</Eyebrow>
            <p className="app-disclaimer-band__title">{DESIGNER_DISCLAIMER}</p>
            <p className="app-disclaimer-band__text">
              You remain the author of the journey; this simply gives you a quieter place to
              begin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
