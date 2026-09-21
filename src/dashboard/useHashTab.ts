import { useCallback, useEffect, useState } from "react";
import { isTabId, type TabId } from "./tabs";

function tabFromHash(): TabId {
  if (typeof window === "undefined") {
    return "overview";
  }

  const candidate = window.location.hash.replace(/^#/, "");
  return isTabId(candidate) ? candidate : "overview";
}

function writeHash(tab: TabId, mode: "push" | "replace" = "push") {
  if (mode === "replace") {
    const nextUrl = `${window.location.pathname}${window.location.search}#${tab}`;
    window.history.replaceState(null, "", nextUrl);
    return;
  }

  window.location.hash = tab;
}

export function useHashTab(): [TabId, (tab: TabId) => void] {
  const [active, setActive] = useState<TabId>(tabFromHash);

  useEffect(() => {
    const sync = () => {
      const next = tabFromHash();
      setActive(next);

      if (window.location.hash !== `#${next}`) {
        writeHash(next, "replace");
      }
    };

    sync();
    window.addEventListener("hashchange", sync);

    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = useCallback((tab: TabId) => {
    setActive(tab);
    writeHash(tab);
  }, []);

  return [active, select];
}
