# manufigueira.pro

Personal portfolio for Manuel Figueira, full-stack software engineer.

A single, statically rendered page built on Next.js App Router, React 19, TypeScript and
Tailwind CSS 4, deployed to Vercel.

> **Status: in progress.** The site is built and running, but two of the three featured
> projects are placeholders and the About copy is still lorem ipsum. It is not ready to
> share. See [What's missing](#whats-missing).

---

## The idea

The site is meant to be its own work sample. For the audience it is aimed at — engineers
and hiring managers who will open devtools, tab through the page, and read the repo — a
list of technologies is a weak claim. A page that loads fast, survives keyboard-only
navigation, and contains a couple of interactions that clearly were not pulled from a
template is a much stronger one.

Two consequences shape everything here:

- **Restraint over volume.** Exactly two interactive moments, both of which degrade
  cleanly. Anything that could not survive `prefers-reduced-motion` or a keyboard user was
  cut rather than patched.
- **Full-stack framing, frontend craft.** The word "frontend" appears nowhere as a job
  title. That strength is meant to come through in the execution, and in the ordering and
  granularity of the skills section, rather than being asserted.

Longer reasoning lives in [`docs/`](#documentation).

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Language | TypeScript, `strict` plus `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS 4, CSS-first `@theme` tokens |
| Fonts | Instrument Serif, Instrument Sans, Geist Mono via `next/font` |
| Hosting | Vercel |

**Runtime dependencies: `next`, `react`, `react-dom`. That is the whole list.** No animation
library, no UI kit, no icon package, no state management. The two interactions are CSS plus
a small amount of custom-property plumbing, which costs nothing at runtime and is a more
convincing demonstration than importing 30 kB to fade a heading in.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier, with Tailwind class sorting |

## Project structure

```
src/
├── app/
│   ├── layout.tsx            Fonts, metadata, JSON-LD, landmarks
│   ├── page.tsx              Composes the four sections
│   ├── globals.css           Design tokens + both interactions
│   ├── opengraph-image.tsx   Social card, generated at build time
│   └── icon.svg  robots.ts  sitemap.ts
├── components/
│   ├── layout/               Container, Section, SkipLink, header, footer
│   ├── sections/             Hero, Work, About, Skills
│   └── ui/                   ProjectCard, Spotlight, icons
├── content/                  All copy and data — the only files to edit
├── lib/                      cn()
└── types/                    Project, SkillGroup
```

`src/content/` is deliberately separated from the components. It is the seam between the
design and the facts: swapping a placeholder project for a real one is a one-file edit that
touches no markup.

## How it works

### Server by default

Interactivity is pushed to the leaves, so **the entire site has three client components**:

- `site-header.tsx` — toggles a scrolled style using an `IntersectionObserver` on a
  sentinel, rather than a scroll listener that fires every frame.
- `spotlight.tsx` — a wrapper that reports pointer position. Card content is passed through
  as `children`, so the cards themselves stay server-rendered even though they sit inside a
  client wrapper.
- `current-year.tsx` — a footer year that would otherwise freeze at build time.

The result: layout plus page is about **1.8 kB gzipped** of first-party JavaScript.

The footer year is a small illustration of the same discipline. On a statically prerendered
page a server-computed year freezes at build time, so it is read on the client — but via
`useSyncExternalStore` rather than an effect. That is the API built for values which
legitimately differ between server and client: the build-time year is used for the server
render and for hydration, so the HTML is never empty and there is no mismatch, and React
swaps in the real year once hydration completes. Setting state in an effect would work too,
but it costs an extra render and the React Compiler lint rule rejects it.

### The two interactions

**Hero entrance.** Four lines rise into place behind a clipping mask on load, staggered
70 ms apart, in pure CSS with no JavaScript. One detail worth calling out: the `<h1>` is
the LCP element, and an element sitting at `opacity: 0` does not count as painted — so a
naive fade-in directly inflates Largest Contentful Paint. The heading therefore animates
first, with no delay and a shortened duration, and everything else staggers behind it.

**Pointer-tracked project cards.** A soft light follows the cursor, confined to the card's
1 px border using two masks composited with `mask-composite: exclude`, rather than smeared
across the surface as a blob. The client component writes `--mx` / `--my` inside a single
`requestAnimationFrame` with the layout read batched into the same frame; it holds no React
state, so pointer movement never triggers a re-render. It attaches no listeners at all on
touch devices or under reduced motion, and `:focus-within` gives keyboard users an
equivalent static highlight.

### Accessibility

Treated as a feature, not a final sweep: one `h1` and a clean heading outline, proper
landmarks, a skip link, visible focus rings on everything, external links that announce
themselves, and a `prefers-reduced-motion` path where content simply renders in its final
state. Palette contrast was measured rather than estimated — 16.9:1 for body text, 7.6:1
muted, 4.7:1 for the faintest tier, all against the actual background.

### Performance

Every route prerenders static. Measured on a clean production build:

| | |
|---|---|
| First-load JS, modern browsers | 143 kB gzipped |
| — of which is this site's own code | ~1.8 kB |
| CSS | 6.4 kB gzipped |
| HTML | 7.9 kB gzipped |

Almost all of that 143 kB is React and the App Router client runtime, which ship whether or
not a site uses them.

## What's done

- Scaffold, tooling, strict TypeScript, ESLint, Prettier — builds, lints and typechecks clean
- Design system: tokens, three-role typography, verified contrast
- Hero with the entrance sequence
- Work section: three cards from typed content, with pointer-tracked lighting
- About, Skills (four groups, 2×2), Contact merged into the footer
- SEO: metadata, canonical URL, `Person` JSON-LD, generated OG image, sitemap, robots
- Responsive from 375 px up, verified with no horizontal overflow at any width

## What's missing

**Blocking — the site cannot be shared until these are done:**

- **About copy is lorem ipsum.** `src/content/about.ts`. Everything else on this page
  degrades gracefully; this does not.
- **Hero role line and subtext are placeholders.** `src/content/site.ts`.
- **Two of three projects are placeholders.** `src/content/projects.ts`. Until they exist,
  the ZetaChain card carries the whole Work section.

**Before launch:**

- Full accessibility pass — axe, VoiceOver, keyboard traversal, reduced motion
- Lighthouse run against a production build on mobile
- Real-device responsive check, not only emulated
- Connect `manufigueira.pro` and deploy to Vercel
- Initialise git (no repository exists yet)

The full checklist is in [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).

## Known caveats

- **`npm audit` reports high-severity advisories.** All of them are transitive inside `next`
  itself (`postcss`, `sharp`) or the ESLint toolchain. `npm audit fix --force` wants to
  install `next@9.3.3`. None are reachable from a static site that accepts no user input and
  uses no `next/image`, so they are deliberately left alone.
- **Turbopack costs roughly 19 kB gzipped over webpack** for this app. Not enough to leave
  the default toolchain over, but measured and worth revisiting.
- **No test suite**, by decision. For a static page with two interactions, Lighthouse, axe
  and manual keyboard testing catch the regressions that matter; unit tests here would be
  theatre.

## Documentation

Planning documents written before the build, kept as a record of the reasoning:

| Document | Contents |
|----------|----------|
| [`PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Concept, audience, goals, risks |
| [`SITE_STRUCTURE.md`](docs/SITE_STRUCTURE.md) | Sitemap and per-section content plan |
| [`TECH_PLAN.md`](docs/TECH_PLAN.md) | Architecture, the animation-library tradeoff, measured budgets |
| [`DESIGN_NOTES.md`](docs/DESIGN_NOTES.md) | Typography, palette, spacing, interaction specs |
| [`BUILD_PLAN.md`](docs/BUILD_PLAN.md) | Milestones, status, remaining checklist |
