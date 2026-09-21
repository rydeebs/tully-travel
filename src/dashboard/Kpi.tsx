import type { ReactNode } from "react";
import { Eyebrow } from "../components";
import { Sparkline } from "./charts";

type KpiDelta = {
  direction: "up" | "down" | "flat";
  text: string;
};

type KpiProps = {
  delta?: KpiDelta;
  label: ReactNode;
  note?: ReactNode;
  spark?: number[];
  value: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function deltaPrefix(direction: KpiDelta["direction"]) {
  if (direction === "up") {
    return "▲";
  }

  if (direction === "down") {
    return "▼";
  }

  return "→";
}

export function Kpi({ delta, label, note, spark, value }: KpiProps) {
  return (
    <div className="app-dash-kpi">
      <Eyebrow tone="muted">{label}</Eyebrow>
      <div className="app-dash-kpi__value">{value}</div>
      {delta ? (
        <div
          className={cx(
            "app-dash-kpi__delta",
            delta.direction === "up" && "app-dash-kpi__delta--up",
          )}
        >
          {deltaPrefix(delta.direction)} {delta.text}
        </div>
      ) : null}
      {note ? <p className="app-dash-kpi__note">{note}</p> : null}
      {spark ? (
        <div className="app-dash-kpi__spark" aria-hidden="true">
          <Sparkline highlightLast values={spark} />
        </div>
      ) : null}
    </div>
  );
}
