# Tells catalog

Each entry: what it is, why models produce it, how to detect it, how to fix it. Priority tiers match the scanner (critical, high, medium). Rule ids in backticks are the scanner's.

Contents: Color, Typography, Layout, Surface and effects, Icons, Motion, Copy and content, Stack fingerprints, Finish and accessibility, What is not a tell.

## Color

**Purple or indigo primary** (`purple-utility`, `purple-hex`, critical)
The single loudest tell. Tailwind UI set `bg-indigo-500` as its button color years ago; tutorials copied it, models learned "modern UI equals indigo", and generated sites reinforce it. Detect: `bg|text|from|to|via|border|ring-(indigo|violet|purple|fuchsia)-(400..700)`, hex values such as `#6366f1`, `#8b5cf6`, `#a855f7`, `#667eea`, `#764ba2`, `#7c3aed`. Fix: derive the hue from the product or its world; change it at the token level.

**Purple-to-blue or pink gradient** (`gradient-purple`, critical)
Usually on the hero background, the primary button, or the H1. Fix: one solid dominant color, or a two-stop gradient tied to the brand at low contrast, or a real image.

**Gradient text** (`gradient-text`, high)
`bg-clip-text text-transparent` on a headline. Fix: solid color; emphasis through weight, size, or one accent word.

**Timid evenly spread palette** (manual)
Five pastel colors at equal weight. Fix: one dominant, one sharp accent, tinted neutrals, a clear rule for where accent appears.

**Plain white plus gray-50 sections** (manual)
Zero point of view. Fix: tint neutrals toward the brand hue, or choose a deliberately dark or paper-toned base.

**Aurora blobs, mesh glow, neon on dark** (`neon-glow`, medium)
Colored orbs behind the hero "for no particular reason". Fix: remove, or tie the glow to something the product actually does.

## Typography

**Inter, Geist, Roboto, Open Sans, system-ui as the brand face** (`font-default`, high)
Inter is a great font and the most common safe answer, so unchosen Inter signals no typography decision. Fix: choose a pairing for the brief; changing the font is the highest-leverage single move.

**One family for everything** (manual)
Headings, body, labels and buttons identical. Fix: a display/text pair, or one family used with real contrast in width, weight and size.

**Default size ladder** (manual)
12/14/16/18/24/30/36/48/60/72. Fix: a modular ratio (1.2, 1.25, 1.333) with a size jump big enough to read as hierarchy.

**Uppercase tracked labels over every heading** (`caps-label`, medium)
Small caps eyebrow above each H2 and a pill badge above the H1 ("New", "Beta", "Now with AI"). Fix: use eyebrows only where they carry information.

## Layout

**Centered hero, headline, subhead, two buttons** (manual)
Fix: left-align, or anchor the hero on the real product (screenshot, data, artifact) rather than centered text over a gradient.

**Three equal feature cards** (`three-col-grid`, medium)
Icon, heading, two lines, repeated in a row. Six identical cards is the same tell. Fix: give items different weights, merge features into a narrative, use a list or table where it is a comparison.

**Fixed section order** (manual)
Hero, logos, features, how it works, testimonials, pricing, CTA, footer. Fix: order sections by what this audience needs to decide.

**Everything centered** (manual)
Fix: left-align body text; at most two centered elements per section.

**Stacked-section sameness** (manual)
Every section the same height, padding and rhythm. Fix: vary density and scale down the page.

**Generic dashboard** (manual)
Row of stat tiles, a line chart, a table, sidebar with emoji. Fix: design around the one question the user opens the dashboard to answer.

## Surface and effects

**Rounded corners and shadow on everything** (`radius-heavy`, medium)
`rounded-2xl|3xl` with `shadow-lg`. Fix: choose one radius scale and one elevation approach; consider flat borders.

**Glassmorphism** (`glass`, medium)
`backdrop-blur` with translucent white on a gradient, on nav and cards. Not universally disliked, but it is usually decorative. Fix: keep only where overlap is real (sticky nav over content), otherwise remove.

**Neon glow shadows** (`neon-glow`, medium)
`shadow-[0_0_...]` or colored box-shadow with zero offset. Fix: remove or reduce to a purposeful focus state.

**Fake UI chrome** (manual)
Hand-drawn browser frames with three dots, floating dashboard mockups with meaningless numbers. Fix: a real screenshot or none.

## Icons

**Emoji as icons or bullets** (`emoji-icon`, high)
Rocket, lightning, sparkles, fire, target, lock, bulb as feature icons or nav items. Fix: one icon set with consistent stroke and size, paired with text, or no icons.

**The usual five Lucide icons** (`lucide-default`, medium)
Zap, ShieldCheck, Bot, Sparkles, Rocket together above the fold. Fix: icons chosen per meaning; mixing icon libraries is a tell too, so keep one.

## Motion

**Bounce, lift or scale on every hover, fade-up on every section** (`hover-motion`, medium)
Fix: motion only for state change, orientation or sequence. Respect `prefers-reduced-motion`.

**Particle fields, floating blobs, morphing shapes in the hero** (manual)
Fix: remove, or make the motion carry meaning.

## Copy and content

**Filler headlines** (`filler-copy`, medium)
"Elevate your workflow", "Unlock the power of", "Seamless", "Supercharge", "Revolutionize", "Build faster with AI". Fix: say the specific thing the product does for the specific person.

**Invented metrics and social proof** (`invented-metric`, medium)
"10x faster", "99.9%", "10,000+ teams", fake testimonial names. Fix: real figures, or visible placeholders; never ship fabricated proof.

**Section-label comments left in markup** (`section-comment`, medium)
`<!-- Hero -->`, `<!-- Testimonials -->` above each block. Fix: delete.

## Stack fingerprints

**Stock shadcn/ui components imported untouched** (`shadcn-default`, high)
Zinc/slate palette, default radius, default Card. Fix: keep the primitives if useful, but replace tokens, radius, density and states so the library stops showing through.

**Default Tailwind blue-600 buttons** (manual)
Fix: theme the brand color and use it.

## Finish and accessibility

**Copy that describes the page itself** (`meta-copy`, high)
Headings or sentences such as "Proof goes here once it exists", "What the page promises", "We will publish numbers here once we have real ones". It appears when a model over-applies "do not invent facts" and narrates the gap to visitors. Fix: keep a small marker where the fact belongs, write the surrounding copy as final, and explain gaps in the report; if a section would be mostly markers, cut it.

**Lorem ipsum** (`lorem-ipsum`, high)
Fix: real copy or a short honest marker.

**Image without alt** (`img-no-alt`, high)
Fix: meaningful alt text, or empty alt for decorative images.

**Generic CTA label** (`generic-cta`, medium)
"Get Started", "Learn More", "Click Here" as the only label. Fix: say what happens next.

**Focus outline removed, hover without focus** (`outline-removed`, `no-focus-style`, medium)
Keyboard users lose their place. Fix: a visible `:focus-visible` style that mirrors hover.

**Motion with no reduced-motion handling** (`no-reduced-motion`, medium)
Fix: a `prefers-reduced-motion` block that disables non-essential motion.

**No viewport meta tag** (`no-viewport`, high)
Not reported for Next.js layout files, which inject a default viewport. Fix: add the meta tag.

**Hardcoded colors outside tokens** (`hardcoded-colors`, medium)
More than fifteen lines with hex values outside variable definitions. Fix: move colors into tokens.

## What is not a tell

- Using Inter, shadcn or Tailwind is not wrong; leaving them unexamined is. A site can use all three and still be distinctive if type, color, structure and content are decided.
- Bento grids, glassmorphism and aurora backgrounds are weak signals in community data. Flag them when decorative, leave them when they do real work.
- Passing the scanner does not make a design good. It only removes the cheapest signals that nobody decided anything.
- A tell appearing once is a note; many together is the pattern.
