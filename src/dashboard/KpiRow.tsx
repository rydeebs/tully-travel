import type { ReactNode } from "react";

type KpiRowProps = {
  children: ReactNode;
};

export function KpiRow({ children }: KpiRowProps) {
  return <div className="app-dash-kpi-row">{children}</div>;
}
