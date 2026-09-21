import { Kpi } from "../Kpi";
import { KpiRow } from "../KpiRow";

// Engine usage across the designer team, shown under the brief screen's hero copy.
export function ProposalStats() {
  return (
    <section aria-label="Proposal Engine this week" className="app-dash-proposal-stats app-no-print">
      <KpiRow>
        <Kpi
          delta={{ direction: "up", text: "4 vs last week" }}
          label="Drafts this week"
          spark={[5, 6, 4, 7, 8, 7, 9, 8, 10, 12]}
          value="12"
        />
        <Kpi
          delta={{ direction: "down", text: "from 3.5 days by hand" }}
          label="Brief to first draft"
          value="38 s"
        />
        <Kpi
          label="Designer edit rate"
          note="Share of draft copy a Designer changes before it goes to a client."
          value="31%"
        />
        <Kpi
          delta={{ direction: "up", text: "6 pts vs manual proposals" }}
          label="Drafted proposals to deposit"
          value="44%"
        />
      </KpiRow>
    </section>
  );
}
