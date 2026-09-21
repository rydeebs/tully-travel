import type {
  AnchorHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";
import { Eyebrow } from "./Eyebrow";
import { Rule } from "./Rule";

type NativeCardProps = Omit<
  HTMLAttributes<HTMLElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "style" | "children" | "href" | "title"
>;

export type CardProps = {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  href?: string;
  image?: string;
  imageAlt?: string;
  meta?: ReactNode;
  /** Pass ratio={null} to omit the image well entirely. */
  ratio?: string | null;
  style?: CSSProperties;
  title: ReactNode;
} & NativeCardProps;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  description,
  eyebrow,
  href,
  image,
  imageAlt = "",
  meta,
  ratio = "4 / 3",
  style,
  title,
  ...rest
}: CardProps) {
  const Tag = (href ? "a" : "article") as "a" | "article";

  return (
    <Tag {...rest} className={cx("t-card", className)} href={href} style={style}>
      {ratio === null ? null : (
        <div className="t-card__media" style={{ aspectRatio: ratio }}>
          {image ? <img className="t-card__image" src={image} alt={imageAlt} /> : null}
        </div>
      )}
      <div className="t-card__body">
        {eyebrow ? <Eyebrow tone="muted">{eyebrow}</Eyebrow> : null}
        <h3 className="t-card__title">{title}</h3>
        {description ? <p className="t-card__description">{description}</p> : null}
        {children}
        {meta ? (
          <div className="t-card__meta">
            <Rule />
            <Eyebrow className="t-card__meta-label" tone="muted">
              {meta}
            </Eyebrow>
          </div>
        ) : null}
      </div>
    </Tag>
  );
}
