import type { ReactNode } from "react";
import { Eyebrow, Rule } from "../components";

type PageHeaderProps = {
  actions?: ReactNode;
  asOf?: string;
  eyebrow: ReactNode;
  lead?: ReactNode;
  title: ReactNode;
};

export function PageHeader({ actions, asOf, eyebrow, lead, title }: PageHeaderProps) {
  return (
    <header className="app-dash-page-header">
      <div className="app-dash-page-header__copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="app-dash-page-header__title">{title}</h1>
        <Rule className="app-dash-page-header__rule" tone="gold" width={48} />
        {lead ? <p className="app-dash-page-header__lead">{lead}</p> : null}
      </div>
      {asOf || actions ? (
        <div className="app-dash-page-header__aside">
          {asOf ? <Eyebrow tone="muted">{asOf}</Eyebrow> : null}
          {actions}
        </div>
      ) : null}
    </header>
  );
}
