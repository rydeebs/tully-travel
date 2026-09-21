import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Rule } from "./Rule";

export type SectionHeaderAlign = "left" | "center";
export type SectionHeaderSize = "md" | "lg";

export type SectionHeaderProps = {
  actions?: ReactNode;
  align?: SectionHeaderAlign;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  size?: SectionHeaderSize;
  style?: CSSProperties;
  title: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "title">;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeader({
  actions,
  align = "left",
  className,
  description,
  eyebrow,
  size = "md",
  style,
  title,
  ...rest
}: SectionHeaderProps) {
  return (
    <header
      {...rest}
      className={cx(
        "t-section-header",
        `t-section-header--${align}`,
        `t-section-header--${size}`,
        className,
      )}
      style={style}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="t-section-header__title">{title}</h2>
      <Rule tone="gold" width={48} />
      {description ? <p className="t-section-header__description">{description}</p> : null}
      {actions}
    </header>
  );
}
