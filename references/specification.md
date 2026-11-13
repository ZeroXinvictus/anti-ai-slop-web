# Anti-slop website specification

A checkable standard for deciding whether a built or retrofitted page is done. Use it in the self-check step of the build workflow and as the scoring frame in audits. Items are marked `MUST` (fail if missed), `SHOULD` (fix unless there is a stated reason), and `MAY`.

Contents: How to apply, A. Decisions on record, B. Tokens, C. Typography, D. Color, E. Layout, F. Components and states, G. Motion, H. Content, I. Accessibility and performance, J. Truthfulness and safety, K. Verification, L. Output report.

## How to apply

- Treat the spec as a checklist of outcomes, not a style. Two pages can pass it and look nothing alike.
- Existing brand, design system, or user instruction overrides any item that conflicts. Record the override in the report and keep going.
- When the page is a retrofit, apply the spec to what changes. Do not rebuild what already works.
- Never trade an `Accessibility` or `Truthfulness` item for a visual one.

## A. Decisions on record

- MUST: a short design brief exists (audience and moment, one specific truth about the product, three non-generic adjectives, a reference world). For multi-page work, save it as `IDENTITY.md` in the project so later sessions follow the same decisions instead of re-deriving them.
- MUST: every unusual choice (display font, accent, radius, layout skeleton) can answer "why does this exist?" in one sentence tied to the brief.
- SHOULD: one or two signature elements are named and applied consistently.

## B. Tokens

- MUST: colors, type scale, spacing, radius, shadow and motion durations live in one token source (CSS variables or a theme file). Components read tokens; no hardcoded values in components.
- MUST: library defaults (shadcn zinc/slate, default radius, default `Card`) are overridden, not just wrapped.
- SHOULD: spacing follows a base grid (4px or 8px). Radius uses at most three values.

## C. Typography

- MUST: the brand face is a deliberate choice, not Inter, Geist, Roboto, Open Sans or system-ui by default. If the user's brand uses one of these, keep it and differentiate through scale, weight, case and spacing.
- MUST: at least two levels of real contrast in size or weight between heading and body.
- SHOULD: a modular scale (ratio 1.125 to 1.333), not 12/14/16/18/24/30/36/48/60/72.
- SHOULD: body text 16px or larger, line length 45 to 75 characters, left-aligned paragraphs.
- SHOULD NOT: uppercase tracked eyebrow above every heading, or a pill badge above the hero headline without information in it.

## D. Color

- MUST: no violet, indigo or purple primary unless the brand is purple or the brief justifies it in writing.
- MUST: no purple-to-blue or pink gradient as hero background, button fill or headline fill.
- MUST: no gradient-filled headline text.
- SHOULD: one dominant hue, one accent used only for actions and status, neutrals tinted toward the dominant hue.
- SHOULD: dark mode only if the audience and context call for it; if dark-only, state why.
- MAY: gradients that are tied to the brand, low-contrast, and serve a purpose.

## E. Layout

- MUST: the section order is chosen for what this audience needs to decide, not the default hero, logos, three features, testimonials, pricing, CTA sequence.
- SHOULD: at least three different section shapes down a landing page (for example wide image, tight list, table, quote), not repeated equal blocks.
- SHOULD NOT: three or six identical cards in a row. If a grid of items is needed, the items differ in weight or the grid is a real comparison.
- SHOULD: left-align most text; at most two centered elements per section.
- MUST: navigation, forms and controls behave conventionally. Layout novelty is allowed only where it strengthens the product.
- MUST: works at 360px width with no horizontal page scroll and no overflowing tables or code blocks.

## F. Components and states

- MUST: interactive components define default, hover, focus-visible, active, disabled, and (where relevant) loading and error states.
- SHOULD: empty states, error pages and loading states carry the same identity as the marketing pages.
- MUST: icons come from one set, paired with text labels; no emoji as icons, bullets or navigation.

## G. Motion

- MUST: motion marks a state change, orients the user, or explains the product. No bounce on every hover, no fade-up on every section, no looping decorative blobs or particles.
- MUST: `prefers-reduced-motion` is honored.
- SHOULD: durations come from tokens; common transitions stay under 200ms.

## H. Content

- MUST: no invented metrics, testimonials, customer logos, reviews, security badges or user counts. Where real data is missing use visible placeholders such as `[real figure]` and tell the user.
- MUST: unknown facts are shown as small visible markers in place; the surrounding copy reads as final. No visitor-facing text describes the page's own incompleteness ("Proof goes here once it exists", "Prices are examples"). Explain gaps in the report to the user.
- SHOULD: a section that would be mostly markers is cut or shrunk, and the missing input is listed in the report.
- MUST: the main headline fails the swap test: replacing the product name with a competitor's makes it false or odd.
- SHOULD NOT: filler openers such as "Elevate your...", "Unlock the power of...", "Seamless", "Supercharge", "Build faster with AI", "Welcome to ...".
- SHOULD: CTA labels say what happens next, not just "Get Started".
- SHOULD: real screenshots or real data in place of redrawn browser frames and meaningless dashboards.

## I. Accessibility and performance

- MUST: text contrast at least 4.5:1 (3:1 for large text and UI components); visible focus indicators; interactive targets at least 24 by 24 CSS pixels (WCAG 2.2 AA).
- MUST: semantic landmarks and headings, labeled form controls, alt text for meaningful images.
- MUST: no secrets or API credentials in frontend code.
- SHOULD: Core Web Vitals at the 75th percentile in the good range: LCP at or under 2.5 s, INP at or under 200 ms, CLS at or under 0.1.
- SHOULD: fonts subsetted and loaded with `font-display`, images sized and lazy-loaded below the fold.

## J. Truthfulness and safety

- MUST: do not imitate a real organization's branding, login or payment flows. Take inspiration from method, never from identity.
- MUST: do not copy a specific famous site's layout, assets or copy.
- MUST: report overrides, unknowns and placeholders honestly.

## K. Verification

1. Run `node scripts/scan.js <path>`; resolve critical and high findings or justify each.
2. Blind test: cover the logo; is the brand still recognizable by type, color, structure?
3. Swap test: replace the product name with a competitor's; does the page still work unchanged? If yes, the specific truth is missing.
4. Check at 360px and at desktop width; open the page and look at it, not just the source.
5. Tab through the page; confirm focus is visible and order is sensible.
6. Replacement-default check: cream background plus high-contrast serif plus sage or terracotta accent is the newer default. Choose it only on purpose.

## L. Output report

Keep it short. State: the brief in two lines, the signature element and why, the scanner score before and after (when a retrofit), overrides applied, placeholders left and what the user must supply. No step-by-step recap.
