import type { ReactNode } from "react";
import { Eyebrow } from "../components";

type SectionProps = {
  aside?: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  tone?: "white" | "bone";
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Section({ aside, children, eyebrow, title, tone = "white" }: SectionProps) {
  return (
    <section className={cx("app-dash-section", tone === "bone" && "app-dash-section--bone")}>
      {eyebrow || title || aside ? (
        <div className="app-dash-section__header">
          <div className="app-dash-section__copy">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? <h2 className="app-dash-section__title">{title}</h2> : null}
          </div>
          {aside ? <div className="app-dash-section__aside">{aside}</div> : null}
        </div>
      ) : null}
      <div className="app-dash-section__body">{children}</div>
    </section>
  );
}
