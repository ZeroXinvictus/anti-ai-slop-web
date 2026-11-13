# anti-ai-slop-web

An agent skill that stops AI from building the same website every time: purple gradients, Inter, a centered hero with three identical cards, emoji icons, filler copy. It works in two modes:

- **Build**: forces a design brief and real decisions (type, color, structure, icons, motion) before any code is written.
- **Audit**: runs a dependency-free scanner over a codebase and fixes the tells by priority.

Works with any agent that reads the `SKILL.md` format: Claude Code, the Claude app, Codex, Copilot, and others.

## Install

**Claude Code** (all projects):

```
git clone https://github.com/<your-username>/anti-ai-slop-web ~/.claude/skills/anti-ai-slop-web
```

For one project only, clone into `<project>/.claude/skills/anti-ai-slop-web` instead.

**Claude app (claude.ai)**: zip the folder (the zip must contain the `anti-ai-slop-web/` folder with `SKILL.md` inside) and upload it in the Skills section of settings.

**Other agents**: copy the folder into the directory your agent loads skills from.

## Use

Just ask in plain language:

```
build me a landing page for a bicycle repair shop
this page looks AI-made, fix it
audit ./src for AI design tells
```

The skill triggers on intent. You can also run the scanner directly (Node 18+, no install):

```
node scripts/scan.js ./src
node scripts/scan.js . --json
node scripts/scan.js . --fail-over 40
```

Score bands: 0-19 distinctive, 20-49 some defaults present, 50+ reads as AI-generated. `--fail-over N` exits with code 1 above N, so it can gate CI.

## Layout

```
SKILL.md                     workflow for the agent
scripts/scan.js              tell scanner
references/tells-catalog.md  every tell: why, detection, fix
references/directions.md     varied aesthetic seeds, fonts, color method
references/sources.md        where the patterns came from
```

## Caveats

The tells come from community observation (Reddit, Hacker News, DEV Community, YC reviews), not a controlled study. Many human-made sites use the same patterns, and passing the scanner does not make a design good. It removes the cheapest signals that nobody decided anything.

---

## Bahasa Indonesia

Skill untuk agent AI (Claude Code, aplikasi Claude, Codex, dll.) supaya website buatan AI tidak jadi seragam: gradien ungu, font Inter, hero di tengah dengan tiga kartu yang sama, ikon emoji, copy generik.

- **Mode Build**: agent wajib membuat design brief dan memutuskan font, warna, struktur, ikon, dan animasi sebelum menulis kode.
- **Mode Audit**: `scripts/scan.js` memindai kode (tanpa dependensi, Node 18+) lalu agent memperbaiki temuan berdasarkan prioritas.

Install di Claude Code: `git clone https://github.com/<username-kamu>/anti-ai-slop-web ~/.claude/skills/anti-ai-slop-web`. Untuk aplikasi Claude, zip foldernya lalu unggah di bagian Skills pada pengaturan. Setelah terpasang, cukup minta: "bikinin landing page toko sepeda" atau "audit ./src, desainnya terlihat buatan AI".

## License

MIT
