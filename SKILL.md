---
name: anti-ai-slop-web
description: Build, redesign, or audit websites and UI so they do not look AI-generated while staying usable and accessible. Fights the "AI slop" look developers complain about (purple gradients, Inter everywhere, centered hero plus three identical cards, emoji icons, glassmorphism, default shadcn/Tailwind, invented metrics, filler copy) and builds a consistent identity like well-known product companies have. Use whenever the user asks for a landing page, website, dashboard, portfolio, company profile, SaaS page, web app UI, theme, redesign, design system, or "make it look professional/premium/expensive/custom", or says a design looks generic, templated, vibe-coded or AI-made, even without mentioning slop. Juga untuk bikin/bikinin website atau landing page, "kok kayak buatan AI", "terlalu generik", "biar keliatan mahal/profesional/beda". Also scans codebases for AI tells before shipping.
---

# Anti AI Slop Web

Language models write the statistical average of every site they were trained on. Ask for "a clean modern landing page" and the average comes back: a purple-to-blue gradient, Inter, a centered hero, three rounded cards with icons, a testimonial strip, a CTA. The purple has a traceable origin (a Tailwind UI default of `bg-indigo-500` that thousands of tutorials copied), and the loop feeds itself because generated sites become new training data.

Nothing in that look is individually wrong. The problem is that none of it was chosen. Visitors read an unchosen default as "nobody cared about this product". This skill forces real decisions before code is written, then checks that the defaults did not creep back.

The goal is a site that is both more distinctive and at least as usable as the default. A page that avoids every tell but is confusing, inaccessible, or ugly has failed. Read "Stay smart" below before anything else; it is what keeps this skill from making the work worse.

## Stay smart: guardrails against overcorrection

Skills that ban things tend to make models rigid, so the output swaps one default for another or becomes strange for the sake of being different. Hold these instead:

1. **The user's request and brand win.** If they have a design system, brand colors, a font, a reference site, or a stated preference (even Inter, even purple), use it. Differentiate through everything else. Say in one line what you kept and why. Never lecture them about slop.
2. **Rules are priors, not laws.** A tell is evidence of an unmade decision. If a flagged item was made on purpose and fits the brief (Linear-style restrained dark UI for a developer tool, a purple brand, a three-column pricing table), keep it and say so. The scanner finds surface signals only.
3. **80/20.** Eighty percent familiar and usable (navigation, forms, buttons, tables, accessibility, performance), twenty percent distinctive (type, imagery, rhythm, motion, storytelling). If everything is a signature the site is noisy and worse. Do not invent odd navigation or controls to look different.
4. **Priority when decisions conflict:** clarity over decoration, purpose over trend, usability over animation, proof over hype, remove before adding.
5. **Do not trade correctness for style.** Contrast, focus visibility, responsive layout, semantics and performance are non-negotiable, and so is honesty: no invented testimonials, logos, metrics or badges.
6. **Retrofit, do not restart.** When code already exists, keep structure and values that work and change the cause of the sameness (tokens first). Rebuilding from scratch loses working behavior and the user's intent.
7. **Avoid the replacement default.** Escaping purple-Inter-cards by landing on cream background, high-contrast serif and sage accent is the newer center. Pick from the brief, not from the list of things that are currently "tasteful".
8. **Do not stall.** Fill the brief from the request and context. Ask at most one short question, and only when a line cannot be inferred and a wrong guess would be costly. Otherwise state your assumption and proceed.
9. **Copy reasoning, never identity.** Learn from how well-known sites work (see `references/big-company-identity.md`), but do not clone a real site's layout, assets, copy or branding, and do not imitate a real organization's login or payment flows.
10. **Keep output efficient.** Deliver working code and a short report, not an essay. No recap of steps.
11. **Never let the page talk about itself.** Honesty about unknown facts is handled by a small visible marker where the fact goes (`Rp [harga]`, `[jam buka]`, `[real figure]`), with the surrounding copy written as if final. Do not write headings or sentences such as "Proof goes here once it exists", "What the page promises", "Prices are examples", or "Three things we say we do" in the visitor-facing text; put that explanation in your report to the user. If a whole section would be mostly markers, cut or shrink it and list what you need in the report. A page full of apologies looks unfinished, which is worse than the slop you were avoiding.
12. **It must look finished.** After building, look at the rendered page (a screenshot at desktop and 360px width) and judge it as a visitor: balanced whitespace, a clear focal point in the hero, readable hierarchy, real weight in each section. Fix empty-looking areas before reporting. Distinctive but sparse is still a failure.

## Pick a mode

- **Build**: new page, app UI, or theme. Follow "Build workflow".
- **Retrofit**: existing project to be made less generic. Start with an audit, then change tokens and the worst offenders. Follow "Audit workflow" then step 3 onward of build. For Tailwind, shadcn/ui, Next.js, Vue, Svelte, Astro or a component library, read `references/frameworks.md` first.
- **Audit**: only a review was asked. Follow "Audit workflow" and report.
- When unclear, build first, then audit your own output.

## Build workflow

### 1. Write a design brief before any code

Four lines, filled from what the user said. For multi-page work save them with the decisions in an `IDENTITY.md` at the project root, and if one already exists read it and continue instead of re-deciding.

- **Audience and moment**: who lands here and what they are trying to decide in the first ten seconds.
- **One specific truth about the product**: something a competitor could not say. Never invent metrics, logos or testimonials; use visible placeholders and tell the user.
- **Three adjectives that are not "modern", "clean" or "professional"**: those words are the average itself.
- **A reference world outside the web**: a printed manual, a ship manifest, a field guide, a lab notebook, a transit map, a record sleeve. The page borrows structure and texture from it.

Slop is what fills the space where decisions are missing. The brief is the decisions.

### 2. Commit to the decisions models skip

Read `references/directions.md` for varied seeds and `references/big-company-identity.md` for how recognizable sites build identity. Then decide each explicitly:

- **Type**: a display face and a text face chosen for the brief; a modular scale with real contrast. Not Inter, Geist, Roboto, Open Sans or system-ui by default.
- **Color**: one dominant hue, one sharp accent spent only on action and status, neutrals tinted toward the dominant hue. No violet/indigo/purple primary unless the brand is purple.
- **Structure**: section order chosen for this audience; at least three different section shapes down the page; left-aligned text; at most two centered elements per section.
- **Icons**: one set, always paired with words, or none. Never emoji as icons or bullets.
- **Motion**: only to mark change or explain how the product works. Honor `prefers-reduced-motion`.
- **Surface**: one radius scale (at most three values) and one elevation approach, chosen once.
- **Signature**: one or two elements from the brief (a notation style, a table treatment, a labeling system, a data motif) repeated consistently on every page.

### 3. Tokens first, components second

Write CSS variables or a theme file from those decisions before any component. Components read tokens; no hardcoded values. Override component-library defaults (shadcn zinc/slate, default radius, default `Card`) instead of just wrapping them, otherwise the library's look wins.

### 4. Components with full states

Default, hover, focus-visible, active, disabled, and loading or error where relevant. Empty states, errors and loading carry the same identity as marketing pages; that is where generic sites give themselves away.

### 5. Write real content

Filler is a tell as strong as the gradient. Avoid "Elevate your workflow", "Unlock the power of", "Seamless", "Supercharge", "Build faster with AI", a lone "Get Started", and invented numbers. Write headlines that name the thing and the person. Use real screenshots and data where available.

### 6. Self-check against `references/specification.md`

1. Run the scanner (below). Resolve critical and high findings or justify each in one line.
2. Swap test: replace the product name with a competitor's. If the page still works unchanged, the specific truth is missing.
3. Blind test: cover the logo. Is the brand still recognizable by type, color and structure?
4. View the result at 360px and at desktop width: run `node scripts/check-render.js <page>` when Playwright is available, and open the screenshots and look. Reading source does not catch overflow in tables and code blocks.
5. Tab through the page. Focus must be visible and order sensible.
6. Contrast at least 4.5:1 for text (3:1 large text and UI parts).
7. Read every visible string as a visitor. Nothing may describe the page itself, its placeholders, or what "will go here". Markers stay small and sit where the fact belongs.
8. Run any form or script on the page (submit, accordion, link builder) and confirm it still works.

## Audit workflow

1. Run `node scripts/scan.js <path>` (add `--json` for machine output).
2. Read `references/tells-catalog.md` for the meaning and fix of each finding. The scanner finds surface tells; read page structure and copy yourself for layout sameness, filler and invented proof.
3. Separate real tells from deliberate choices. Mark deliberate ones as kept, with the reason.
4. Fix by priority (critical, high, medium), at the cause: if purple appears in forty places, change the token, do not patch forty classes.
5. Rerun the scanner. Report the score before and after, what changed, what was kept on purpose, and what the user must supply (real figures, logos, screenshots).

Report honestly. A finding is evidence, not proof: plenty of human-made sites use Inter, and before AI most sites looked like Bootstrap. A passing score means the cheap signals are gone, not that the design is good.

## Scanner

`scripts/scan.js` is dependency-free Node (18+). It walks directories and checks HTML, CSS, JS/TS, JSX/TSX, Vue, Svelte, Astro and MDX files against the rules in `references/tells-catalog.md`, then prints findings with `file:line`, a per-rule summary and a 0-100 score.

```
node scripts/scan.js ./src
node scripts/scan.js ./src ./public --json
node scripts/scan.js . --fail-over 40
```

Bands: 0-19 distinctive, 20-49 some defaults present, 50+ reads as AI-generated. `--fail-over N` exits 1 when the score exceeds N, for CI. Some rules (grid-cols-3, rounded-2xl, uppercase labels) only mean something in combination; treat a lone hit as a prompt to look, not a defect.

Besides visual tells it checks process and accessibility signals: copy that describes the page itself (`meta-copy`), lorem ipsum, images without alt, generic CTA labels, removed focus outlines, a missing viewport tag, animation with no `prefers-reduced-motion` anywhere in the project, hover styles with no focus styles, and many hardcoded hex colors outside tokens. Project-level findings are reported once per project.

## Render check

`scripts/check-render.js` opens a page in headless Chromium and reports what source scanning cannot: horizontal overflow, text under WCAG contrast (4.5:1, or 3:1 for large text), interactive elements under 24 by 24 CSS pixels, h1 count, images without alt, and unlabeled inputs. It needs Playwright; without it the script says so and exits, and you inspect the page by hand at 360px and 1280px instead.

```
node scripts/check-render.js ./index.html
node scripts/check-render.js http://localhost:3000 --shots ./shots
```

For a file path it blocks non-file network requests, so fonts from a CDN fall back during the check; judge typography from the code and from a render with fonts available. Small targets are advisory: WCAG 2.2 allows exceptions for spacing and inline links. Run it before reporting and fix overflow and contrast findings.

## Where to read more

- `references/specification.md`: the checkable standard (MUST, SHOULD, MAY) for finishing and scoring. Read it at the self-check step.
- `references/tells-catalog.md`: each tell with why it happens, detection signal and fix. Read it during audits and when the scanner reports something unfamiliar.
- `references/big-company-identity.md`: research on how well-known product companies build identity, transferable moves, and what not to copy. Read it at the brief stage, or when asked to look "premium" or "like a real company".
- `references/frameworks.md`: where the defaults live in Tailwind, shadcn/ui, Next.js fonts, other component libraries and Vue, Svelte, Astro, and the retrofit order for framework projects. Read it before touching a framework project.
- `evals/`: four test cases (build, brand-constrained build, plain-HTML retrofit, Next.js retrofit) with graders, in the layout `claude plugin eval` reads. Use them to check that changes to this skill do not make results worse.
- `references/directions.md`: varied aesthetic seeds, fonts and a color method. Read it at step 2. Treat entries as seeds to vary; picking the same entry every time is just a new default.
- `references/sources.md`: where the patterns were collected.

## Working with other design skills

If a general frontend-design skill is also available, let it handle visual execution per page. Run steps 1 to 3 here first so its decisions land inside your tokens, then use the specification for the final check.
