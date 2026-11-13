# What big-company sites actually do

Research notes for building a site that feels owned, the way well-known product companies' sites do. Read this at the brief stage of a build, or when the user asks for it to "look expensive", "look like a real company", or "have its own identity".

Contents: The core idea, What the research found, Case notes (Stripe, Linear), Transferable moves, What not to copy, A 80/20 working rule.

## The core idea

Identity is not one unusual color or one expensive animation. It is a set of specific decisions repeated until the site is recognizable with the logo covered. Brand-science calls the repeatable pieces distinctive assets: elements people link to one brand and to no competitor. An element only becomes an asset when it is both famous (many people link it to the brand) and unique (few link it to anyone else). A new site cannot buy fame, so the practical lever is uniqueness plus consistency: choose a few ownable elements, and use them the same way everywhere.

Two consequences for builders:

- Copying a famous site copies assets that are famous for someone else, which reads as imitation, not identity.
- Consistency beats novelty. A modest asset used on every page does more than a striking one used once.

## What the research found

- **Famous sites are results of reasoning, not styling.** Commentary on Linear's site is explicit that dark mode and a sans-serif face are not what make it good; the fit between the style and a developer audience, restraint, and heavy investment in polish are. Reported effort: months on the marketing site, plus a dedicated polish period for the app.
- **Imitation produces sameness.** Clones copy the surface (dark UI, minimalism, shortcuts) without the reasoning behind each choice, so they feel hollow and forgettable. Raycast is cited as a counter-example: it kept the strengths of the trend but added its own bold red and abstract visuals.
- **Restraint is the visible trait.** Linear's newer site reduced color rather than adding it. Stripe is described as avoiding unnecessary frills while still feeling fresh.
- **Motion explains.** Stripe's animations show how the product works so visitors often do not need to read. Motion that decorates is the slop version of the same tool.
- **Copy does half the job.** Short, specific copy paired with the visuals; headlines that could not be used by a thousand other brands.
- **Craft shows up in small decisions.** One reported case: a fixed typing animation was judged too mechanical and replaced with randomized delays between characters. Details like this are invisible when present and felt when absent.
- **Consistency across surfaces.** Marketing site, product, and documentation share the same clarity and polish. Docs that adapt to the signed-in user (code samples filled with their own data) are an example of identity expressed as usefulness.
- **The audience decides the style.** Dark with glow suits an audience of developers working late; it does not suit every audience. A style chosen because it is fashionable is a trend, not a decision.

## Case notes

### Stripe

- Signature: gradients and diagonals are famous, but analysis treats them as surface; the value is in product-explaining animation, sharp copy, and consistent clarity across site and docs.
- Product grouping uses color and icon per product so a dense menu stays scannable.
- Craft and delight: tuned micro-animation timing, a hidden easter egg.
- Lesson: the gradient is not the lesson. Explaining the product through motion and documentation is.

### Linear

- Palette is mostly grays with text and icons at reduced opacity; full saturation is reserved for status, priority and interactive elements. The accent is used sparingly.
- A 4px spacing grid governs padding, margins, icon and text sizes.
- Dense rows with progressive disclosure: actions on hover, detail on click.
- Fast, quiet motion (reported view transitions under 100 ms), skeletons instead of spinners, keyboard-first interaction with shortcuts shown on hover.
- Content follows natural reading order with consistent alignment and minimal CTAs.
- Lesson: every choice serves a developer and product-manager workflow. Note that a purple accent can be legitimate here; purple is a tell only when it is unchosen.

## Transferable moves

These work in any domain because they are about method, not surface.

1. **Constrain the palette and spend color like money.** Neutral base, one dominant hue, one accent reserved for the things that matter (primary action, status, selection).
2. **Run a spacing scale.** A 4px or 8px base grid for every gap, size and radius. Inconsistent spacing is a faster tell of "unfinished" than any font.
3. **Use type as the main brand carrier.** One or two faces, a modular scale, controlled weights. Typography is the cheapest and most consistent asset.
4. **Make motion explain.** Show a state change, a sequence, or how something works. Keep it fast and subtle; honor `prefers-reduced-motion`.
5. **Write specific copy.** A headline names the thing and the person. Use real numbers; placeholders when none exist.
6. **Show the real product.** Real screenshots, real data, real artifacts instead of redrawn chrome and meaningless dashboards.
7. **Repeat one or two signature elements.** A distinctive diagonal, a notation style, a data-table treatment, a way of labeling things. Same treatment on every page.
8. **Extend identity into docs, empty states, errors and loading.** That is where generic sites reveal themselves.
9. **Spend time on details.** Hover states, focus rings, easing curves, alignment, pixel-snapping, text wrapping. Polish is a feature of identity.

## What not to copy

- A famous site's surface (dark mode with glow, a particular gradient, a layout) without its reasoning.
- Dark-only designs when the audience or context needs light mode; contrast and accessibility are part of quality.
- Decorative glassmorphism, which is hard to make unique.
- Odd navigation or controls added just to look different. Unusual layout is only allowed when it strengthens the product.

## A working rule: 80/20

Eighty percent familiar and usable (navigation, forms, buttons, tables, accessibility, performance), twenty percent distinctive (type, imagery, layout rhythm, motion, storytelling). If everything is a signature, the site is noisy and hard to use, and a user will experience it as worse, not more premium. Priority when decisions conflict: clarity over decoration, purpose over trend, usability over animation, proof over hype, remove before adding.

## Sources

- Ehrenberg-Bass distinctive brand assets framework, via CreativeX and Umbrex write-ups: fame and uniqueness, consistency, asset types.
- LogRocket, "Linear design": restraint, reading order, cautions about copying; Anthony Hobday, "A critique of the Linear website"; 925Studios, "Linear Design Breakdown": grays and opacity, 4px grid, density, motion, keyboard-first.
- Eleken, "Making it like Stripe": product-explaining motion, restraint, contextual docs, timing details, easter eggs.
- Figures reported there are the authors' claims; treat specifics (such as exact durations) as indicative.
