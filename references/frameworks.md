# Framework notes

Where the slop actually lives in real projects, and where to change it. Read this when the work is inside Tailwind, shadcn/ui, Next.js, Vue, Svelte, Astro, or a component library rather than a single HTML file.

Contents: Why frameworks matter, Retrofit order, Tailwind, shadcn/ui, Next.js fonts and starter defaults, Other component libraries, Vue Svelte Astro, Gotchas.

Version note: names below follow current Tailwind v4 and shadcn/ui conventions and the older Tailwind v3 form where it differs. Check the project's installed versions before editing; if a file or API differs, follow the project's own conventions.

## Why frameworks matter

Most generated sites are built on the same defaults: the Tailwind color palette (indigo, violet and the gray scale), shadcn's neutral theme, the starter template's font, and stock component variants. Changing individual components leaves those defaults underneath. Changing the token layer once changes the whole site, and that is where identity belongs.

## Retrofit order for a framework project

1. Run `node scripts/scan.js <src>` for a baseline score.
2. Define tokens (colors, fonts, radius, spacing) in the theme layer.
3. Replace fonts at the framework's font loader.
4. Override component-library defaults at their source.
5. Rework sections and copy.
6. Start the dev server and run `node scripts/check-render.js http://localhost:3000` (use the project's own port) at 360px and desktop width. Look at the screenshots.
7. Rerun the scanner and report before and after.

Do not add dependencies to fix looks, and do not rename classes across the codebase when a token change achieves the same result.

## Tailwind

Tailwind v4: tokens live in CSS inside `@theme`. Defining `--color-brand-500`, `--font-display`, or `--radius-card` there generates utilities such as `bg-brand-500`, `font-display`, `rounded-card`. To stop the default palette from being available (so indigo or violet cannot slip back in), reset the namespace inside `@theme` with `--color-*: initial;` and then define only the colors the brand uses.

Tailwind v3: set `theme.extend` in `tailwind.config.js` to add tokens, or set `theme.colors` directly to replace the default palette.

Rules of thumb:

- Name colors by role (`ink`, `paper`, `signal`) or brand name, not by hue (`blue-600`).
- Components should use semantic names so a later palette change is one edit.
- A lint rule or a search for `indigo|violet|purple` in class names catches regressions.

## shadcn/ui

shadcn components read CSS variables defined in the global stylesheet (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--border`, `--radius`, plus a `.dark` set). The default neutral or zinc theme is a tell on its own.

- Replace the variable values with the brand's. Check that foreground and background pairs keep at least 4.5:1 contrast, and change the `.dark` set together with the light one.
- Set `--radius` once deliberately; components derive their corner radii from it.
- The components are source files in the project (commonly `components/ui`). Edit variants, padding, borders and states directly; do not wrap them in another layer that leaves the stock look underneath.
- Stock `Card` with a shadow on every section is the visible fingerprint. Change density and structure, not just color.

## Next.js fonts and starter defaults

Starter templates ship a default font and a default look, and unchanged starters are a common source of sameness. Check `app/layout` and the global stylesheet first.

- Load fonts with `next/font/google` (or `next/font/local` for self-hosted files). Use the `variable` option to expose a CSS variable and apply it on the `<html>` element's className.
- With Tailwind v4, map the variable into the theme with `@theme inline { --font-display: var(--font-your-variable); }` so `font-display` works.
- Self-hosting avoids a runtime dependency on a font CDN and avoids layout shift. Subset fonts and set `display: 'swap'`.
- Replace the starter's default font and remove leftover starter content and gradients.

## Other component libraries

- **MUI**: theme object (`palette`, `typography`, `shape.borderRadius`, component `styleOverrides`).
- **Chakra and Mantine**: theme tokens and component variants in the provider setup.
- **Ant Design**: design tokens in the config provider.

The same rule applies everywhere: change the token or theme layer first, component overrides second, one-off styles last.

## Vue, Svelte, Astro

Put tokens in a global stylesheet as CSS variables (or the framework's theme file) and let scoped component styles reference them. The scanner reads `.vue`, `.svelte` and `.astro` files, so the same rules apply. Avoid per-component hardcoded hex values; the `hardcoded-colors` rule flags files that have many.

## Gotchas

- Dark mode variables must be updated together with the light ones, or one mode will keep the old defaults.
- Check snapshot tests and Storybook stories before changing class names or markup.
- Keep accessible names, labels and focus styles when restyling stock components.
- Respect the project's existing conventions (file layout, naming, lint rules) over this file.
