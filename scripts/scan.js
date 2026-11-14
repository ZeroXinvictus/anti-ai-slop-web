const fs = require('node:fs')
const path = require('node:path')

const EXTENSIONS = new Set(['.html', '.htm', '.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro', '.mdx'])
const SKIPPED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vercel', 'coverage', 'out'])
const MAX_FILE_BYTES = 1024 * 1024
const WEIGHTS = { critical: 3, high: 2, medium: 1 }
const HIT_CAP = 3

const RULES = [
  {
    id: 'purple-utility',
    tier: 'critical',
    pattern: /\b(?:bg|text|from|to|via|border|ring|fill|stroke|shadow)-(?:indigo|violet|purple|fuchsia)-(?:400|500|600|700)\b/,
    message: 'Purple or indigo utility color',
    fix: 'Derive the hue from the product and change it at the theme token level'
  },
  {
    id: 'purple-hex',
    tier: 'critical',
    pattern: /#(?:667eea|764ba2|6366f1|8b5cf6|a855f7|7c3aed|7e5bef|4f46e5|9333ea|a78bfa)\b/i,
    message: 'Hex value from the AI purple family',
    fix: 'Replace with a brand-derived token'
  },
  {
    id: 'gradient-purple',
    tier: 'critical',
    pattern: /(?:from-(?:purple|violet|indigo|fuchsia)-\d+[^"'`]*to-(?:blue|pink|cyan|indigo|purple|fuchsia|violet)-\d+)|(?:linear-gradient\([^)]*(?:#667eea|#764ba2|#6366f1|#8b5cf6|#a855f7|#7c3aed|#7e5bef|purple|violet|indigo))/i,
    message: 'Purple-to-blue or pink gradient',
    fix: 'Use a solid dominant color or a restrained brand-tied gradient'
  },
  {
    id: 'gradient-text',
    tier: 'high',
    pattern: /bg-clip-text|background-clip\s*:\s*text|-webkit-background-clip\s*:\s*text/,
    message: 'Gradient-filled text',
    fix: 'Use solid color; emphasize with weight, size, or one accent word'
  },
  {
    id: 'font-default',
    tier: 'high',
    pattern: /font-family\s*:[^;{}]*\b(?:Inter|Geist|Roboto)\b|['"]Inter['"]|\bInter\s*\(|next\/font\/google[^\n]*\bInter\b|fontFamily[^\n]*\b(?:Inter|Geist)\b|font-(?:inter|geist)\b/,
    message: 'Default AI font (Inter, Geist, Roboto)',
    fix: 'Choose a display and text pairing from the design brief'
  },
  {
    id: 'emoji-icon',
    tier: 'high',
    pattern: /[\u{1F300}-\u{1FAFF}\u{26A1}\u{2728}\u{2B50}]/u,
    message: 'Emoji in markup, likely used as an icon',
    fix: 'Use one consistent icon set paired with text, or no icon'
  },
  {
    id: 'shadcn-default',
    tier: 'high',
    pattern: /from\s+['"]@\/components\/ui\/(?:card|badge|button)['"]/,
    message: 'Stock shadcn component import',
    fix: 'Restyle tokens, radius, density, and states so the library stops showing through'
  },
  {
    id: 'glass',
    tier: 'medium',
    pattern: /backdrop-blur|backdrop-filter\s*:\s*blur/,
    message: 'Backdrop blur (glassmorphism)',
    fix: 'Keep only where content really overlaps, such as a sticky nav'
  },
  {
    id: 'neon-glow',
    tier: 'medium',
    pattern: /shadow-\[0_0_|box-shadow\s*:[^;]*\b0\s+0\s+\d+px[^;]*(?:rgba?\(|#)|drop-shadow-\[0_0_/,
    message: 'Zero-offset colored glow',
    fix: 'Remove or reduce to a purposeful focus state'
  },
  {
    id: 'radius-heavy',
    tier: 'medium',
    pattern: /\brounded-(?:2xl|3xl)\b/,
    message: 'Heavy rounded corners',
    fix: 'Choose one radius scale deliberately'
  },
  {
    id: 'three-col-grid',
    tier: 'medium',
    pattern: /\b(?:md:|lg:)?grid-cols-3\b|grid-template-columns\s*:\s*repeat\(\s*3\s*,/,
    message: 'Three-column grid, check for three identical cards',
    fix: 'Give items different weight or change the structure'
  },
  {
    id: 'caps-label',
    tier: 'medium',
    pattern: /\buppercase\b[^"'`]*\btracking-(?:wide|wider|widest)\b|\btracking-(?:wide|wider|widest)\b[^"'`]*\buppercase\b/,
    message: 'Uppercase tracked label',
    fix: 'Use eyebrow labels only where they carry information'
  },
  {
    id: 'lucide-default',
    tier: 'medium',
    pattern: /import\s*\{[^}]*\b(?:Zap|ShieldCheck|Bot|Sparkles|Rocket)\b[^}]*\}\s*from\s*['"]lucide-react['"]/,
    message: 'Stock Lucide icon set (Zap, ShieldCheck, Bot, Sparkles, Rocket)',
    fix: 'Pick icons by meaning, keep one library'
  },
  {
    id: 'hover-motion',
    tier: 'medium',
    pattern: /hover:(?:-translate-y-\d+|scale-1\d\d)|animate-(?:bounce|pulse)|group-hover:scale-1\d\d/,
    message: 'Decorative hover or loop motion',
    fix: 'Animate only state change, orientation, or sequence'
  },
  {
    id: 'filler-copy',
    tier: 'medium',
    pattern: /\b(?:Elevate|Unlock|Supercharge|Revolutionize|Streamline|Empower)\s+(?:your|the)\b|\bSeamless(?:ly)?\b|Build faster with AI|Welcome to\s+[A-Z]/,
    message: 'Filler marketing copy',
    fix: 'State the specific thing the product does for the specific person'
  },
  {
    id: 'invented-metric',
    tier: 'medium',
    pattern: /\b\d{1,2}x\s+faster\b|\b99\.9\s*%|\b10,000\+|\b50K\+|\b1M\+\s+(?:users|downloads)/i,
    message: 'Likely invented metric',
    fix: 'Use a real figure or a visible placeholder'
  },
  {
    id: 'meta-copy',
    tier: 'high',
    pattern: /\b(?:goes here|go here|once it exists|once (?:we|there) (?:have|are)|your (?:headline|text|content|tagline|tagline) here|what the page (?:promises|says)|things (?:we|\w+) says? (?:it|we) does?)\b/i,
    message: 'Visitor-facing copy that describes the page itself',
    fix: 'Write the copy as final; keep a small marker where a fact is missing and explain gaps in the report'
  },
  {
    id: 'lorem-ipsum',
    tier: 'high',
    pattern: /lorem ipsum|dolor sit amet/i,
    message: 'Lorem ipsum filler',
    fix: 'Write real copy or a short honest marker'
  },
  {
    id: 'img-no-alt',
    tier: 'high',
    pattern: /<img\b(?![^>]*\balt\s*=)[^>]*>/i,
    message: 'Image without alt attribute',
    fix: 'Add meaningful alt text, or alt="" for decorative images'
  },
  {
    id: 'generic-cta',
    tier: 'medium',
    pattern: />\s*(?:Get Started|Learn More|Click Here|Read More)\s*</i,
    message: 'Generic call-to-action label',
    fix: 'Say what happens next, such as "Book a slot" or "See the price list"'
  },
  {
    id: 'outline-removed',
    tier: 'medium',
    pattern: /outline\s*:\s*(?:none|0)\b|\boutline-none\b/,
    message: 'Focus outline removed',
    fix: 'Provide a visible :focus-visible replacement'
  },
  {
    id: 'no-viewport',
    tier: 'high',
    pattern: /(?!)/,
    message: 'HTML document without a viewport meta tag',
    fix: 'Add <meta name="viewport" content="width=device-width,initial-scale=1">'
  },
  {
    id: 'no-reduced-motion',
    tier: 'medium',
    pattern: /(?!)/,
    message: 'Animations or transitions but no prefers-reduced-motion handling anywhere',
    fix: 'Add a prefers-reduced-motion block that disables non-essential motion'
  },
  {
    id: 'no-focus-style',
    tier: 'medium',
    pattern: /(?!)/,
    message: 'Hover styles but no focus styles anywhere',
    fix: 'Mirror interactive hover styles with :focus-visible'
  },
  {
    id: 'hardcoded-colors',
    tier: 'medium',
    pattern: /(?!)/,
    message: 'Many hex colors written outside token definitions',
    fix: 'Move colors into variables or the theme file and reference them'
  },
  {
    id: 'section-comment',
    tier: 'medium',
    pattern: /<!--\s*(?:Hero|Features?|Testimonials?|Pricing|CTA|Footer|Navbar|Header)(?:\s+Section)?\s*-->|\{\/\*\s*(?:Hero|Features?|Testimonials?|Pricing|CTA|Footer)(?:\s+Section)?\s*\*\/\}/i,
    message: 'Section label left in markup',
    fix: 'Delete'
  }
]

function parseArgs(argv) {
  const options = { targets: [], json: false, failOver: null }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--json') options.json = true
    else if (arg === '--fail-over') {
      options.failOver = Number(argv[i + 1])
      i += 1
    } else if (arg === '--help' || arg === '-h') options.help = true
    else options.targets.push(arg)
  }
  if (options.targets.length === 0) options.targets.push('.')
  return options
}

function collectFiles(target, found) {
  let stat
  try {
    stat = fs.statSync(target)
  } catch {
    return found
  }
  if (stat.isFile()) {
    if (EXTENSIONS.has(path.extname(target).toLowerCase())) found.push(target)
    return found
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name) && !entry.name.startsWith('.')) collectFiles(path.join(target, entry.name), found)
    } else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      found.push(path.join(target, entry.name))
    }
  }
  return found
}

function scanFile(file) {
  const stat = fs.statSync(file)
  if (stat.size > MAX_FILE_BYTES) return []
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  const findings = []
  lines.forEach((line, index) => {
    if (line.length > 2000) return
    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        findings.push({
          file,
          line: index + 1,
          rule: rule.id,
          tier: rule.tier,
          message: rule.message,
          excerpt: line.trim().slice(0, 120)
        })
      }
    }
  })
  return findings
}

const MOTION_PATTERN = /@keyframes|\banimation\s*:|\btransition\s*:/
const REDUCED_PATTERN = /prefers-reduced-motion|motion-reduce:|motion-safe:/
const HOVER_PATTERN = /:hover|\bhover:/
const FOCUS_PATTERN = /:focus-visible|\bfocus-visible:|:focus\b|\bfocus:/
const HEX_LINE_PATTERN = /(?:^|[\s:(,])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
const TOKEN_LINE_PATTERN = /--[\w-]+\s*:/
const HEX_LINE_LIMIT = 15

function projectFinding(file, line, rule, excerpt) {
  const definition = ruleById(rule)
  return { file, line, rule, tier: definition.tier, message: definition.message, excerpt }
}

function projectChecks(files) {
  const found = []
  const flags = { motion: null, reduced: false, hover: null, focus: false }
  for (const file of files) {
    if (fs.statSync(file).size > MAX_FILE_BYTES) continue
    const text = fs.readFileSync(file, 'utf8')
    if (MOTION_PATTERN.test(text) && !flags.motion) flags.motion = file
    if (REDUCED_PATTERN.test(text)) flags.reduced = true
    if (HOVER_PATTERN.test(text) && !flags.hover) flags.hover = file
    if (FOCUS_PATTERN.test(text)) flags.focus = true
    const framesViewport = /(?:^|[\\/])layout\.(?:jsx|tsx|js|ts)$/.test(file) || /export\s+(?:const\s+viewport|(?:async\s+)?function\s+generateViewport)/.test(text)
    if (/<html[\s>]/i.test(text) && !framesViewport && !/<meta[^>]+name=["']viewport["']/i.test(text)) {
      found.push(projectFinding(file, 1, 'no-viewport', '<html> without viewport meta'))
    }
    const hexLines = text.split(/\r?\n/).filter((line) => HEX_LINE_PATTERN.test(line) && !TOKEN_LINE_PATTERN.test(line)).length
    if (hexLines > HEX_LINE_LIMIT) {
      found.push(projectFinding(file, 1, 'hardcoded-colors', `${hexLines} lines with hex colors outside variable definitions`))
    }
  }
  if (flags.motion && !flags.reduced) found.push(projectFinding(flags.motion, 1, 'no-reduced-motion', 'motion found, no prefers-reduced-motion in project'))
  if (flags.hover && !flags.focus) found.push(projectFinding(flags.hover, 1, 'no-focus-style', 'hover found, no focus styles in project'))
  return found
}

function summarize(findings) {
  const byRule = new Map()
  for (const finding of findings) {
    const entry = byRule.get(finding.rule) || { rule: finding.rule, tier: finding.tier, count: 0 }
    entry.count += 1
    byRule.set(finding.rule, entry)
  }
  const rows = [...byRule.values()].sort((a, b) => WEIGHTS[b.tier] - WEIGHTS[a.tier] || b.count - a.count)
  const raw = rows.reduce((sum, row) => sum + Math.min(row.count, HIT_CAP) * WEIGHTS[row.tier] * 3, 0)
  return { rows, score: Math.min(100, raw) }
}

function band(score) {
  if (score < 20) return 'distinctive'
  if (score < 50) return 'some defaults present'
  return 'reads as AI-generated'
}

function ruleById(id) {
  return RULES.find((rule) => rule.id === id)
}

function printReport(files, findings, summary) {
  const order = { critical: 0, high: 1, medium: 2 }
  const sorted = [...findings].sort((a, b) => order[a.tier] - order[b.tier] || a.file.localeCompare(b.file) || a.line - b.line)
  for (const finding of sorted) {
    console.log(`${finding.tier.padEnd(8)} ${finding.file}:${finding.line}  [${finding.rule}] ${finding.message}`)
    console.log(`         ${finding.excerpt}`)
  }
  if (sorted.length > 0) console.log('')
  console.log('Summary by rule')
  for (const row of summary.rows) {
    console.log(`  ${row.tier.padEnd(8)} ${String(row.count).padStart(4)}  ${row.rule}  ->  ${ruleById(row.rule).fix}`)
  }
  console.log('')
  console.log(`Files scanned: ${files.length}`)
  console.log(`Findings: ${findings.length}`)
  console.log(`Slop score: ${summary.score}/100 (${band(summary.score)})`)
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log('Usage: node scan.js [path ...] [--json] [--fail-over N]')
    return 0
  }
  const files = options.targets.reduce((found, target) => collectFiles(target, found), [])
  const findings = files.flatMap(scanFile).concat(projectChecks(files))
  const summary = summarize(findings)
  if (options.json) {
    console.log(JSON.stringify({ files: files.length, score: summary.score, band: band(summary.score), summary: summary.rows, findings }, null, 2))
  } else {
    printReport(files, findings, summary)
  }
  if (options.failOver !== null && Number.isFinite(options.failOver) && summary.score > options.failOver) return 1
  return 0
}

process.exitCode = main()
