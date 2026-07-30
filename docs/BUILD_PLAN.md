# Build Plan

Milestones were meant to be reviewed one at a time. That gate was waived in order to get
something viewable quickly, so **M1 through M5 were built in a single pass** and are marked
below with what was actually done rather than what was intended. M6 is untouched.

| Milestone                                           | Status         |
| --------------------------------------------------- | -------------- |
| M1 — Scaffold and layout shell                      | ✅ Done        |
| M2 — Design system, hero, entrance animation        | ✅ Done        |
| M3 — Project cards with content data                | ✅ Done        |
| M4 — Pointer-tracked card interaction               | ✅ Done        |
| M5 — About, Skills, Contact                         | ✅ Done        |
| M6 — Polish: SEO, a11y, performance, responsiveness | ◻️ Not started |

---

## M1 — Scaffold and layout shell ✅

**Done means:** the project builds, lints, typechecks, and serves a page with header, main,
and footer landmarks.

- Next.js 16.2.12, React 19.2.8, TypeScript strict, Tailwind CSS 4.3.3, all pinned.
- `create-next-app` could not be used: it probes the _parent_ directory for write access and
  the workspace parent is not writable here. Scaffolded by hand instead, which also avoided
  boilerplate that would have been deleted.
- `tsconfig.json` runs strict plus `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`.
- ESLint uses `eslint-config-next`'s flat config exports directly. The `FlatCompat` approach
  crashed with a circular-structure error against v16, so `@eslint/eslintrc` was removed.
- `next.config.ts` sets `poweredByHeader: false` and three security headers.
- Layout primitives: `Container`, `Section`, `SkipLink`, `SiteHeader`, `SiteFooter`.

## M2 — Design system, hero, entrance animation ✅

**Done means:** tokens are defined once, the type system is applied, and the hero animates
without hurting LCP.

- Tokens declared in `@theme` in `globals.css`. Contrast measured rather than assumed —
  text 16.9:1, muted 7.6:1, faint 4.7:1, accent 15.1:1 against the background. `--text-faint`
  clears 4.5:1, which was the value most at risk.
- Instrument Serif / Instrument Sans / Geist Mono via `next/font`, self-hosted, three
  preloaded woff2 files, one role each.
- Hero entrance: four staggered lines, CSS keyframes only, no JavaScript. The `<h1>` runs
  first at 350ms with no delay because an element at `opacity: 0` does not count as painted.
- Lines containing focusable elements use an unmasked variant, since `overflow: hidden`
  would crop the focus ring.

## M3 — Project cards with content data ✅

**Done means:** three cards render from a typed content file and degrade correctly when a
project has no links.

- `src/content/projects.ts` is the only file to edit when a real project replaces a
  placeholder.
- Cards are a single-column stack of wide cards, not a three-up grid.
- Card is an `<article>`; the primary link sits on the title with an inset pseudo-element
  extending its hit area across the card. One tab stop for the primary action, one for
  `Source`.
- A secondary link is only rendered when it is not the URL the card already points at, so
  there are no duplicate links to the same destination.
- Placeholder cards render with no links at all rather than dead or disabled buttons.

## M4 — Pointer-tracked card interaction ✅

**Done means:** the effect works with a mouse, has a keyboard equivalent, and does nothing
on touch or under reduced motion.

- Light is confined to the card's 1px border using two masks composited with
  `mask-composite: exclude`, plus a 4.5%-opacity surface wash. Verified in the compiled CSS.
- `Spotlight` is the only interactive component in the Projects section; it holds no React state
  and re-renders never. Pointer coordinates are written to `--mx` / `--my` inside a single
  `requestAnimationFrame`, with the layout read batched into the same frame.
- Listeners are not attached at all when `(hover: hover) and (pointer: fine)` fails or
  reduced motion is set.
- `:focus-within` gives keyboard users a static illuminated edge.
- Verified by driving Chrome over the DevTools protocol: synthesising real pointer moves
  produced `--mx: 246px`, `--glow: 1`, and a visibly illuminated edge.

## M5 — About, Skills, Contact ✅

**Done means:** all remaining sections render with real content where it exists.

- About uses lorem ipsum sized to the final copy, isolated in `src/content/about.ts` behind
  a `TODO`. Spoken languages sit at the end of this section.
- Skills renders four groups in a 2×2 grid, Frontend & UI first.
- Contact is merged into the footer with LinkedIn and GitHub.
- Heading outline verified from the served HTML: one `h1`, an `h2` per section, `h3` per
  project and per skill group, no level skips.

## M6 — Polish pass ◻️

**Done means every item below is checked, not assumed.**

**Content — blocking**

- [ ] Final hero role line and subtext replace the placeholder in `src/content/site.ts`.
- [ ] About prose replaces the lorem ipsum. **The site cannot be shared until this is done.**
- [ ] Current or most recent role and company decided for the About copy.

**Accessibility**

- [ ] axe DevTools pass at mobile and desktop widths, zero violations.
- [ ] Full keyboard traversal: skip link, nav, both hero actions, card links, footer links.
- [ ] VoiceOver pass over the landmark and heading structure.
- [ ] Reduced-motion pass with the OS setting enabled.
- [ ] Re-verify contrast on any color adjusted after M2.

**Performance**

- [ ] Lighthouse mobile, all four categories ≥ 95, run against a production build.
- [ ] Confirm the hero entrance does not inflate LCP; if it does, drop the `<h1>` to
      transform-only.
- [ ] Re-measure Turbopack against webpack; decide whether the ~19 kB gz difference is worth
      changing the build.
- [ ] Confirm no layout shift from font loading.

**Responsiveness**

- [ ] Real-device check at 375px and on a physical phone, not only emulated.
- [ ] Verify the 390–640px range where Skills is one column and cards are at their narrowest.
- [ ] Landscape phone and 1440px+ desktop.

**SEO and metadata**

- [ ] Validate the generated OG image and the `Person` JSON-LD.
- [ ] Confirm canonical URL and sitemap once `manufigueira.pro` is connected.

**Housekeeping**

- [ ] Initialise git and commit. _(Not done — no repository has been created yet.)_
- [ ] Deploy to Vercel so every later review happens on a real URL.
- [ ] Decide on `@vercel/analytics` and `@vercel/speed-insights`.

---

## Known issues and deferred decisions

- **`npm audit` reports 12 high-severity advisories.** Every one is transitive inside `next`
  itself (`postcss`, `sharp`) or the ESLint toolchain (`brace-expansion`, `minimatch`).
  `npm audit fix --force` wants to install `next@9.3.3`, which is absurd. None are reachable
  from a static site that ships no user input and no `next/image` usage. Left alone
  deliberately; revisit when Next ships updated transitives.
- **First-load JS is 143 kB gz, not the 90 kB originally budgeted.** See TECH_PLAN for the
  measurement and why the original number was never achievable.
- **Two of three projects are placeholders**, so the Projects section rests on the ZetaChain
  card until the personal projects exist.
- **No test suite**, by decision. Lighthouse, axe, and manual keyboard testing are the checks
  that would catch real regressions here.
