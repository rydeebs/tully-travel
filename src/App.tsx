import { useCallback, useState } from "react";
import { Shell } from "./dashboard/Shell";
import { AgentOpsTab } from "./dashboard/tabs/AgentOps";
import { CrmTab } from "./dashboard/tabs/Crm";
import { ErpTab } from "./dashboard/tabs/Erp";
import { FinanceTab } from "./dashboard/tabs/Finance";
import { OverviewTab } from "./dashboard/tabs/Overview";
import { ProposalStats } from "./dashboard/tabs/ProposalStats";
import { useHashTab } from "./dashboard/useHashTab";
import type { TabId } from "./dashboard/tabs";
import { ProposalEngine } from "./screens/proposal/ProposalEngine";

export function App() {
  const [active, setActive] = useHashTab();
  const [exportMode, setExportMode] = useState(false);
  const handleExportModeChange = useCallback((exporting: boolean) => {
    setExportMode(exporting);
  }, []);
  const navigate = useCallback(
    (tab: TabId) => {
      setActive(tab);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [setActive],
  );
  const showProposals = active === "proposals" || exportMode;

  return (
    <Shell active={active} hideSidebar={exportMode} onSelect={navigate}>
      {/* Kept mounted so a draft survives switching tabs. */}
      <div hidden={showProposals === false}>
        <ProposalEngine onExportModeChange={handleExportModeChange} stats={<ProposalStats />} />
      </div>
      {showProposals ? null : <ActiveTab onNavigate={navigate} tab={active} />}
    </Shell>
  );
}

function ActiveTab({ onNavigate, tab }: { onNavigate: (tab: TabId) => void; tab: TabId }) {
  switch (tab) {
    case "agents":
      return <AgentOpsTab />;
    case "crm":
      return <CrmTab />;
    case "erp":
      return <ErpTab />;
    case "finance":
      return <FinanceTab />;
    default:
      return <OverviewTab onNavigate={onNavigate} />;
  }
}
