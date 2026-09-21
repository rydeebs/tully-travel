import type { CSSProperties, HTMLAttributes } from "react";

export type RuleTone = "line" | "gold";

export type RuleProps = {
  className?: string;
  style?: CSSProperties;
  tone?: RuleTone;
  width?: number | string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "style">;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Rule({
  className,
  style,
  tone = "line",
  width = "100%",
  ...rest
}: RuleProps) {
  return (
    <div
      {...rest}
      aria-hidden="true"
      className={cx("t-rule", tone === "gold" && "t-rule--gold", className)}
      style={{ width, ...style }}
    />
  );
}
