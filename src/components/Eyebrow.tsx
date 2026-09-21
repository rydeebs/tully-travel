import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";

export type EyebrowTone = "gold" | "muted" | "ink";

type EyebrowOwnProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  tone?: EyebrowTone;
};

export type EyebrowProps<T extends ElementType = "div"> = EyebrowOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof EyebrowOwnProps<T>>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Eyebrow<T extends ElementType = "div">({
  as,
  children,
  className,
  style,
  tone = "gold",
  ...rest
}: EyebrowProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      {...rest}
      className={cx("t-eyebrow", `t-eyebrow--${tone}`, className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
