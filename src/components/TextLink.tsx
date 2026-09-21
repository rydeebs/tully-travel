import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

type NativeTextLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "children" | "href"
>;

export type TextLinkProps = {
  children?: ReactNode;
  className?: string;
  href?: string;
  style?: CSSProperties;
} & NativeTextLinkProps;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TextLink({
  children,
  className,
  href,
  style,
  type,
  ...rest
}: TextLinkProps) {
  const isLink = Boolean(href);
  const Tag = (isLink ? "a" : "button") as "a" | "button";

  return (
    <Tag
      {...rest}
      className={cx("t-text-link", className)}
      href={href}
      style={style}
      type={isLink ? undefined : (type ?? "button")}
    >
      {children}
    </Tag>
  );
}
