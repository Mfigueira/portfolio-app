# Design Notes

## Direction

Dark, editorial, and quiet. The reference point is a well-made product landing page or a
technical publication — generous whitespace, a strict type hierarchy, one accent used
sparingly, and hairline borders instead of shadows and cards-on-cards.

Three principles the design is checked against:

1. **Space is the primary design element.** If a section feels weak, the fix is almost
   always more space and fewer words, not more decoration.
2. **One accent, used rarely.** The accent color appears on interactive affordances and the
   pointer-tracked highlight. If it starts showing up in four places per screen, it has
   stopped meaning anything.
3. **No decoration without a job.** Every border, gradient, and animation either establishes
   hierarchy, communicates state, or is cut.

---

## Typography

Type carries this design. On a page this sparse there is nothing else to hide behind, so
this is the decision worth spending the most time on.

**Decided: Option 3.** The three candidates and their tradeoffs are kept below as a record
of why.

### Option 1 — Geist Sans + Geist Mono

Vercel's family. Excellent on screen, tight defaults, pairs perfectly with the mono.

- **For:** near-zero risk, great numerals, natural fit with the stack.
- **Against:** it is the default of the ecosystem this site is built in. To this specific
  audience, Geist on a Next.js portfolio reads as "did not choose a typeface." That is
  precisely the template signal the brief is trying to avoid.

### Option 2 — Inter Variable + JetBrains Mono

The dependable choice. Superb legibility, huge weight range, optical sizing.

- **For:** never looks bad, well-understood metrics.
- **Against:** the most-used interface typeface on the web. Invisible in the good sense and
  the bad sense. Needs tighter tracking and unusual weight choices to avoid looking generic.

### Option 3 — Instrument Serif (display) + Instrument Sans (UI/body) + Geist Mono (metadata) ✅ **chosen**

A serif for the name and section headings, a neutral sans for everything readable, a mono
for indices and tech tags.

- **For:** the serif at large size gives the hero an editorial confidence that no grotesk
  achieves, and it differentiates the page within the first second. Instrument Sans and
  Instrument Serif are designed as siblings, so the pairing is cohesive rather than clever.
  Three roles, three faces, each with an obvious job — this is the "considered" signal.
- **Against:** three font families to load, and a serif hero is a stronger stylistic
  commitment. If the copy is not tight, a serif makes it look pretentious rather than
  assured.
- **Cost control:** all three are variable fonts loaded via `next/font/google`, Latin subset
  only, self-hosted and preloaded. The serif is used at exactly two sizes and one weight.

**Role assignment — the rule is one face per job, no exceptions:**

| Face             | Used for                                                                | Never used for                           |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| Instrument Serif | The `<h1>` name, section headings (`<h2>`), the `MF` wordmark           | Body copy, buttons, anything below ~24px |
| Instrument Sans  | Role line, subtext, all prose, project titles and pitches, nav, buttons | Headings, meta                           |
| Geist Mono       | Project indices `01/02/03`, tech tags, section eyebrows, skill items    | Anything longer than four or five words  |

The mono is doing a lot of small-text work, which is deliberate: monospace at 13px reads as
_technical annotation_, and it lets the tags and indices sit quietly at low contrast without
looking like an afterthought.

### Scale and treatment (applies to whichever option is chosen)

- Fluid sizing with `clamp()` between a 375px and a 1440px viewport — no breakpoint jumps in
  type size.
- Hero name: roughly `clamp(2.75rem, 8vw, 5.5rem)`, tight tracking (`-0.03em`), line-height
  ~0.95–1.05.
- Section headings: ~`clamp(1.75rem, 4vw, 2.5rem)`.
- Body: 16px mobile / 17–18px desktop, line-height 1.6, measure capped at 65–70 characters.
- Small/meta text: 13–14px monospace, `letter-spacing: 0.02em`, uppercase only for section
  eyebrows.
- Tabular numerals on the project indices so `01 / 02 / 03` align optically.

---

## Color

Dark only. The approach is a **near-neutral dark base with a very slight cool cast** rather
than pure black — pure `#000` with pure `#fff` text is harsh, exaggerates halation on OLED,
and is itself a template tell. Surfaces are differentiated by a handful of steps in
lightness plus hairline borders, never by drop shadows.

Working palette (values are a starting point; each will be verified with a contrast checker
in M2 and adjusted rather than assumed):

| Token              | Value                    | Use                                                            |
| ------------------ | ------------------------ | -------------------------------------------------------------- |
| `--bg`             | `#0A0A0C`                | Page background                                                |
| `--surface`        | `#121216`                | Cards, header when scrolled                                    |
| `--surface-raised` | `#17171C`                | Hover state of a card                                          |
| `--border`         | `rgba(255,255,255,0.08)` | Hairline dividers and card edges                               |
| `--border-strong`  | `rgba(255,255,255,0.14)` | Hover/focus edges                                              |
| `--text`           | `#EDEDF0`                | Primary text — off-white, never `#fff`                         |
| `--text-muted`     | `#A0A0AA`                | Secondary prose, subtext                                       |
| `--text-faint`     | `#7A7A85`                | Meta, tags, indices — tuned up until it clears 4.5:1 on `--bg` |
| `--accent`         | see below                | Links, focus rings, spotlight tint                             |

### Accent

**Decided: warm sand / bone `#E8E0D2`.** Effectively a chromatic near-white — it reads as
expensive and restrained against a cool dark ground, works as both a text and a glow color,
and never fights the content. The accent is warmth rather than hue. (The alternative
considered was muted cyan `#7DD3E8`: more conventionally "technical" and a louder
interactive signal, but much closer to the default palette of every dark developer
portfolio.)

It is the focus-ring color, the hover color for links, the tint of the pointer highlight,
and the selection color. It appears nowhere else at full strength.

One consequence to watch: a warm near-white accent sits close in lightness to `--text`, so
it cannot be the _only_ thing distinguishing an interactive element from static text. Links
therefore always carry a second cue — an underline, an arrow, or a border — which is a
WCAG requirement regardless, but here it is also load-bearing visually.

### Contrast rules

- Body and secondary text: ≥ 4.5:1 against its actual background.
- Large text and UI borders: ≥ 3:1.
- Focus rings: ≥ 3:1 against both the component and the adjacent background, 2px thick with
  a 2px offset.
- Color is never the only carrier of meaning — links are underlined or arrow-marked, not
  just tinted.

---

## Spacing and rhythm

- **Base unit 4px**, using Tailwind's default scale. Arbitrary values are a smell; if a
  spacing value is not on the scale there should be a reason.
- **Container:** `max-w-[68rem]` (~1088px) with 24px gutters on mobile, 40px from `md` up.
  Prose blocks are further constrained to ~`38rem` for measure.
- **Section rhythm:** vertical padding of `clamp(5rem, 12vh, 9rem)`. Identical for every
  section — consistent rhythm is what makes a long scroll feel composed rather than
  assembled.
- **Section internals:** a section eyebrow/heading block sits `2.5rem` above its content.
  Within a project card, a 3-step spacing rhythm only: `0.5rem` (within a text group),
  `1rem` (between groups), `2rem` (between card regions).
- **Hairline dividers** between major sections instead of background color changes. One
  visual device, used consistently.
- **Alignment:** everything hangs off the same left edge on mobile. On desktop, section
  labels sit in a narrow left column and content in a wider right column, creating a single
  strong internal alignment line down the page.

---

## Motion vocabulary

A small, shared set so every transition on the site feels related:

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (a fast-out, long-settle curve
  that reads as "expensive"); `cubic-bezier(0.4, 0, 0.2, 1)` for state changes.
- **Durations:** 150ms for hover/focus state changes, 400–700ms for entrances. Nothing on
  the site animates for longer than 900ms.
- **Properties:** `transform` and `opacity` only, plus `background-position`/custom
  properties for the spotlight. No animating `width`, `height`, `top`, or `box-shadow`.
- **Reduced motion:** a single `@media (prefers-reduced-motion: reduce)` block sets
  animations and transitions to near-zero duration and disables the spotlight and smooth
  scrolling. Content always renders in its final state.

---

## Showpiece 1 — Hero entrance

**Where:** the hero, on page load, once per session-ish (it simply runs on load; no
persistence logic, which would be more machinery than the effect is worth).

**What happens:** the hero composes itself. Each line — name, role line, subtext, actions —
rises a short distance into place behind a clipping mask while fading in, offset from the
previous line by a small delay. Four steps, no eyebrow. The sequence completes in under one
second.
It is not a "text animation"; it should feel like the page settling.

**Specification:**

- Each line lives in a wrapper with `overflow: hidden`; the inner element animates
  `translate3d(0, 110%, 0) → 0` plus `opacity 0 → 1`.
- Stagger: 70ms between lines. Duration: 650ms per line. Easing: the entrance curve above.
  Four lines, so the sequence ends at roughly 860ms.
- **LCP protection:** the `<h1>` is almost certainly the LCP element, and an element that
  starts at `opacity: 0` does not count as painted — a naive fade would directly inflate
  LCP. So the name animates first with **zero delay** and a shortened 350ms duration, and
  the remaining lines stagger behind it. This will be verified with a Lighthouse trace in
  M6; if LCP regresses at all, the `<h1>` drops to transform-only with no opacity change.
- Implementation is pure CSS `@keyframes` with per-line `animation-delay`. No JavaScript,
  no hydration dependency, no flash of unstyled content — the animation begins as soon as
  the CSS parses, which for an inlined critical stylesheet is immediately.
- Under reduced motion the entire hero renders statically with no delay.

**What it demonstrates:** timing and restraint, and a real understanding of the interaction
between entrance animation and Core Web Vitals — which is exactly the kind of detail the
technical audience notices and most portfolios get wrong.

---

## Showpiece 2 — Pointer-tracked project cards

**Where:** the three cards in the Projects section.

**What happens:** as the pointer moves across a card, a soft radial highlight tracks it —
rendered primarily **on the card's border** rather than as a blob on the surface. The card's
1px hairline edge illuminates where the cursor is near it, as if the pointer were a light
source behind the frame. Simultaneously the card's background lifts one step, the tech tags
gain contrast, and the "Live" link's arrow shifts a few pixels. Four coordinated micro-
changes on one gesture, all under 150ms.

The border-glow framing matters: a large radial gradient smeared across the card surface is
the effect every tutorial ships, and it looks cheap. Confining the light to the edge is
quieter, harder to build, and reads as deliberate.

**Specification:**

- A client wrapper attaches one `pointermove` listener, coalesced into a single
  `requestAnimationFrame`, and writes `--mx` / `--my` (pointer position relative to the
  card) and `--glow` (0→1 on enter/leave) as inline custom properties on the card element.
  No React state, therefore no re-render on pointer move.
- The border glow is a `radial-gradient` at `var(--mx) var(--my)` painted into a pseudo-
  element that is masked to the border region via `mask-composite: exclude` on two
  `linear-gradient` masks — the standard technique for gradient borders without a wrapper
  div.
- Listeners are attached only when `(hover: hover) and (pointer: fine)` matches, so touch
  devices ship and run nothing. Touch gets the static hover/active surface change only.
- **Keyboard parity:** `:focus-within` on the card produces an equivalent, non-tracking
  highlight — a static illuminated edge — so keyboard users receive the same affordance
  feedback. Nothing about the effect conveys information, so no state is lost either way.
- **Reduced motion:** tracking is disabled; the card still responds to hover with a plain
  border and background change.
- Performance target: pointer handling stays off the main-thread critical path, no layout
  or paint thrash (compositor-only properties plus a custom-property-driven gradient), no
  dropped frames while moving across all three cards.

**What it demonstrates:** DOM/CSS fluency beyond framework defaults, awareness that pointer
handlers are a performance liability if done naively, and — most importantly — that the
interaction was designed for keyboard, touch, and reduced-motion users rather than only for
a mouse on a 27-inch display. That last part is the actual craft signal.

---

## Detail-level touches

Small things, individually invisible, collectively the difference between polished and
adequate:

- Custom text selection color drawn from the accent.
- Custom `:focus-visible` ring, consistent across every interactive element.
- Sticky header gains its background via `backdrop-filter` with a `@supports` fallback to a
  solid color.
- Link underlines drawn with `background-image` so the underline can animate in from the
  left rather than appearing instantly.
- `scroll-margin-top` on every anchor target so headings clear the sticky header.
- Tabular, aligned project indices.
- A styled OG image built with the site's own type and palette.
- Sensible `::-moz-selection`, caret color, and `color-scheme: dark` so native UI (scrollbars,
  form chrome) matches.

---

## Open design questions

None blocking. Two things will only be resolved by looking at the real thing in a browser:

- Whether the hero eyebrow earns its place, which depends on whether there is a location or
  availability line worth showing.
- The exact value of `--text-faint`. It is specified above at `#7A7A85`, but the tags and
  indices need to be quiet without failing contrast, and that balance is decided against a
  real screen with a contrast checker open, not in a document.
