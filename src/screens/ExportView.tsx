import { Button, Eyebrow, Rule, SectionHeader, TextLink } from "../components";
import {
  DESIGNER_DISCLAIMER,
  type Brief,
  type Proposal,
} from "../shared/proposal";

type ExportViewProps = {
  brief: Brief;
  proposal: Proposal;
  onBackToDraft: () => void;
};

const META_SEPARATOR = " \u00b7 ";

export function ExportView({ brief, onBackToDraft, proposal }: ExportViewProps) {
  const meta = [brief.destination, brief.party, brief.length]
    .filter((item) => item.trim().length > 0)
    .join(META_SEPARATOR);

  return (
    <main className="app-fade">
      <div className="app-no-print">
        <div className="app-container app-export-controls">
          <Button onClick={() => window.print()} size="sm">
            Print or save as PDF
          </Button>
          <TextLink onClick={onBackToDraft}>Return to the draft</TextLink>
        </div>
        <Rule />
      </div>

      <article className="app-doc">
        <header className="app-doc__header">
          <div className="app-wordmark">Tully</div>
          <Eyebrow tone="muted">{`Travel proposal \u00b7 First draft`}</Eyebrow>
        </header>
        <Rule />

        <section className="app-doc__intro" aria-labelledby="export-title">
          {meta.length > 0 ? <Eyebrow>{meta}</Eyebrow> : null}
          <h1 id="export-title">{proposal.title}</h1>
          <p>{proposal.overview}</p>
        </section>

        <section className="app-doc__section" aria-labelledby="export-itinerary">
          <SectionHeader eyebrow="The itinerary" id="export-itinerary" title="Day by day" />
          <div className="app-export-days">
            {proposal.days.map((day) => (
              <article className="app-export-day" key={`${day.day}-${day.title}`}>
                <div>
                  <Eyebrow>Day {day.day}</Eyebrow>
                </div>
                <div>
                  <h3>{day.title}</h3>
                  <p>{day.narrative}</p>
                  {day.highlights.length > 0 ? (
                    <ul>
                      {day.highlights.map((highlight, index) => (
                        <li key={`${day.day}-${index}-${highlight}`}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="app-doc__section" aria-labelledby="export-stays">
          <SectionHeader
            eyebrow="Where you'll stay"
            id="export-stays"
            title="Places to stay, by feel"
          />
          <div className="app-export-stays">
            {proposal.stays.map((stay, index) => (
              <article key={`${stay.location}-${index}`}>
                <h3>{stay.location}</h3>
                <p>{stay.suggestion}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="app-doc__section" aria-labelledby="export-access">
          <SectionHeader
            eyebrow="The Tully difference"
            id="export-access"
            title="Access that opens doors"
          />
          <ol className="app-touch-list app-touch-list--export">
            {proposal.accessTouches.map((touch, index) => (
              <li key={`${index}-${touch}`}>
                <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
                <span className="app-touch">{touch}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="app-export-disclaimer" aria-labelledby="export-disclaimer">
          <Eyebrow id="export-disclaimer">A first draft</Eyebrow>
          <p className="app-export-disclaimer__title">{DESIGNER_DISCLAIMER}</p>
          <p className="app-export-disclaimer__text">{proposal.disclaimer}</p>
        </section>

        <footer className="app-doc__footer">
          Prepared as a first draft for review by your Tully Travel Designer.
        </footer>
      </article>
    </main>
  );
}
