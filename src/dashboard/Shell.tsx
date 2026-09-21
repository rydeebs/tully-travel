import { useEffect, useState, type ReactNode } from "react";
import { Eyebrow } from "../components";
import { TABS, type TabId } from "./tabs";

type ShellProps = {
  active: TabId;
  children: ReactNode;
  hideSidebar: boolean;
  onSelect: (tab: TabId) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Shell({ active, children, hideSidebar, onSelect }: ShellProps) {
  const [syncAge, setSyncAge] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSyncAge((current) => (current >= 29 ? 0 : current + 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // In the narrow top-strip layout the active tab can sit off-screen; bring it into view.
  useEffect(() => {
    document
      .querySelector(".app-dash-nav__item--active")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  // Keep one element tree in both modes: swapping wrappers would remount the children
  // and throw away an in-progress proposal draft when entering export.
  return (
    <div className={cx("app-dash-shell", hideSidebar && "app-dash-shell--bare")}>
      <aside
        aria-label="Dashboard sections"
        className="app-dash-sidebar app-no-print"
        hidden={hideSidebar}
      >
        <div className="app-dash-sidebar__top">
          <div className="app-dash-sidebar__brand">
            <div className="app-wordmark">Tully</div>
            <Eyebrow tone="muted">Operating System</Eyebrow>
          </div>
          <nav className="app-dash-nav">
            {TABS.map((tab) => {
              const isActive = tab.id === active;

              return (
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={cx("app-dash-nav__item", isActive && "app-dash-nav__item--active")}
                  key={tab.id}
                  onClick={() => onSelect(tab.id)}
                  type="button"
                >
                  <span className="app-dash-nav__label">{tab.label}</span>
                  <span className="app-dash-nav__status">{tab.status}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="app-dash-sidebar__live">
          <Eyebrow>Live</Eyebrow>
          <p className="app-dash-sidebar__live-title">Synced {syncAge}s ago</p>
          <p className="app-dash-sidebar__live-copy">Week of 21 September 2026</p>
        </div>
      </aside>
      <div className="app-dash-main">{children}</div>
    </div>
  );
}
