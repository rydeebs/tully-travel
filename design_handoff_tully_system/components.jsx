/* Tully-inspired luxury travel system — base components (React, plain CSS vars from tokens.css)
   Usage: import tokens.css once, then mount these components.
   Every component accepts style + className for one-off overrides. */

const { useState } = React;

const T = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
};

function cx() {
  return Array.prototype.filter.call(arguments, Boolean).join(' ');
}

/* ---------------------------------------------------------------- Eyebrow */
function Eyebrow({ children, tone = 'gold', as: Tag = 'div', style, ...rest }) {
  return (
    <Tag
      style={{
        fontFamily: T.body,
        fontSize: 'var(--size-eyebrow)',
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--ls-eyebrow)',
        textTransform: 'uppercase',
        color: tone === 'gold' ? 'var(--gold)' : tone === 'muted' ? 'var(--muted)' : 'var(--ink)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------- Rule */
function Rule({ tone = 'line', width = '100%', style, ...rest }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        width,
        background: tone === 'gold' ? 'var(--gold)' : 'var(--line)',
        ...style,
      }}
      {...rest}
    />
  );
}

/* -------------------------------------------------------------- Button */
const BUTTON_SIZES = {
  sm: { padding: '10px 20px', fontSize: 'var(--size-small)' },
  md: { padding: '15px 32px', fontSize: 'var(--size-small)' },
  lg: { padding: '19px 44px', fontSize: 'var(--size-body)' },
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  as,
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const Tag = as || (rest.href ? 'a' : 'button');

  const base = {
    fontFamily: T.body,
    fontWeight: 'var(--weight-medium)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 'var(--radius)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'background var(--duration) var(--ease), color var(--duration) var(--ease), border-color var(--duration) var(--ease)',
    opacity: disabled ? 0.4 : 1,
    ...BUTTON_SIZES[size],
  };

  const variants = {
    primary: {
      background: hover && !disabled ? 'var(--charcoal)' : 'var(--ink)',
      color: '#FFFFFF',
      borderColor: hover && !disabled ? 'var(--charcoal)' : 'var(--ink)',
    },
    secondary: {
      background: hover && !disabled ? 'var(--ink)' : 'transparent',
      color: hover && !disabled ? '#FFFFFF' : 'var(--ink)',
      borderColor: 'var(--ink)',
    },
    quiet: {
      background: 'transparent',
      color: hover && !disabled ? 'var(--gold)' : 'var(--ink)',
      borderColor: 'var(--line)',
    },
    invert: {
      background: hover && !disabled ? 'var(--gold)' : '#FFFFFF',
      color: hover && !disabled ? '#FFFFFF' : 'var(--deep-teal)',
      borderColor: hover && !disabled ? 'var(--gold)' : '#FFFFFF',
    },
  };

  return (
    <Tag
      disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- TextLink */
function TextLink({ children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: T.body,
        fontSize: 'var(--size-small)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: hover ? 'var(--gold)' : 'var(--ink)',
        textDecoration: 'none',
        paddingBottom: 4,
        borderBottom: `1px solid ${hover ? 'var(--gold)' : 'transparent'}`,
        transition: 'color var(--duration) var(--ease), border-color var(--duration) var(--ease)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ----------------------------------------------------------- SectionHeader */
function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  size = 'md',
  style,
  ...rest
}) {
  const titleSize = size === 'lg' ? 'var(--size-display-2)' : 'var(--size-display-3)';
  const centered = align === 'center';
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        maxWidth: 'var(--width-text)',
        marginLeft: centered ? 'auto' : undefined,
        marginRight: centered ? 'auto' : undefined,
        ...style,
      }}
      {...rest}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        style={{
          margin: 0,
          fontFamily: T.display,
          fontWeight: 'var(--weight-display)',
          fontSize: titleSize,
          lineHeight: 'var(--lh-display)',
          letterSpacing: 'var(--ls-display)',
          color: 'var(--ink)',
          textWrap: 'pretty',
        }}
      >
        {title}
      </h2>
      <Rule tone="gold" width={48} />
      {description ? (
        <p
          style={{
            margin: 0,
            fontFamily: T.body,
            fontSize: 'var(--size-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--muted)',
            maxWidth: 'var(--width-text)',
            textWrap: 'pretty',
          }}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

/* --------------------------------------------------------------------- Card */
function Card({
  image,
  imageAlt = '',
  eyebrow,
  title,
  description,
  meta,
  href,
  ratio = '4 / 3',
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const Tag = href ? 'a' : 'article';
  return (
    <Tag
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius)',
        boxShadow: hover ? 'var(--shadow-lift)' : 'var(--shadow-soft)',
        transition: 'box-shadow var(--duration) var(--ease)',
        textDecoration: 'none',
        overflow: 'hidden',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ aspectRatio: ratio, overflow: 'hidden', background: 'var(--bg-warm)' }}>
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hover ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 600ms var(--ease)',
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          flex: 1,
        }}
      >
        {eyebrow ? <Eyebrow tone="muted">{eyebrow}</Eyebrow> : null}
        <h3
          style={{
            margin: 0,
            fontFamily: T.display,
            fontWeight: 'var(--weight-display)',
            fontSize: 'var(--size-title)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {title}
        </h3>
        {description ? (
          <p
            style={{
              margin: 0,
              fontFamily: T.body,
              fontSize: 'var(--size-small)',
              lineHeight: 'var(--lh-body)',
              color: 'var(--muted)',
              textWrap: 'pretty',
            }}
          >
            {description}
          </p>
        ) : null}
        {children}
        {meta ? (
          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
            <Rule />
            <Eyebrow tone="muted" style={{ paddingTop: 'var(--space-3)' }}>
              {meta}
            </Eyebrow>
          </div>
        ) : null}
      </div>
    </Tag>
  );
}

/* -------------------------------------------------------------------- Input */
function Input({
  label,
  hint,
  variant = 'underline',
  as = 'input',
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const Tag = as;
  const fieldId = id || `field-${label ? label.replace(/\W+/g, '-').toLowerCase() : 'x'}`;
  const shared = {
    fontFamily: T.body,
    fontSize: 'var(--size-body)',
    lineHeight: 'var(--lh-body)',
    color: 'var(--ink)',
    background: 'transparent',
    width: '100%',
    outline: 'none',
    transition: 'border-color var(--duration) var(--ease)',
  };
  const shapes = {
    underline: {
      border: 'none',
      borderBottom: `1px solid ${focus ? 'var(--gold)' : 'var(--line)'}`,
      borderRadius: 0,
      padding: '12px 0',
    },
    box: {
      border: `1px solid ${focus ? 'var(--gold)' : 'var(--line)'}`,
      borderRadius: 'var(--radius)',
      padding: '16px 18px',
    },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 0, ...style }}>
      {label ? (
        <Eyebrow as="label" tone="muted" htmlFor={fieldId}>
          {label}
        </Eyebrow>
      ) : null}
      <Tag
        id={fieldId}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ ...shared, ...shapes[variant], resize: as === 'textarea' ? 'vertical' : undefined }}
        {...rest}
      />
      {hint ? (
        <span
          style={{
            fontFamily: T.body,
            fontSize: 'var(--size-small)',
            color: 'var(--muted)',
          }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- export */
const Tully = { Eyebrow, Rule, Button, TextLink, SectionHeader, Card, Input };
if (typeof window !== 'undefined') window.Tully = Tully;
if (typeof module !== 'undefined') module.exports = Tully;
