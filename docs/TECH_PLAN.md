# Technical Plan

## Stack

Versions below are the current latest on npm as of planning and will be pinned at scaffold
time.

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js, App Router | 16.2.x |
| UI | React | 19.2.x |
| Language | TypeScript, `strict: true` | 5.x |
| Styling | Tailwind CSS v4 (CSS-first config) | 4.3.x |
| Fonts | `next/font/google` — Instrument Serif, Instrument Sans, Geist Mono | — |
| Hosting | Vercel | — |
| Linting | ESLint (`next/core-web-vitals`) + Prettier + `prettier-plugin-tailwindcss` | — |
| A11y checks | `eslint-plugin-jsx-a11y`, plus manual axe DevTools passes | — |

Notes on Tailwind v4: configuration is CSS-first via `@theme` in `globals.css` rather than
a `tailwind.config.js`. The design tokens from DESIGN_NOTES are declared there as CSS custom
properties, which means the same tokens are available to hand-written CSS (needed for the
pointer-tracking interaction) without duplication.

## The animation decision

This is the main library question, so it gets a real comparison. Two interactions are in
scope: a one-shot hero entrance, and pointer-tracked lighting on project cards.

### Option A — CSS and Web Animations only, no library **(recommended)**

Hero entrance is CSS `@keyframes` with staggered `animation-delay`, triggered by a class on
mount (or purely on load, since the hero is above the fold and needs no scroll trigger).
Card lighting is a small client component that writes pointer coordinates into CSS custom
properties; all visual work happens in CSS via `radial-gradient` and `transform`.

- **Bundle cost:** zero. Nothing added to the client JavaScript payload.
- **Performance:** animations run on the compositor. Pointer updates write two custom
  properties inside a `requestAnimationFrame` callback; no React re-render per pointer move.
- **Craft signal:** for an audience that opens devtools, a portfolio that achieves its motion
  with no animation dependency is a stronger statement than one importing 30kB to fade a
  heading in.
- **Cost:** orchestration is manual. Stagger is hand-tuned delays; there is no timeline API.
  With two interactions this is a small amount of code, but it would not scale to ten.
- **Reduced motion:** handled in one `@media (prefers-reduced-motion: reduce)` block.

### Option B — Motion (`motion`, formerly Framer Motion) 12.x

- **Bundle cost:** roughly 30–34kB gzipped for the standard React bundle; the `motion/react-m`
  lazy-features path can cut this substantially but adds setup complexity.
- **Benefits:** declarative variants and stagger, spring physics, `useScroll`/`useSpring`
  utilities, `AnimatePresence` for exit animations.
- **Why it is not needed here:** there are no exit animations, no layout animations, no
  presence transitions, and no scroll-linked timeline. Every feature that justifies the
  bundle is out of scope. Springs are the one genuine loss, and a well-chosen
  `cubic-bezier` covers the two cases in this design.
- **When to revisit:** if a future iteration adds page transitions, a modal/lightbox, or a
  scroll-driven sequence, adopting Motion at that point is straightforward and the tradeoff
  flips.

### Option C — Hybrid: CSS for the hero, Motion only for cards

Worst of both. Pays the full bundle cost for one interaction that CSS handles better,
because pointer-tracked gradients are a custom-property problem, not a spring problem.

### Decision

**Option A.** Revisit only if the interaction inventory grows. If tuning the hero entrance
by hand proves frustrating in M4, the fallback is Option B scoped to that one component —
noted here so the decision can be reversed without renegotiating the plan.

## Other dependencies

Deliberately minimal. The full intended runtime dependency list:

- `next`, `react`, `react-dom` — the framework.
- `clsx` + `tailwind-merge` (~3kB combined) — a `cn()` helper for conditional classes.
  Small enough to be worth it; if it ends up used in fewer than five places, it gets
  replaced by a three-line local helper and dropped.

Everything else is a devDependency. Explicitly **not** used: no UI component library, no
icon library (the handful of icons needed are inlined as SVG components, which also avoids
shipping an icon font or a tree-shaking gamble), no state management library, no CMS
client, no analytics beyond optionally `@vercel/analytics` and `@vercel/speed-insights`,
which are opt-in at deploy time.

## Folder structure

```
portfolio-app/
├── docs/                          Planning documents (this folder)
├── public/
│   └── (static assets, og fallback image)
├── src/
│   ├── app/
│   │   ├── layout.tsx             Root layout: fonts, metadata, <html lang>, skip link
│   │   ├── page.tsx               The single page: composes the section components
│   │   ├── globals.css            Tailwind import, @theme tokens, base + custom CSS
│   │   ├── icon.svg               Favicon
│   │   ├── opengraph-image.tsx    Build-time OG image via next/og
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx    Sticky nav (client: scroll state)
│   │   │   ├── site-footer.tsx    Doubles as the contact section
│   │   │   ├── container.tsx      Max-width + gutter wrapper
│   │   │   ├── section.tsx        <section> with id, scroll-margin, vertical rhythm
│   │   │   └── skip-link.tsx
│   │   ├── sections/
│   │   │   ├── hero.tsx
│   │   │   ├── work.tsx
│   │   │   ├── about.tsx
│   │   │   └── skills.tsx
│   │   └── ui/
│   │       ├── project-card.tsx   Card markup and content (server)
│   │       ├── spotlight.tsx      Pointer tracking wrapper (client)
│   │       ├── section-heading.tsx
│   │       ├── tech-tag.tsx
│   │       ├── external-link.tsx  Link with rel/target + a11y "(opens in new tab)"
│   │       └── icons.tsx          Inlined SVGs
│   ├── content/
│   │   ├── site.ts                Name, role line, subtext, social URLs, SEO strings
│   │   ├── projects.ts            The three projects, typed
│   │   ├── skills.ts              The three skill groups
│   │   └── about.ts               About prose
│   ├── lib/
│   │   └── cn.ts
│   └── types/
│       └── content.ts             Project, SkillGroup, SiteConfig types
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── prettier.config.mjs
├── tsconfig.json
└── package.json
```

Rationale for `src/content/` as a separate top-level concern: it is the seam between the
design and the facts. Keeping all copy and data there — rather than inline in JSX — is what
makes "swap in a real project" a one-file edit, and it makes the eventual placeholder
replacement a diff a reviewer can read.

## Component architecture

Two rules govern the structure:

1. **Server by default.** A component becomes a client component only when it needs an
   event handler, a browser API, or state. Everything else stays on the server and ships no
   JavaScript.
2. **Push the client boundary to the leaves.** Interactivity is isolated into the smallest
   possible wrapper so it never forces its children to become client components.

### Server / client split

| Component | Kind | Why |
|-----------|------|-----|
| `layout.tsx`, `page.tsx` | Server | Static composition |
| `hero.tsx` | Server | The entrance animation is pure CSS, keyed off page load — no JS |
| `work.tsx`, `about.tsx`, `skills.tsx` | Server | Static content rendering |
| `project-card.tsx` | Server | Renders card content; receives the client `Spotlight` as a wrapper |
| `spotlight.tsx` | **Client** | `pointermove` listener, `rAF` throttle, writes CSS custom properties |
| `site-header.tsx` | **Client** | Toggles a scrolled state via `IntersectionObserver` |
| `site-footer.tsx` | Server | Static links |
| `current-year.tsx` | **Client** | Reads the year on the client so it does not freeze at build time |

That is **three client components on the entire site**. The card content is passed to
`Spotlight` as `children`, so the cards themselves — the bulk of the page's markup — are
still server-rendered even though they sit inside a client wrapper. This is the pattern
worth getting right: it is the difference between a portfolio that ships ~2kB of JS and one
that ships 80kB.

### The `Spotlight` component

```tsx
'use client'
// Receives server-rendered children. On pointermove, writes --mx / --my (and a
// --spotlight-opacity for enter/leave) to the wrapper element inside a single
// requestAnimationFrame. No React state, therefore no re-render per pointer event.
// Skipped entirely when (hover: none) or prefers-reduced-motion: reduce.
```

The visual effect is defined entirely in CSS in `globals.css`, consuming those custom
properties. The React layer only reports coordinates.

## Rendering, data, and performance

- The page is **fully static** — `export const dynamic = 'force-static'`, prerendered at
  build time, served from Vercel's edge cache. There is no runtime data fetching anywhere.
- **Fonts** are loaded through `next/font`, self-hosted with `display: swap` and preloaded,
  with a `size-adjust`-matched fallback so there is no layout shift. Only the weights
  actually used are loaded.
- **Images:** the design uses almost none. Any image that is added goes through
  `next/image` with explicit dimensions.
### Measured payload

The 90kB first-load JS budget originally written here was wrong, and measuring it after M1–M5
is what surfaced that. Actual figures from a clean production build:

| | Turbopack (default) | webpack (`--webpack`) |
|---|---|---|
| Executed JS, all `<script>` tags | 181.7 kB gz | 162.5 kB gz |
| Less the `noModule` polyfill chunk modern browsers skip | **143.2 kB gz** | **124.0 kB gz** |
| Of which is this site's own code | ~1.8 kB | ~1.8 kB |
| CSS | 6.4 kB gz | — |
| HTML | 7.9 kB gz | — |
| Fonts, three preloaded woff2 | ~132 kB | — |

Two conclusions:

1. **The architecture is doing its job.** Layout plus page is 1.8kB. Everything above that is
   React and the App Router client runtime, which ship whether or not the site uses them.
   A 90kB target was never reachable with App Router; it was a number written from memory
   rather than from measurement.
2. **Turbopack currently costs ~19 kB gz over webpack** for this app. Not enough to abandon
   the default toolchain, but worth re-measuring at the M6 polish pass and worth knowing.

Revised budgets, to be verified in M6: LCP under 1.5s on simulated 4G/mobile, CLS under
0.01, zero long tasks over 50ms after hydration, and no growth in first-party JS beyond
~5 kB gz as the remaining sections land.

## Accessibility approach

Treated as an acceptance criterion for every milestone, not a final sweep.

- Correct landmarks: one `<header>`, one `<main>`, one `<footer>`, `<section>` elements with
  `aria-labelledby` pointing at their headings.
- A single `<h1>` (the name), `<h2>` per section, `<h3>` per project title. No level skips.
- Visible, high-contrast focus indicators everywhere — a custom `:focus-visible` ring, never
  `outline: none`.
- Full keyboard operability. The pointer interaction is decorative; it has a `:focus-within`
  equivalent so keyboard users get comparable feedback, and no information is conveyed by
  the effect alone.
- `prefers-reduced-motion: reduce` disables the hero entrance (content renders in its final
  state immediately), the spotlight, and smooth scrolling.
- All text meets WCAG AA — 4.5:1 for body, 3:1 for large text and UI boundaries. Muted text
  colors are chosen against the actual surface color, not guessed.
- Icon-only links have accessible names; external links announce that they open a new tab.

## SEO and metadata

- Next.js Metadata API in `layout.tsx`: title, description, `metadataBase` of
  `https://manufigueira.pro`, canonical URL, `openGraph`, `twitter`, `robots`.
- `opengraph-image.tsx` generates the social card at build time using `next/og`, styled with
  the site's own type and palette — a small but visible detail when the link is shared.
- `Person` JSON-LD structured data: `name`, `jobTitle`, `url`, and `sameAs` pointing at
  `github.com/Mfigueira` and `linkedin.com/in/manuel-figueira`. This is what associates the
  domain with the identity for search engines, and it is three minutes of work.
- Generated `sitemap.xml` and `robots.txt`.
- `lang="en"` on `<html>`, descriptive `<title>`, meaningful link text throughout.

## Tooling and workflow

- Git initialized at the start of M1; one commit per milestone at minimum.
- `npm run lint` and `tsc --noEmit` must pass before a milestone is considered done.
- Prettier with the Tailwind class-sorting plugin so class order stays deterministic.
- Deployed to Vercel from the first milestone, so every subsequent review happens on a real
  URL on a real device rather than on localhost.
- No test suite is planned. For a static single-page site with two interactions, Lighthouse,
  axe, and manual keyboard testing are the checks that would actually catch regressions;
  unit tests here would be theatre. This is a deliberate call and can be revisited if the
  site grows logic worth testing.
