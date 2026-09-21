import { useEffect, useState, type ReactNode } from "react";
import { Eyebrow } from "../components";
import logoUrl from "../assets/tully-logo.png";
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
  // Stamped once when the dashboard loads, e.g. "Monday 21 Sep, 10:42 am".
  const [syncedAt] = useState(() => formatSyncTime(new Date()));

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
            <img alt="Tully Luxury Travel" className="app-dash-sidebar__logo" height={50} src={logoUrl} width={602} />
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
          <Eyebrow>Last synced</Eyebrow>
          <p className="app-dash-sidebar__live-title">{syncedAt}</p>
          <p className="app-dash-sidebar__live-copy">Week of 21 September 2026</p>
        </div>
      </aside>
      <div className="app-dash-main">{children}</div>
    </div>
  );
}

function formatSyncTime(date: Date) {
  const day = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
  return `${day}, ${time}`;
}
