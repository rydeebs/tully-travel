import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ApiError, draft, getHealth, regenerate, revoice, type RegeneratePiece } from "../../api";
import { SAMPLE_PROPOSAL } from "../../sample/sampleProposal";
import {
  BUDGET_TIERS,
  COLLECTIONS,
  EXAMPLE_BRIEF,
  type Brief,
  type Day,
  type RegenerateTarget,
  type Stay,
  type Voice,
} from "../../shared/proposal";
import { useProposal, type BusyKey } from "../../hooks/useProposal";
import { BriefScreen } from "../BriefScreen";
import { ProposalScreen } from "../ProposalScreen";
import { ExportView } from "../ExportView";

type View = "brief" | "draft" | "export";

type ProposalEngineProps = {
  onExportModeChange?: (exporting: boolean) => void;
  stats?: ReactNode;
};

const SAMPLE_NOTE = "Redrafting needs live drafting. Add an Anthropic API key to .env to enable it.";
const UNEXPECTED_MESSAGE =
  "The drafting service returned an unexpected response. Please try again.";

export function ProposalEngine({ onExportModeChange, stats }: ProposalEngineProps) {
  const [view, setView] = useState<View>("brief");
  const [brief, setBrief] = useState<Brief>(EXAMPLE_BRIEF);
  const [voice, setVoice] = useState<Voice>("understated");
  const [health, setHealth] = useState<{ live: boolean } | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [forcedSample] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return new URLSearchParams(window.location.search).has("sample");
  });
  const reducedMotion = useReducedMotion();
  const proposalState = useProposal();
  const sampleMode = forcedSample || health?.live === false;

  useEffect(() => {
    let active = true;

    getHealth()
      .then((next) => {
        if (active) {
          setHealth({ live: next.live });
        }
      })
      .catch(() => {
        if (active) {
          setHealth({ live: false });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    onExportModeChange?.(view === "export");

    return () => {
      onExportModeChange?.(false);
    };
  }, [onExportModeChange, view]);

  // Each view opens at its top, like turning to a new page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view, proposalState.proposal === null]);

  const handleDraft = useCallback(async () => {
    if (brief.destination.trim().length === 0) {
      return;
    }

    setDrafting(true);
    setDraftError(null);

    try {
      if (sampleMode) {
        if (reducedMotion === false) {
          await wait(1200);
        }

        proposalState.setProposal(SAMPLE_PROPOSAL);
      } else {
        const proposal = await draft(brief, voice);
        proposalState.setProposal(proposal);
      }

      setView("draft");
    } catch (error) {
      setDraftError(messageFromError(error));
    } finally {
      setDrafting(false);
    }
  }, [brief, proposalState, reducedMotion, sampleMode, voice]);

  const runRegenerate = useCallback(
    async (target: RegenerateTarget) => {
      const current = proposalState.proposal;
      const key = targetKey(target);

      if (current === null) {
        return;
      }

      if (sampleMode) {
        proposalState.setError(key, SAMPLE_NOTE);
        return;
      }

      proposalState.setBusy(key, true);
      proposalState.setError(key, null);

      try {
        const piece = await regenerate(brief, voice, current, target);
        const merged = mergePiece(piece, target);

        if (merged.kind === "day" && target.kind === "day") {
          proposalState.replaceDay(target.index, merged.day);
        }

        if (merged.kind === "intro") {
          proposalState.replaceIntro(merged.intro);
        }

        if (merged.kind === "stays") {
          proposalState.replaceStays(merged.stays);
        }

        if (merged.kind === "touches") {
          proposalState.replaceTouches(merged.touches);
        }

        if (merged.kind === "unknown") {
          proposalState.setError(key, UNEXPECTED_MESSAGE);
        }
      } catch (error) {
        proposalState.setError(key, messageFromError(error));
      } finally {
        proposalState.setBusy(key, false);
      }
    },
    [brief, proposalState, sampleMode, voice],
  );

  const runRevoice = useCallback(
    async (nextVoice: Voice) => {
      const current = proposalState.proposal;

      if (current === null) {
        return;
      }

      if (sampleMode) {
        proposalState.setError("all", SAMPLE_NOTE);
        return;
      }

      proposalState.setBusy("all", true);
      proposalState.setError("all", null);

      try {
        const proposal = await revoice(brief, nextVoice, current);
        proposalState.setProposal(proposal);
      } catch (error) {
        proposalState.setError("all", messageFromError(error));
      } finally {
        proposalState.setBusy("all", false);
      }
    },
    [brief, proposalState, sampleMode],
  );

  const handleVoiceChange = useCallback(
    (nextVoice: Voice) => {
      if (nextVoice === voice) {
        return;
      }

      if (sampleMode) {
        proposalState.setError("all", SAMPLE_NOTE);
        return;
      }

      setVoice(nextVoice);
      void runRevoice(nextVoice);
    },
    [proposalState, runRevoice, sampleMode, voice],
  );

  const handleRetryVoice = useCallback(() => {
    void runRevoice(voice);
  }, [runRevoice, voice]);

  const handleClearBrief = useCallback(() => {
    setBrief({
      destination: "",
      collection: COLLECTIONS[0],
      party: "",
      length: "",
      budget: BUDGET_TIERS[0],
      notes: "",
    });
    setDraftError(null);
  }, []);

  const proposal = proposalState.proposal;

  return (
    <>
      {view === "brief" || proposal === null ? (
        <BriefScreen
          brief={brief}
          drafting={drafting}
          draftError={draftError}
          hasProposal={proposal === null ? false : true}
          onBriefChange={setBrief}
          onClear={handleClearBrief}
          onDraft={handleDraft}
          onReturnToDraft={() => setView("draft")}
          reducedMotion={reducedMotion}
          sampleMode={sampleMode}
          stats={stats}
        />
      ) : view === "export" ? (
        <ExportView brief={brief} onBackToDraft={() => setView("draft")} proposal={proposal} />
      ) : (
        <ProposalScreen
          actions={proposalState}
          brief={brief}
          busy={proposalState.busy}
          errors={proposalState.errors}
          onEditBrief={() => setView("brief")}
          onExport={() => setView("export")}
          onRegenerate={(target) => void runRegenerate(target)}
          onRetryVoice={handleRetryVoice}
          onVoiceChange={handleVoiceChange}
          proposal={proposal}
          sampleMode={sampleMode}
          voice={voice}
        />
      )}
    </>
  );
}

type MergeResult =
  | { kind: "day"; day: Day }
  | { kind: "intro"; intro: { title: string; overview: string } }
  | { kind: "stays"; stays: Stay[] }
  | { kind: "touches"; touches: string[] }
  | { kind: "unknown" };

function mergePiece(piece: RegeneratePiece, target: RegenerateTarget): MergeResult {
  if (target.kind === "day") {
    return isDay(piece) ? { kind: "day", day: piece } : { kind: "unknown" };
  }

  if (target.section === "intro") {
    return isIntro(piece) ? { kind: "intro", intro: piece } : { kind: "unknown" };
  }

  if (target.section === "stays") {
    return isStays(piece) ? { kind: "stays", stays: piece.stays } : { kind: "unknown" };
  }

  return isTouches(piece)
    ? { kind: "touches", touches: piece.accessTouches }
    : { kind: "unknown" };
}

function targetKey(target: RegenerateTarget): BusyKey {
  if (target.kind === "day") {
    return `day-${target.index + 1}`;
  }

  return target.section;
}

function isDay(piece: RegeneratePiece): piece is Day {
  return "day" in piece && "narrative" in piece && "highlights" in piece;
}

function isIntro(piece: RegeneratePiece): piece is { title: string; overview: string } {
  return "title" in piece && "overview" in piece;
}

function isStays(piece: RegeneratePiece): piece is { stays: Stay[] } {
  return "stays" in piece;
}

function isTouches(piece: RegeneratePiece): piece is { accessTouches: string[] } {
  return "accessTouches" in piece;
}

function messageFromError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "The drafting service could not complete the request. Please try again.";
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(query.matches);

    handleChange();
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
