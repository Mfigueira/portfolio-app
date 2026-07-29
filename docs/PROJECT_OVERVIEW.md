# Project Overview

## What this is

A single-page personal portfolio for a Full-Stack Software Engineer. It presents three
featured projects, a compact professional summary, a grouped skills breakdown, and two
contact links — and nothing else.

The organizing idea is that **the site is itself a work sample**. The strongest claim a
frontend-capable engineer can make is not a list of technologies; it is a page that loads
instantly, behaves correctly under keyboard navigation, holds up on a phone, and contains
one or two interactions that are obviously hand-built rather than pulled from a template.
Everything in this plan serves that claim.

## What this is not

- Not a resume transcribed into HTML. No timeline widget, no year-by-year job history, no
  skill percentage bars.
- Not an animation showreel. Two deliberate interactive moments, both of which degrade
  cleanly. Anything that cannot survive `prefers-reduced-motion` or a keyboard-only user is
  cut.
- Not a template. No stock hero illustration, no gradient-blob background, no card grid
  with a generic lift-on-hover shadow.
- Not a blog, and not a CMS-backed site. Content lives in typed TypeScript files.

## Audience

Ranked by how much their reaction matters:

1. **Engineers and engineering managers** conducting a technical screen. They will open
   devtools, tab through the page, check the Network panel, and look at the repo. They are
   the reason accessibility and performance are treated as features rather than chores.
2. **Recruiters and hiring managers**, often on mobile, often for under 30 seconds. They
   need the role, the seniority signal, and a way to reach out — visible without scrolling
   far and legible at a glance.
3. **Peers and collaborators** arriving from a GitHub profile or a shared link.

The design tension between (1) and (2) is resolved by ordering, not by adding content: the
top of the page answers "who is this and what do they do," and the depth that engineers
want sits just below it.

## Positioning

The role line reads as **full-stack**. The word "frontend" does not appear as a job title
anywhere on the site. Frontend strength is communicated through three channels instead:

- **Craft.** Typography, spacing discipline, motion quality, and interaction detail that a
  frontend-literate reader will recognize as non-default.
- **Ordering.** In the Skills section, "Frontend & UI" is the first group and the most
  specific one. Depth of vocabulary does the work that a label would have done.
- **Evidence.** Lighthouse scores, semantic markup, and a keyboard-complete interface are
  claims that can be verified in the browser rather than asserted in prose.

## Goals

| # | Goal | How we will know it is met |
|---|------|----------------------------|
| 1 | A visitor knows the role and seniority within five seconds | Hero is legible above the fold on a 375px viewport with no scrolling |
| 2 | The three projects are scannable and clickable | Each card states its pitch in two lines; every card's primary action is reachable in one tab stop |
| 3 | The site reads as hand-built | Two interactions that no template ships with, both reduced-motion aware |
| 4 | Verifiable technical quality | Lighthouse ≥ 95 across all four categories on mobile; zero axe-core violations; no console errors |
| 5 | Content is trivially updatable | Swapping a placeholder project for a real one is a single-file edit in `src/content/` |
| 6 | Fast on a real phone | Largest Contentful Paint under 1.5s on a simulated 4G connection; near-zero JavaScript shipped for content |

## Locked decisions

These were confirmed before planning and are treated as fixed inputs:

- **Dark theme only.** No light mode, no toggle. One state, done properly.
- **Single scrolling page.** No project detail routes. Projects are hosted elsewhere; cards
  link out to their own sites or subdomains.
- **Two interactive moments.** A pointer-tracked project card treatment, and a hero
  entrance sequence that runs once on load.
- **Contact is LinkedIn and GitHub only.** No email, no contact form, no backend.
- **No resume download.**
- **The two unbuilt personal projects are generic but strongly typed**, driven by a single
  content file so real details drop in without touching components.
- **Typography:** Instrument Serif (display) + Instrument Sans (UI) + Geist Mono (metadata).
- **Accent:** warm sand `#E8E0D2`, used only on interactive affordances and the card
  highlight.
- **No animation library.** Both interactions are CSS plus custom properties.

Subject: **Manuel Figueira**, 8 years' experience, deploying to `manufigueira.pro`.

## Open risks

- **Two of three projects are placeholders.** The projects section is the page's center of
  gravity and it is two-thirds hypothetical at launch. Mitigation: the section is built so
  it looks deliberate with generic copy rather than obviously unfinished, and the real
  content is a one-file swap. Until they exist, the ZetaChain documentation card carries the
  entire evidentiary load of the section — which it can, being real, public, and
  substantial, but it is one card doing three cards' work. If the projects stay unbuilt for
  long this becomes the weakest part of the site, and no amount of polish elsewhere
  compensates.
- **A single hover interaction carrying the "proof of craft" claim** must be genuinely well
  executed. A mediocre version of this is worse than none, because it invites the exact
  scrutiny it fails. The hero entrance was added partly to distribute this risk.
- **Restraint reads as "empty" if the typography is not right.** On a page this sparse,
  type and spacing are the design. This is the highest-leverage area and where the most
  iteration time should go.
