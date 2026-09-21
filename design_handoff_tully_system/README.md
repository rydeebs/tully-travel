# Handoff: Tully-Inspired Luxury Travel Design System

## Overview
A reusable design system for a luxury-travel web app: a design-token file plus a small set
of base components (Button, TextLink, Eyebrow, Rule, SectionHeader, Card, Input) and a demo
page that exercises the whole system. The aesthetic is understated, editorial luxury —
quiet, confident, expensive; lots of negative space; ink-on-white and ink-on-bone with
antique gold used only as an accent. Editorial magazine layout, never a SaaS dashboard.

Brand feeling to preserve: **access, discretion, trust.** Restraint over decoration.
Nothing shouts. Elegance comes from spacing and type, not from shadows or color.

> Reference feel only. This is an original system inspired by the understated-luxury
> travel category. Do not copy any third-party site's markup, imagery, or distinctive
> branded elements.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show
the intended look and behavior. They are not production code to copy verbatim.

The task is to **recreate this system in the target codebase's existing environment**
(React + CSS modules, Tailwind, Vue, SwiftUI, native — whatever the app already uses),
following that codebase's established patterns, file layout, and component conventions.
If no environment exists yet, pick the framework that best fits the project and implement
the tokens and components there.

`components.jsx` is intentionally dependency-free React with plain CSS custom properties, so
it maps cleanly onto almost any stack:
- **Tailwind**: port `tokens.css` values into `theme.extend` and rewrite components as
  utility-class variants (`cva`/`tailwind-variants` is a good fit for the variant maps).
- **CSS modules / vanilla**: keep `tokens.css` as-is and replace the inline style objects
  with class rules; the hover/focus state that is held in React state here should become
  `:hover` / `:focus-visible` rules.
- **Styled-components / Emotion**: the variant maps translate directly.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interaction states.
Recreate the UI to match, using the codebase's existing libraries where they cover the same
need. Every value in this document is the intended final value.

## Screens / Views

### 1. System demo page (`Tully System.dc.html`)
**Purpose:** a single scrollable page for eyeballing the system — type scale, palette,
components, spacing table. It is a reference surface, not an app screen; the developer
does not need to ship it, but it defines every component's appearance.

**Page shell:** `background #FFFFFF`, `color #1A1A1A`, body font Instrument Sans,
horizontal padding `40px` (the gutter). Every inner section is
`max-width: 1200px; margin: 0 auto`. Full-bleed bands (bone and teal) break out of the
gutter with `margin: 0 -40px; padding: 96px 40px`.

**Section order and layout:**

1. **Hero** — `padding: 96px 0 64px`, vertical flex, `gap: 28px`.
   Eyebrow "DESIGN SYSTEM — V1.0" (gold) → H1 in Cormorant Garamond 300,
   `clamp(44px, 6vw, 76px)`, `line-height 1.1`, `letter-spacing -0.02em`, `max-width 900px`
   → lead paragraph 17px/1.65 `#6B6B6B`, `max-width 680px` → button row (`gap: 16px`,
   primary `lg` + secondary `lg`) → 1px `#E3DED7` rule with `margin-top: 64px`.
   Copy: "A quiet foundation for considered travel." / "Tokens, type and a small set of base
   components. Designed around you — restrained enough to disappear, consistent enough to
   trust." / buttons "Begin a journey", "View the tokens".

2. **Typography** (white) — `padding: 32px 0 96px`. SectionHeader
   (eyebrow FOUNDATIONS / title "Typography"), then eight specimen rows in a
   `grid` with `gap: 40px`. Each row: `grid-template-columns: minmax(0,200px) minmax(0,1fr)`,
   `gap: 24px 48px`, `align-items: baseline`, `border-top: 1px solid #E3DED7`,
   `padding-top: 24px`. Left cell is the 11px/0.18em uppercase muted spec label; right cell
   is the specimen at its real size. Rows: Display 1, Display 2, Display 3, Title, Lead,
   Body, Small, Eyebrow (see Design Tokens for values).

3. **Palette** (bone band `#F7F5F2`) — SectionHeader (FOUNDATIONS / "Palette"), then
   `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`, `gap: 32px`,
   `padding-top: 64px`. Each swatch: a `120px`-tall block with `border-radius: 2px`
   (white and bone swatches add `border: 1px solid #E3DED7` so they read against the band),
   then name at 15px ink and `--token · #HEX` at 13px `#6B6B6B`, `letter-spacing 0.04em`.
   Eight swatches in order: Ink, Charcoal, Background, Bone, Antique gold, Deep teal,
   Hairline, Muted.

4. **Buttons & links** (white) — SectionHeader (COMPONENTS / "Buttons & links"), then a
   `repeat(auto-fit, minmax(260px, 1fr))` grid, `gap: 48px`, sitting under a
   `1px #E3DED7` top border with `padding-top: 48px` inside each column. Three columns:
   Primary (`sm` + `md`, label "Enquire"), Secondary (`sm` "Save for later" + `md` disabled
   "Unavailable"), Quiet & text link (`quiet` "Details" + TextLink "Read the journal").

5. **Cards** (bone band) — SectionHeader (COMPONENTS / "Cards"), then
   `repeat(auto-fit, minmax(280px, 1fr))`, `gap: 32px`, `padding-top: 64px`. Three Cards
   (content below), followed by a 15px muted note about the image placeholder.

6. **Enquiry fields** (white) — SectionHeader (COMPONENTS / "Enquiry fields"), then
   `repeat(auto-fit, minmax(300px, 1fr))`, `gap: 64px`, `align-items: start`.
   Left column (`max-width: 480px`, vertical flex, `gap: 40px`): three Inputs +
   a primary `md` "Send enquiry" button wrapped in a `display: flex` div so it hugs its
   label instead of stretching. Right column: `border-left: 1px solid #E3DED7`,
   `padding-left: 40px`, gold eyebrow "SPACING & LAYOUT", then five label/value rows
   (`display: flex; justify-content: space-between`, muted label, ink value, hairline
   bottom border, `padding-bottom: 12px`): Section rhythm 96–128px, Max content width
   1200px, Text measure 680px, Gutter 40px, Corner radius 2–4px.

7. **Dark footer** (`#123A3A` band) — `display: flex`, `flex-wrap: wrap`, `gap: 48px`,
   `justify-content: space-between`, `align-items: flex-end`.
   Left (`max-width: 520px`): gold eyebrow "DARK SECTION", Cormorant Garamond 300 / 40px /
   1.15 white headline "Designed around you, from the first conversation.", then 17px/1.65
   body in `#D6DEDA`. Right: Button `variant="invert"` "Speak with an advisor".
   Rule: use the teal ground **once per page, at the end**; on it, white type and gold
   eyebrows only.

## Components

All components accept `style` (merged last) and spread remaining props onto the root
element, so they can be extended without forking. Hover/focus are held in React state in
the reference implementation; in a CSS-first codebase use `:hover` / `:focus-visible`.

### Eyebrow
Small uppercase label. Props: `children`, `tone` = `gold` (default) | `muted` | `ink`,
`as` (element, default `div`).
Style: Instrument Sans, `font-size: 11px`, `font-weight: 500`,
`letter-spacing: 0.18em`, `text-transform: uppercase`.
Color: gold `#B08D57`, muted `#6B6B6B`, ink `#1A1A1A`.
Used above section titles ("THE TULLY DIFFERENCE" style), as card metadata, and as form labels.

### Rule
1px hairline divider. Props: `tone` = `line` (default `#E3DED7`) | `gold` (`#B08D57`),
`width` (default `100%`). `aria-hidden`. Section titles use a **48px gold** rule.

### Button
Props: `children`, `variant` = `primary` | `secondary` | `quiet` | `invert`,
`size` = `sm` | `md` (default) | `lg`, `as`, `href` (renders an `<a>` automatically),
`disabled`.
Shared: Instrument Sans, `font-weight: 500`, `letter-spacing: 0.08em`,
`text-transform: uppercase`, `line-height: 1`, `border: 1px solid`,
`border-radius: 2px`, `display: inline-flex`, centered,
`transition: background/color/border-color 260ms cubic-bezier(0.22,0.61,0.36,1)`.
Disabled: `opacity: 0.4`, `cursor: not-allowed`, no hover change.
Never pill-shaped; never more than 4px radius.

| size | padding | font-size |
|---|---|---|
| sm | `10px 20px` | 15px |
| md | `15px 32px` | 15px |
| lg | `19px 44px` | 17px |

| variant | rest | hover |
|---|---|---|
| primary | bg `#1A1A1A`, text `#FFFFFF`, border `#1A1A1A` | bg + border `#2E2E2E` |
| secondary | transparent, text `#1A1A1A`, border `#1A1A1A` | bg `#1A1A1A`, text `#FFFFFF` |
| quiet | transparent, text `#1A1A1A`, border `#E3DED7` | text `#B08D57` |
| invert (for dark grounds) | bg `#FFFFFF`, text `#123A3A`, border `#FFFFFF` | bg + border `#B08D57`, text `#FFFFFF` |

### TextLink
Inline uppercase link with a gold underline appearing on hover.
Style: Instrument Sans 15px, `letter-spacing: 0.06em`, uppercase, `color #1A1A1A`,
`text-decoration: none`, `padding-bottom: 4px`,
`border-bottom: 1px solid transparent`.
Hover: `color #B08D57`, `border-bottom-color #B08D57`. Transition 260ms, same easing.

### SectionHeader
Props: `eyebrow`, `title`, `description`, `align` = `left` (default) | `center`,
`size` = `md` (default) | `lg`.
Layout: vertical flex, `gap: 24px`, `max-width: 680px` (auto side margins when centered).
Order: gold Eyebrow → `<h2>` → 48px gold Rule → muted description.
`h2`: Cormorant Garamond, `font-weight: 300`, `font-size: 40px` (`md`) or `56px` (`lg`),
`line-height: 1.12`, `letter-spacing: -0.02em`, `color #1A1A1A`, `text-wrap: pretty`.
Description: Instrument Sans 17px/1.65, `#6B6B6B`, `max-width: 680px`.

### Card
Props: `image`, `imageAlt`, `eyebrow`, `title`, `description`, `meta`, `href`
(renders `<a>`, else `<article>`), `ratio` (default `4 / 3`), `children`.
Root: vertical flex, `background #FFFFFF`, `border: 1px solid #E3DED7`,
`border-radius: 2px`, `overflow: hidden`, `min-width: 0`.
Shadow: rest `0 1px 2px rgba(26,26,26,0.04)`; hover `0 8px 24px rgba(26,26,26,0.06)`
(260ms). Shadows are deliberately almost invisible — the elegance is in the spacing.
Image well: `aspect-ratio: 4/3`, `overflow: hidden`, `background #F7F5F2` (the bone block
is the placeholder when no `image` is passed). Image `object-fit: cover`,
hover `transform: scale(1.03)` over `600ms` with the shared easing.
Body: `padding: 32px`, vertical flex, `gap: 16px`, `flex: 1`.
- muted Eyebrow
- `<h3>` Cormorant Garamond 300, `28px`, `line-height 1.2`, `letter-spacing -0.01em`, ink
- description Instrument Sans 15px/1.65, `#6B6B6B`, `text-wrap: pretty`
- `children` slot
- `meta` block pinned with `margin-top: auto`, `padding-top: 24px`: a hairline Rule, then a
  muted Eyebrow with `padding-top: 16px`

Demo content (exact copy):
1. AMALFI COAST / "A private villa above Praiano" / "Ten days on a cliff terrace, a boat on
   call, and a cook who shops the morning market before you wake." / "From £14,400 · Seven nights"
2. KYOTO / "Shoulder season, no crowds" / "Temples at opening hour, a tea house that takes no
   bookings, and an interpreter who knows when to stay quiet." / "From £11,900 · Nine nights"
3. PATAGONIA / "The far end of the map" / "A lodge of twelve rooms, a guide to yourself, and
   weather that decides the itinerary each morning." / "From £18,200 · Ten nights"

### Input
Props: `label`, `hint`, `variant` = `underline` (default) | `box`, `as` = `input`
(default) | `textarea` | `select`, `id`, plus all native input props.
Wrapper: vertical flex, `gap: 8px`, `min-width: 0`.
Label: muted Eyebrow rendered as `<label htmlFor>`; `id` auto-derives from the label when
not supplied — in production, generate ids with the codebase's id hook.
Field shared: Instrument Sans 17px/1.65, ink text, transparent background, `width: 100%`,
`outline: none`, `transition: border-color 260ms`.
- `underline`: no border except `border-bottom: 1px solid #E3DED7`, `border-radius: 0`,
  `padding: 12px 0`. Focus → bottom border `#B08D57`.
- `box`: `border: 1px solid #E3DED7`, `border-radius: 2px`, `padding: 16px 18px`.
  Focus → border `#B08D57`.
`as="textarea"` adds `resize: vertical`.
Hint: Instrument Sans 15px `#6B6B6B` below the field.
Accessibility note for production: the reference uses `outline: none` with a border-color
focus cue — add a visible `:focus-visible` treatment that satisfies your a11y bar
(e.g. keep the gold border *and* a 2px gold outline offset).

Demo fields: "Full name" / placeholder "Eleanor Vance"; "Where are you thinking of" /
"Somewhere warm, somewhere quiet"; "Travel window" (`box`) / "Late February, flexible" /
hint "Approximate is fine — we will shape it with you."

## Interactions & Behavior
- **Hover is quiet.** Primary darkens ink→charcoal; secondary inverts to a fill; quiet and
  TextLink shift to gold; Card lifts a barely-there shadow and scales its image 1.03.
  No color "events", no translate/bounce, no scale on buttons.
- **Transitions:** `260ms cubic-bezier(0.22, 0.61, 0.36, 1)` for color/border/shadow;
  `600ms` same easing for the card image scale. Respect
  `prefers-reduced-motion: reduce` by dropping the image transform.
- **Focus:** fields swap their hairline to gold. Buttons and links need a visible
  focus-visible ring in production (see Input note).
- **Disabled:** `opacity: 0.4`, pointer events still blocked via `cursor: not-allowed` and
  the native `disabled` attribute on `<button>`.
- **Responsive:** every grid in the demo is `repeat(auto-fit, minmax(…, 1fr))` and
  collapses to one column on narrow viewports; the hero H1 uses
  `clamp(44px, 6vw, 76px)`. Text columns never exceed 680px. At mobile widths, reduce the
  section rhythm from 96–128px to roughly 64px and the gutter from 40px to 24px.
- **Navigation / handlers:** none in the demo — it is a static reference surface. All
  buttons and links are inert; wire them to the app's router when implementing.

## State Management
The system itself is nearly stateless — this is a component library, not a flow.
- `Button`, `TextLink`, `Card`: local boolean `hover` (replace with CSS `:hover` in a
  CSS-first stack; keep it if the stack is style-object based).
- `Input`: local boolean `focus` driving the border color (again, `:focus-within` is the
  CSS-native equivalent).
- No data fetching, no global state, no context. If the app introduces theming later, the
  tokens are already CSS custom properties on `:root`, so a `[data-theme]` scope is the
  natural extension point.

## Design Tokens
Source of truth: `tokens.css` (CSS custom properties on `:root`). Import once at app root.

**Color**
| token | value | role |
|---|---|---|
| `--ink` | `#1A1A1A` | primary text, primary button fill |
| `--charcoal` | `#2E2E2E` | primary button hover, secondary body text |
| `--bg` | `#FFFFFF` | primary background — most of the page |
| `--bg-warm` | `#F7F5F2` | bone band for alternating sections, image placeholder |
| `--gold` | `#B08D57` | accents only: eyebrows, 48px rules, hover, focus |
| `--gold-deep` | `#967543` | reserved darker gold (text-on-light if ever needed) |
| `--deep-teal` | `#123A3A` | one dark section per page (footer) |
| `--line` | `#E3DED7` | hairline borders and dividers |
| `--muted` | `#6B6B6B` | secondary text, captions, hints |

Gold never fills a large area. The palette is mostly ink-on-white and ink-on-bone.
On teal, use `#FFFFFF` headlines, `#D6DEDA` body, gold eyebrows.

**Typography**
| token | value |
|---|---|
| `--font-display` | `"Cormorant Garamond", "Canela", Georgia, serif` |
| `--font-body` | `"Instrument Sans", "Söhne", "Helvetica Neue", Arial, sans-serif` |
| `--size-display-1` | `76px` |
| `--size-display-2` | `56px` |
| `--size-display-3` | `40px` |
| `--size-title` | `28px` |
| `--size-lead` | `20px` |
| `--size-body` | `17px` |
| `--size-small` | `15px` |
| `--size-eyebrow` | `11px` |
| `--lh-display` | `1.12` |
| `--lh-body` | `1.65` |
| `--ls-display` | `-0.02em` |
| `--ls-eyebrow` | `0.18em` |
| `--weight-display` | `300` |
| `--weight-body` | `400` |
| `--weight-medium` | `500` |

Display sizes are always weight 300. Body copy never below 15px. Eyebrows are the only
uppercase, wide-tracked type.

**Spacing** (8px base, editorial rhythm at the top end)
`--space-1: 4px`, `--space-2: 8px`, `--space-3: 16px`, `--space-4: 24px`,
`--space-5: 32px`, `--space-6: 48px`, `--space-7: 64px`, `--space-8: 96px`,
`--space-9: 128px`. Section-to-section rhythm is `--space-8` to `--space-9`.

**Layout**
`--width-content: 1200px`, `--width-text: 680px`, `--gutter: 40px`.

**Radius, shadow, motion**
`--radius: 2px`, `--radius-lg: 4px`,
`--border-hairline: 1px solid var(--line)`,
`--shadow-soft: 0 1px 2px rgba(26,26,26,0.04)`,
`--shadow-lift: 0 8px 24px rgba(26,26,26,0.06)`,
`--ease: cubic-bezier(0.22,0.61,0.36,1)`, `--duration: 260ms`.

## Copy Tone
Refined, understated, second-person. "Designed around you." "Access that opens doors."
Never salesy, never exclamation points, never feature-listing. Sentences may be long and
calm. Prices are stated plainly and once.

## Assets
- **Fonts** — Google Fonts, loaded in the demo page's head:
  `Cormorant+Garamond:ital,wght@0,300;0,400;1,300` and `Instrument+Sans:wght@400;500`.
  Self-host these (or the licensed equivalents — Canela for display, Söhne/Neue Haas for
  body) in production rather than hotlinking.
- **Images** — none bundled. `Card` renders a bone (`#F7F5F2`) block in its 4:3 well when
  no `image` prop is passed. Real photography should be large, full-bleed where used, with
  restrained captions.
- **Icons** — none. The system deliberately has no iconography; add it only if a real need
  appears, and keep it 1px-stroke and monochrome.

## Files
Bundled in this handoff folder:
- `tokens.css` — the design tokens (CSS custom properties). Drop-in reusable as-is.
- `components.jsx` — reference implementation of all seven components, dependency-free
  React + CSS vars. Exports `{ Eyebrow, Rule, Button, TextLink, SectionHeader, Card, Input }`
  as `window.Tully` / `module.exports`.
- `Tully System.dc.html` — the demo/reference page. It is an HTML prototype built with a
  streaming-preview wrapper (`<x-import>` tags mount the React components); treat the
  markup as a **layout and copy specification**, not code to port. All layout values in it
  are documented above.

Suggested target structure:
```
src/styles/tokens.css        ← from tokens.css
src/components/Button.tsx
src/components/TextLink.tsx
src/components/Eyebrow.tsx
src/components/Rule.tsx
src/components/SectionHeader.tsx
src/components/Card.tsx
src/components/Input.tsx
src/components/index.ts
```

## Suggested prompt for Claude Code
> This folder is a design handoff. Read `README.md` first — it is the full specification.
> Set up `tokens.css` in our styles layer, then implement each component in
> `src/components/` using our existing stack and conventions (not the bundled JSX
> verbatim). Match every color, size, weight, letter-spacing, radius, shadow and
> transition value in the README exactly. Add a Storybook story (or equivalent) per
> component reproducing the states shown in the demo page. Keep the restraint: no extra
> shadows, no gradients, no pill buttons, no new colors.
