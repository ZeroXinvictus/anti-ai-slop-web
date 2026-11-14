const path = require('node:path')
const fs = require('node:fs')

const DEFAULT_WIDTHS = [360, 1280]
const MAX_REPORTED = 20

function parseArgs(argv) {
  const options = { target: null, widths: DEFAULT_WIDTHS, json: false, shotDir: null }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--json') options.json = true
    else if (arg === '--widths') {
      options.widths = String(argv[i + 1]).split(',').map(Number).filter((n) => Number.isFinite(n) && n > 0)
      i += 1
    } else if (arg === '--shots') {
      options.shotDir = argv[i + 1]
      i += 1
    } else if (arg === '--help' || arg === '-h') options.help = true
    else options.target = arg
  }
  return options
}

function toUrl(target) {
  if (/^https?:\/\//i.test(target) || target.startsWith('file://')) return target
  return 'file://' + path.resolve(target)
}

function inspectPage() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })

  function normalize(value) {
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = '#000'
    context.fillStyle = value
    context.fillRect(0, 0, 1, 1)
    const data = context.getImageData(0, 0, 1, 1).data
    return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 }
  }

  function over(top, bottom) {
    const a = top.a + bottom.a * (1 - top.a)
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 }
    return {
      r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / a,
      g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / a,
      b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / a,
      a
    }
  }

  function luminance(color) {
    const channel = (value) => {
      const s = value / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b)
  }

  function ratio(a, b) {
    const la = luminance(a)
    const lb = luminance(b)
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  }

  function backgroundOf(element) {
    const layers = []
    let node = element
    while (node && node.nodeType === 1) {
      const style = getComputedStyle(node)
      if (style.backgroundImage !== 'none') return null
      const color = normalize(style.backgroundColor)
      if (color.a > 0) layers.push(color)
      if (color.a === 1) break
      node = node.parentElement
    }
    let result = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = layers.length - 1; i >= 0; i -= 1) result = over(layers[i], result)
    return result
  }

  function describe(element) {
    const id = element.id ? '#' + element.id : ''
    const cls = typeof element.className === 'string' && element.className.trim() ? '.' + element.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    return element.tagName.toLowerCase() + id + cls
  }

  function visible(element) {
    const style = getComputedStyle(element)
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  const contrast = []
  const seen = new Set()
  for (const element of document.body.querySelectorAll('*')) {
    const own = [...element.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
    if (own.length === 0 || !visible(element)) continue
    const style = getComputedStyle(element)
    const background = backgroundOf(element)
    if (!background) continue
    const foreground = over(normalize(style.color), background)
    const size = parseFloat(style.fontSize)
    const weight = Number(style.fontWeight) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const needed = large ? 3 : 4.5
    const value = ratio(foreground, background)
    if (value < needed) {
      const key = describe(element) + '|' + style.color + '|' + style.backgroundColor
      if (seen.has(key)) continue
      seen.add(key)
      contrast.push({ element: describe(element), text: own[0].textContent.trim().slice(0, 40), ratio: Math.round(value * 100) / 100, needed })
    }
  }

  const targets = []
  for (const element of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button]')) {
    if (!visible(element)) continue
    const style = getComputedStyle(element)
    if (element.tagName === 'A' && style.display === 'inline') continue
    const rect = element.getBoundingClientRect()
    if (rect.width < 24 || rect.height < 24) {
      targets.push({ element: describe(element), width: Math.round(rect.width), height: Math.round(rect.height) })
    }
  }

  const overflowing = []
  const limit = document.documentElement.clientWidth
  for (const element of document.body.querySelectorAll('*')) {
    if (!visible(element)) continue
    const rect = element.getBoundingClientRect()
    if (rect.right > limit + 1) overflowing.push({ element: describe(element), right: Math.round(rect.right) })
  }

  return {
    overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    overflowing: overflowing.slice(0, 10),
    contrast,
    targets,
    h1Count: document.querySelectorAll('h1').length,
    imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
    unlabeledInputs: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')].filter((el) => !el.labels || el.labels.length === 0).filter((el) => !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')).length
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help || !options.target) {
    console.log('Usage: node check-render.js <file-or-url> [--widths 360,1280] [--shots dir] [--json]')
    return options.help ? 0 : 2
  }
  let playwright
  try {
    playwright = require('playwright')
  } catch {
    console.error('Playwright is not installed. Install it (npm i playwright) or inspect the page manually at 360px and 1280px.')
    return 2
  }
  const url = toUrl(options.target)
  const isFile = url.startsWith('file://')
  const browser = await playwright.chromium.launch()
  const results = []
  for (const width of options.widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    if (isFile) await page.route('**/*', (route) => (route.request().url().startsWith('file:') || route.request().url().startsWith('data:') ? route.continue() : route.abort()))
    await page.goto(url, { waitUntil: 'load' })
    const report = await page.evaluate(inspectPage)
    if (options.shotDir) {
      fs.mkdirSync(options.shotDir, { recursive: true })
      await page.screenshot({ path: path.join(options.shotDir, `shot-${width}.png`), fullPage: true })
    }
    results.push({ width, ...report })
    await page.close()
  }
  await browser.close()
  const problems = results.reduce((sum, r) => sum + (r.overflowPx > 0 ? 1 : 0) + r.contrast.length + r.targets.length + (r.h1Count === 1 ? 0 : 1) + r.imagesWithoutAlt + r.unlabeledInputs, 0)
  if (options.json) {
    console.log(JSON.stringify({ url, problems, results }, null, 2))
  } else {
    for (const r of results) {
      console.log(`Width ${r.width}px`)
      console.log(`  horizontal overflow: ${r.overflowPx > 0 ? r.overflowPx + 'px' : 'none'}`)
      r.overflowing.forEach((o) => console.log(`    wider than viewport: ${o.element} (right edge ${o.right}px)`))
      console.log(`  h1 count: ${r.h1Count}${r.h1Count === 1 ? '' : '  (expected 1)'}`)
      console.log(`  images without alt: ${r.imagesWithoutAlt}`)
      console.log(`  inputs without label: ${r.unlabeledInputs}`)
      console.log(`  low contrast items: ${r.contrast.length}`)
      r.contrast.slice(0, MAX_REPORTED).forEach((c) => console.log(`    ${c.element} "${c.text}" ratio ${c.ratio} (needs ${c.needed})`))
      console.log(`  targets under 24x24: ${r.targets.length}`)
      r.targets.slice(0, MAX_REPORTED).forEach((t) => console.log(`    ${t.element} ${t.width}x${t.height}`))
    }
    console.log(`Problems found: ${problems}`)
  }
  return problems > 0 ? 1 : 0
}

main().then((code) => {
  process.exitCode = code
})
