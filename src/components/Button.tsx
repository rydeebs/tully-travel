import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "invert";
export type ButtonSize = "sm" | "md" | "lg";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "style" | "children" | "disabled" | "href"
>;

export type ButtonProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  size?: ButtonSize;
  style?: CSSProperties;
  variant?: ButtonVariant;
} & NativeButtonProps;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  as,
  children,
  className,
  disabled = false,
  href,
  size = "md",
  style,
  type,
  variant = "primary",
  ...rest
}: ButtonProps) {
  const Tag = (as ?? (href ? "a" : "button")) as ElementType;
  const isButton = Tag === "button";

  return (
    <Tag
      {...rest}
      aria-disabled={disabled ? true : rest["aria-disabled"]}
      className={cx("t-button", `t-button--${variant}`, `t-button--${size}`, className)}
      disabled={isButton ? disabled : undefined}
      href={href}
      style={style}
      type={isButton ? (type ?? "button") : undefined}
    >
      {children}
    </Tag>
  );
}
