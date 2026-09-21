import { Button, Card, Eyebrow, Rule, SectionHeader, TextLink } from "../components";
import { Editable } from "../components/Editable";
import {
  DESIGNER_DISCLAIMER,
  type Brief,
  type Proposal,
  type RegenerateTarget,
  type Voice,
} from "../shared/proposal";
import type { BusyKey, ProposalActions } from "../hooks/useProposal";

type ProposalScreenProps = {
  proposal: Proposal;
  brief: Brief;
  voice: Voice;
  busy: BusyKey[];
  errors: Record<string, string>;
  sampleMode: boolean;
  actions: ProposalActions;
  onEditBrief: () => void;
  onExport: () => void;
  onRegenerate: (target: RegenerateTarget) => void;
  onRetryVoice: () => void;
  onVoiceChange: (voice: Voice) => void;
};

const META_SEPARATOR = " \u00b7 ";

export function ProposalScreen({
  actions,
  brief,
  busy,
  errors,
  onEditBrief,
  onExport,
  onRegenerate,
  onRetryVoice,
  onVoiceChange,
  proposal,
  sampleMode,
  voice,
}: ProposalScreenProps) {
  const allBusy = busy.includes("all");
  const introBusy = busy.includes("intro");
  const staysBusy = busy.includes("stays");
  const touchesBusy = busy.includes("accessTouches");
  const allMessage = allBusy ? "Rewriting in the chosen voice" : errors.all;
  const allCanRetry = allBusy ? false : errors.all === undefined ? false : sampleMode === false;
  const meta = [brief.destination, brief.party, brief.length, brief.collection, brief.budget]
    .filter((item) => item.trim().length > 0)
    .join(META_SEPARATOR);

  return (
    <main className="app-fade">
      <div className="app-toolbar-shell">
        <div className="app-container app-toolbar">
          <div className="app-toolbar__row">
            <div className="app-toolbar__left">
              <TextLink onClick={onEditBrief}>Return to the brief</TextLink>
              {sampleMode ? <Eyebrow tone="muted">Sample draft</Eyebrow> : null}
            </div>
            <div className="app-toolbar__right">
              <div className="app-voice-group" aria-label="Voice">
                <Eyebrow tone="muted">Voice</Eyebrow>
                <Button
                  aria-pressed={voice === "understated"}
                  disabled={allBusy}
                  onClick={() => onVoiceChange("understated")}
                  size="sm"
                  variant={voice === "understated" ? "secondary" : "quiet"}
                >
                  Understated
                </Button>
                <Button
                  aria-pressed={voice === "evocative"}
                  disabled={allBusy}
                  onClick={() => onVoiceChange("evocative")}
                  size="sm"
                  variant={voice === "evocative" ? "secondary" : "quiet"}
                >
                  Evocative
                </Button>
              </div>
              <Button onClick={onExport} size="sm">
                Export
              </Button>
            </div>
          </div>
          <InlineMessage canRetry={allCanRetry} message={allMessage} onRetry={onRetryVoice} />
        </div>
        <Rule />
      </div>

      <div className={allBusy ? "app-proposal-body app-is-dimmed" : "app-proposal-body"}>
        <section className={introBusy ? "app-proposal-hero app-is-dimmed" : "app-proposal-hero"}>
          <div className="app-container">
            <div className="app-proposal-hero__copy">
              <Eyebrow>{`First draft \u00b7 For Designer review`}</Eyebrow>
              <Editable
                as="h1"
                className="app-hero-title"
                label="Edit proposal title"
                onCommit={actions.editTitle}
                value={proposal.title}
              />
              <Editable
                as="p"
                className="app-proposal-overview"
                label="Edit proposal overview"
                multiline
                onCommit={actions.editOverview}
                value={proposal.overview}
              />
              {meta.length > 0 ? (
                <Eyebrow className="app-meta-line" tone="muted">
                  {meta}
                </Eyebrow>
              ) : null}
              <div className="app-section-actions">
                <Button
                  disabled={introBusy}
                  onClick={() => onRegenerate({ kind: "section", section: "intro" })}
                  size="sm"
                  variant="quiet"
                >
                  {introBusy ? "Redrafting..." : "Regenerate introduction"}
                </Button>
              </div>
              <InlineMessage
                canRetry={sampleMode === false}
                message={errors.intro}
                onRetry={() => onRegenerate({ kind: "section", section: "intro" })}
              />
            </div>
          </div>
        </section>

        <section className="app-itinerary" aria-labelledby="proposal-itinerary">
          <div className="app-container">
            <SectionHeader
              description="Each day is a starting point. Edit freely, or redraft a single day without disturbing the rest."
              eyebrow="The itinerary"
              id="proposal-itinerary"
              title="Day by day"
            />
            <div className="app-day-list">
              {proposal.days.map((day, index) => {
                const key = dayKey(index);
                const dayBusy = busy.includes(key);
                return (
                  <article
                    className={dayBusy ? "app-day-row app-is-dimmed" : "app-day-row"}
                    key={`${day.day}-${day.title}`}
                  >
                    <div className="app-day-row__aside">
                      <Eyebrow>Day {day.day}</Eyebrow>
                      <Button
                        aria-label={`Regenerate day ${day.day}`}
                        disabled={dayBusy}
                        onClick={() => onRegenerate({ kind: "day", index })}
                        size="sm"
                        variant="quiet"
                      >
                        {dayBusy ? "Redrafting..." : "Regenerate this day"}
                      </Button>
                    </div>
                    <div className="app-day-row__main">
                      <Editable
                        as="h3"
                        className="app-day-title"
                        label={`Edit day ${day.day} title`}
                        onCommit={(next) => actions.editDayField(index, "title", next)}
                        value={day.title}
                      />
                      <Editable
                        as="p"
                        className="app-day-narrative"
                        label={`Edit day ${day.day} narrative`}
                        multiline
                        onCommit={(next) => actions.editDayField(index, "narrative", next)}
                        value={day.narrative}
                      />
                      {day.highlights.length > 0 ? (
                        <ul className="app-highlight-list">
                          {day.highlights.map((highlight, highlightIndex) => (
                            <li key={`${day.day}-${highlightIndex}-${highlight}`}>
                              <Editable
                                as="span"
                                className="app-highlight"
                                label={`Edit day ${day.day} highlight ${highlightIndex + 1}`}
                                onCommit={(next) =>
                                  actions.editHighlight(index, highlightIndex, next)
                                }
                                value={highlight}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <InlineMessage
                        canRetry={sampleMode === false}
                        message={errors[key]}
                        onRetry={() => onRegenerate({ kind: "day", index })}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="app-band app-band--warm" aria-labelledby="proposal-stays">
          <div className="app-container">
            <SectionHeader
              actions={
                <Button
                  disabled={staysBusy}
                  onClick={() => onRegenerate({ kind: "section", section: "stays" })}
                  size="sm"
                  variant="quiet"
                >
                  {staysBusy ? "Redrafting section" : "Regenerate section"}
                </Button>
              }
              description="Suggested by character rather than confirmed. Your Designer will secure the right house for each stage."
              eyebrow="Where you'll stay"
              id="proposal-stays"
              title="Places to stay, by feel"
            />
            <div className={staysBusy ? "app-stay-grid app-is-dimmed" : "app-stay-grid"}>
              {proposal.stays.map((stay, index) => (
                <Card
                  eyebrow="Suggested stay"
                  key={`${stay.location}-${index}`}
                  meta="To be confirmed by your Designer"
                  ratio={null}
                  title={
                    <Editable
                      as="span"
                      label={`Edit stay ${index + 1} location`}
                      onCommit={(next) => actions.editStay(index, "location", next)}
                      value={stay.location}
                    />
                  }
                  description={
                    <Editable
                      as="span"
                      label={`Edit stay ${index + 1} suggestion`}
                      multiline
                      onCommit={(next) => actions.editStay(index, "suggestion", next)}
                      value={stay.suggestion}
                    />
                  }
                />
              ))}
            </div>
            <InlineMessage
              canRetry={sampleMode === false}
              message={errors.stays}
              onRetry={() => onRegenerate({ kind: "section", section: "stays" })}
            />
          </div>
        </section>

        <section className="app-access" aria-labelledby="proposal-access">
          <div className="app-container">
            <SectionHeader
              actions={
                <Button
                  disabled={touchesBusy}
                  onClick={() => onRegenerate({ kind: "section", section: "accessTouches" })}
                  size="sm"
                  variant="quiet"
                >
                  {touchesBusy ? "Redrafting section" : "Regenerate section"}
                </Button>
              }
              description="Moments arranged through relationships rather than reservations, each to be confirmed by your Designer."
              eyebrow="The Tully difference"
              id="proposal-access"
              title="Access that opens doors"
            />
            <ol className={touchesBusy ? "app-touch-list app-is-dimmed" : "app-touch-list"}>
              {proposal.accessTouches.map((touch, index) => (
                <li key={`${index}-${touch}`}>
                  <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
                  <Editable
                    as="span"
                    className="app-touch"
                    label={`Edit access touch ${index + 1}`}
                    multiline
                    onCommit={(next) => actions.editTouch(index, next)}
                    value={touch}
                  />
                </li>
              ))}
            </ol>
            <InlineMessage
              canRetry={sampleMode === false}
              message={errors.accessTouches}
              onRetry={() => onRegenerate({ kind: "section", section: "accessTouches" })}
            />
          </div>
        </section>

        <section className="app-disclaimer-band" aria-labelledby="proposal-disclaimer">
          <div className="app-disclaimer-band__inner">
            <div className="app-disclaimer-band__copy">
              <Eyebrow id="proposal-disclaimer">A first draft</Eyebrow>
              <p className="app-disclaimer-band__title">{DESIGNER_DISCLAIMER}</p>
              <p className="app-disclaimer-band__text">{proposal.disclaimer}</p>
            </div>
            <Button onClick={onExport} variant="invert">
              Export proposal
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function InlineMessage({
  canRetry,
  message,
  onRetry,
}: {
  canRetry: boolean;
  message: string | undefined;
  onRetry: () => void;
}) {
  if (message === undefined) {
    return null;
  }

  return (
    <p className="app-inline-message">
      <span>{message}</span>
      {canRetry ? <TextLink onClick={onRetry}>Try again</TextLink> : null}
    </p>
  );
}

function dayKey(index: number): BusyKey {
  return `day-${index + 1}`;
}
