# Site Structure

## Sitemap

One route. Sections are anchor targets on a single scrolling page.

```
/                       Single page
├── #  (hero)           Name, role line, subtext
├── #work               Featured Projects (3)
├── #about              Compact experience summary
├── #skills             Grouped capabilities
└── #contact            LinkedIn + GitHub  (lives in the footer)

/robots.txt             Generated
/sitemap.xml            Generated
/opengraph-image        Generated at build time
```

Outbound links (live projects, repos, the OSS docs site, LinkedIn, GitHub) all open in a
new tab with `rel="noopener noreferrer"`.

## Page order and rationale

Hero → Projects → About → Skills → Contact.

Projects sits directly under the hero because it is the reason an engineer opened the page, and
because a recruiter skimming on mobile should hit evidence before biography. About is
deliberately after the projects: the work argues for itself first, the résumé context
supports it second. Skills follow About because they read as an index of the work above
rather than as a standalone claim. Contact is last and also permanently reachable from the
header.

## Navigation

A slim sticky header: the wordmark **MF** on the left (confirmed: initials), linking to top,
and three anchor links on the right — Projects, About, Contact. The wordmark is set in the
display serif and carries an accessible name of "Manuel Figueira — back to top" so the two
letters are not the only thing a screen reader announces. Skills is intentionally omitted
from the nav; four items is one too many for a page this short, and Skills is adjacent to
About anyway.

Behavior:

- Background is transparent at the top of the page and gains a subtle translucent
  background with a hairline bottom border once scrolled — a single class toggle driven by
  an `IntersectionObserver` sentinel, not a scroll event listener.
- Anchor navigation uses native `scroll-behavior: smooth`, disabled under
  `prefers-reduced-motion`.
- Every section has `scroll-margin-top` so anchored headings are not hidden behind the
  sticky header.
- A visually hidden "Skip to content" link is the first focusable element on the page.
- On mobile the nav collapses to the same three links at a smaller size. No hamburger menu
  — three short words fit, and a drawer would be a needless dependency and focus trap.

---

## Section 1 — Hero

**Purpose:** state who this is and what they do, calmly and with authority. Reads like a
product landing page: a lot of space, few words, precise type.

**Content:**

| Slot      | Content                                                 | Notes                                                          |
| --------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| Eyebrow   | **None** (confirmed)                                    | The hero opens directly on the name.                           |
| Name      | **Manuel Figueira**                                     | The largest type on the page. `<h1>`.                          |
| Role line | ✍️ To be written by Manuel                              | Must not contain the word "frontend"                           |
| Subtext   | ✍️ To be written by Manuel                              | ~20–30 words                                                   |
| Actions   | `View work` (anchor to `#work`) and `GitHub` (external) | Two actions, one primary one secondary. Nothing else competes. |

**Constraints for the copy, whatever it ends up saying:**

- _Role line:_ one line, ideally under ten words so it never wraps to three lines on a
  375px screen. It must contain "full-stack" or an equivalent, and must not contain
  "frontend". It is set in Instrument Sans directly beneath the serif name, so it reads as
  a caption to the name rather than as a second headline.
- _Subtext:_ one or two sentences, 20–35 words. Its job is the thing the role line cannot
  say — the specific kind of work, the evidence, or the point of view. If it merely
  restates the role line in more words, it should be cut entirely rather than padded.
- Both should survive being read in two seconds by someone who will not read anything else
  on the page.

Copy for the hero is a **blocking input for M2** — the hero cannot be designed against
placeholder text, because line count and line length determine the composition.

**Constraints:** the name, role line, and at least one action must be visible without
scrolling at 375×667. No full-viewport-height hero that pushes content off screen — the top
of the projects section should peek above the fold on desktop to invite the scroll.

**Interaction:** the entrance sequence. See DESIGN_NOTES.

---

## Section 2 — Featured Projects (`#work`)

**Purpose:** the core of the page. Exactly three cards, no filtering, no "see all" link.

**Layout:** a single-column stack of wide cards rather than a three-up grid. Three cards in
a row reads as a template and squeezes each pitch into a narrow column; full-width cards
give the copy room, scale down to mobile without reflow surprises, and make each project
feel individually considered. Cards are visually numbered `01 / 02 / 03`.

**Per-card anatomy:**

| Element   | Detail                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Index     | `01`, monospace, muted                                                            |
| Title     | Project name                                                                      |
| Pitch     | Exactly two lines of copy — what it is, why it is interesting                     |
| Tech tags | 3–5 tags maximum, monospace, low-contrast until hover                             |
| Links     | `Live` and `Repo` where applicable; each an explicit, individually focusable link |
| Optional  | A one-line role/context note, e.g. "Open-source contribution"                     |

**Card interaction:** pointer-tracked lighting. Specified in DESIGN_NOTES.

**Accessibility note:** the card is _not_ one big link. A card-wide anchor wrapping multiple
links is invalid and hostile to screen readers. Instead the card is an `<article>`, the
title contains the primary link, and the whole card surface is made clickable via a
pseudo-element overlay on that title link — the standard "card link" pattern that keeps one
tab stop for the primary action and separate ones for secondary links.

### Project content plan

**Project 01 — placeholder (personal project, not yet built)**

- Title: `TBD`
- Pitch: two lines of generic-but-plausible copy describing an application. Written so it
  reads as a real product summary rather than lorem ipsum.
- Tags: to be filled from the real stack once known.
- Links: `Live` and `Repo`, both `TBD`.
- Handling while unbuilt: no "coming soon" badge (confirmed). Any link whose URL is absent
  is simply not rendered — the card degrades to title, pitch, and tags rather than showing
  a dead or disabled button. This is enforced by the type: link fields are optional and the
  component renders conditionally.

**Project 02 — placeholder (personal project, not yet built)**

- Same shape as Project 01. The two placeholder cards must not read as clones of each
  other; the draft copy should differentiate them in domain and emphasis so the section
  looks intentional at launch.

**Project 03 — ZetaChain Documentation (real)**

- Title: **ZetaChain Documentation**
- Context line: `Open source · ZetaChain`
- Pitch (draft): _The public documentation platform for ZetaChain, an open-source Next.js
  and Nextra application. I established the repository architecture and hand-built the
  entire UI layer — cards, navigation, links, and every individual documentation component._
- Tags: `Next.js` `React` `Nextra` `TypeScript` `Tailwind CSS`
- Links: Live → `https://www.zetachain.com/docs/` · Repo → `https://github.com/zeta-chain/docs`
- External-link-only by design. No embedded demo, no screenshot mockup.

**Two notes on this card:**

1. _The live site has moved on._ ZetaChain's docs have since been repositioned around their
   Anuma product, so the page a visitor lands on today does not reflect the work described.
   The copy above is therefore written to describe the contribution durably — architecture
   and component authorship — rather than pointing at anything currently on screen. It stays
   accurate as the site continues to change.
2. _No hardcoded repo statistics._ The repository has meaningful traction (hundreds of
   commits, well over a hundred forks), which is tempting to put on the card. It is not
   going on the card, because a number baked into a static build silently goes stale and a
   wrong number is worse than no number. Fetching it live would mean adding runtime data
   fetching to an otherwise fully static page for one line of text. The repo link lets
   anyone who cares see the real figures in one click.

**Content source of truth:** `src/content/projects.ts`, exporting a typed array. Adding real
project data means editing that one file; no component changes. Card order is the array
order.

---

## Section 3 — About (`#about`)

**Purpose:** a short, factual professional summary. Compact by mandate — this is not a bio.

**Content:** two to three short paragraphs, roughly 80–120 words total.

- What kind of engineer, what kind of systems, what the current focus is.
- Experience context: **8 years**. Current or most recent role and company still open.
- One sentence of non-generic personality. One. Optional if it does not land.

**Placeholder handling (confirmed):** the About prose ships as lorem ipsum for now, set to
the same word count and paragraph shape as the final copy so the layout is being designed
against realistic mass rather than against text that will later break it. Two guards
against it escaping:

- The string lives alone in `src/content/about.ts` behind a `// TODO: replace placeholder`
  comment — one file, one edit.
- "No lorem ipsum remains" is an explicit checklist item in the M6 polish pass, and the site
  is not shareable until it clears. Lorem ipsum in an About section is the single most
  damaging thing that could be on this page; everything else degrades gracefully, this does
  not.

A real draft can be written from the facts already available (8 years, React/Next/Node,
Web3 exposure, the ZetaChain work) whenever you want to replace guessing with editing.

**Layout:** a two-column arrangement on desktop — a short section label in a narrow left
column, prose in a wider right column with a constrained measure of about 60–70 characters.
Collapses to one column on mobile. No portrait photo unless one is supplied later; an
awkward or low-quality headshot costs more credibility than the absence of one.

---

## Section 4 — Skills (`#skills`)

**Purpose:** an index of capability, grouped so that the shape of the list communicates the
specialization without stating it.

**Groups, in this order:**

1. **Frontend & UI** — React · Next.js · TypeScript · JavaScript · Tailwind CSS ·
   TanStack Query · SWR · Redux Toolkit
2. **Backend & Systems** — Node.js · Express · tRPC · Prisma · REST · GraphQL ·
   PostgreSQL · MongoDB · Redis · Nginx
3. **Tooling & Delivery** — Git · GitHub Actions · Docker · Vite · Vitest · Turbopack ·
   Vercel · AWS · GCP
4. **Web3** — Solidity · Ethers.js · Wagmi · Viem

Frontend leads and is the most granular group; the client-state and data-fetching tools
were pulled up into it rather than left in a separate "State & APIs" bucket, because that
depth is precisely the signal the brief wants implied rather than stated. Backend is
substantial and credible but flatter. This is the whole strategy in one section.

**Three editorial calls made on the supplied list:**

- **Cloud providers trimmed** from five to three (Vercel, AWS, GCP). DigitalOcean and
  Render are real experience, but listing five hosting providers reads as breadth without
  depth — the reader mentally discounts the whole line. Three is credible; five invites
  doubt.
- **"RPC" folded into tRPC.** As a standalone entry next to REST and GraphQL it is vague,
  and tRPC already carries the meaning concretely.
- **Spoken languages moved out of Skills.** Spanish (native) and English (full professional
  proficiency) are genuinely useful to a recruiter but they are not a technical skill group.
  They go as a single compact line at the end of the About section, where a human reader
  looking for exactly that information will find it.

**Web3 as a fourth group — confirmed.** It does not fold anywhere naturally (Solidity next
to PostgreSQL is incoherent) and dropping it would discard a genuine differentiator that
also explains the ZetaChain card above it. Desktop layout is therefore a **2×2 grid**
rather than a three-column row, collapsing to a single stacked column on mobile. The 2×2 is
arguably the better composition anyway: three uneven columns leave a ragged bottom edge,
while four groups balance. It also puts Frontend & UI in the top-left, first in reading
order, which is where the emphasis belongs.

**Presentation:** each group is a heading plus a list. No proficiency bars, no star
ratings, no logo wall — all three read as junior signals to this audience. Items are plain
text in a monospace face at small size.

---

## Section 5 — Contact (`#contact`)

**Purpose:** one clear closing action.

**Content:** a short closing line (e.g. "Open to full-stack roles and interesting problems")
followed by two links, and no email address or form (confirmed):

- LinkedIn → `https://www.linkedin.com/in/manuel-figueira/`
- GitHub → `https://github.com/Mfigueira`

**Placement:** this is the footer. A separate contact section followed by a footer would
mean two closing moments; merging them keeps the page ending decisive. The footer also
carries a small copyright/built-with line.

**Treatment:** the two links are the largest interactive targets in the footer, with a
clearly visible focus ring and an underline animation on hover — the same motion vocabulary
as the rest of the page, not a new one.

---

## Content inventory

| Item                                                  | Section               | Status                                                     |
| ----------------------------------------------------- | --------------------- | ---------------------------------------------------------- |
| Full name — Manuel Figueira                           | Hero, metadata        | ✅                                                         |
| Wordmark — initials, `MF`                             | Header, icon          | ✅                                                         |
| LinkedIn URL                                          | Contact, metadata     | ✅                                                         |
| GitHub URL                                            | Hero, Contact         | ✅                                                         |
| ZetaChain docs — name, URL, repo, stack, contribution | Projects              | ✅                                                         |
| Skills, all four groups                               | Skills                | ✅                                                         |
| Spoken languages                                      | About                 | ✅                                                         |
| Years of experience — 8                               | About, metadata       | ✅                                                         |
| Domain — `manufigueira.pro`                           | Metadata, sitemap, OG | ✅                                                         |
| No hero eyebrow                                       | Hero                  | ✅ Decided — open on the name                              |
| Web3 as a fourth skills group, 2×2 layout             | Skills                | ✅ Decided                                                 |
| Role line + subtext                                   | Hero                  | ⛔️ **Blocks M2** — being written by Manuel                 |
| Current / most recent role and company                | About                 | 🔸 Open                                                    |
| About prose                                           | About                 | 🔸 Lorem ipsum placeholder, must be replaced before launch |
| Personal project 1 — title, pitch, tags, links        | Projects              | 🔸 Placeholder by design                                   |
| Personal project 2 — title, pitch, tags, links        | Projects              | 🔸 Placeholder by design                                   |
