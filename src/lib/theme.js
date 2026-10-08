// Store designer: the owner's look-and-feel settings (logo, colours, announcement bar, hero).
// Saved as one JSON row (site_settings, id 'main'), baked into the pre-rendered pages and applied live.

export const DEFAULT_SETTINGS = {
  logo: '/logo-300.png', // on light backgrounds (header after scrolling, menus)
  logoLight: '/logo-white.png', // on dark backgrounds (hero, footer)
  logoScale: 100, // percent
  colors: { primary: '#1b2b44', accent: '#c3cedd', background: '#fbfcfe' },
  announcement: { on: false, text: '', link: '' },
  hero: {
    eyebrow: 'تصميم متاجر سلة',
    title1: 'متجرك يستاهل',
    title2: 'تصميم يليق فيه',
    text: 'نصمم متجرك في سلة ونجهّزه للبيع خلال يومين إلى ستة أيام، بتفاصيل تشبه علامتك.',
    cta: 'ابدأ متجرك',
    ctaLink: '/salla-store-design',
    image: '', // desktop scene; empty = the built-in one
    imageMobile: '',
  },
}

/** Ready-made palettes the owner can start from. */
export const PRESETS = [
  { name: 'كحلي (الأصلي)', primary: '#1b2b44', accent: '#c3cedd', background: '#fbfcfe' },
  { name: 'أسود وذهبي', primary: '#161616', accent: '#d4b06a', background: '#fbf9f5' },
  { name: 'أخضر زيتي', primary: '#1f3b2d', accent: '#c9b37e', background: '#f8f7f2' },
  { name: 'عنابي', primary: '#4a1626', accent: '#e2c2a4', background: '#fdf9f7' },
  { name: 'بنفسجي', primary: '#2d1f4f', accent: '#c7b8ec', background: '#faf9fe' },
  { name: 'بني قهوة', primary: '#3b2a20', accent: '#d9b98f', background: '#fbf8f4' },
]

const HEX = /^#[0-9a-f]{6}$/i
const safeColor = (v, d) => (typeof v === 'string' && HEX.test(v.trim()) ? v.trim().toLowerCase() : d)
// images and links: our own paths or https only (the values end up in src/href attributes)
const safeUrl = (v, d = '') => (typeof v === 'string' && (/^\/(?!\/)/.test(v.trim()) || /^https:\/\//i.test(v.trim()) || /^data:image\/(png|jpe?g|webp|svg\+xml);base64,/i.test(v.trim())) ? v.trim() : d)
const safeLink = (v, d = '') => (typeof v === 'string' && (/^\/(?!\/)/.test(v.trim()) || /^https:\/\//i.test(v.trim())) ? v.trim() : d)
const text = (v, d, max = 160) => (typeof v === 'string' ? v.slice(0, max) : d)

/** Saved settings on top of the defaults, every value checked. */
export function mergeSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {}
  const D = DEFAULT_SETTINGS
  const c = s.colors || {}, a = s.announcement || {}, h = s.hero || {}
  return {
    logo: safeUrl(s.logo, D.logo) || D.logo,
    logoLight: safeUrl(s.logoLight, D.logoLight) || D.logoLight,
    logoScale: Math.min(160, Math.max(60, Number(s.logoScale) || D.logoScale)),
    colors: { primary: safeColor(c.primary, D.colors.primary), accent: safeColor(c.accent, D.colors.accent), background: safeColor(c.background, D.colors.background) },
    announcement: { on: !!a.on && !!String(a.text || '').trim(), text: text(a.text, '', 140), link: safeLink(a.link) },
    hero: {
      eyebrow: text(h.eyebrow, D.hero.eyebrow, 60), title1: text(h.title1, D.hero.title1, 60), title2: text(h.title2, D.hero.title2, 60),
      text: text(h.text, D.hero.text, 220), cta: text(h.cta, D.hero.cta, 30) || D.hero.cta, ctaLink: safeLink(h.ctaLink, D.hero.ctaLink) || D.hero.ctaLink,
      image: safeUrl(h.image), imageMobile: safeUrl(h.imageMobile),
    },
  }
}

// --- colour maths (sRGB mixing is enough for tints and shades) ---
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const hex = (c) => '#' + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')
const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)) }
const lum = (h) => { const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }

/** CSS that re-tints the design tokens (src/styles/tokens.css). Empty for the original palette. */
export function themeCss(settings) {
  const s = mergeSettings(settings)
  const D = DEFAULT_SETTINGS.colors
  const { primary: P, accent: A, background: B } = s.colors
  const v = []
  if (P !== D.primary) {
    v.push(['--p-green-950', mix(P, '#000000', 0.42)], ['--p-green-900', P], ['--p-green-800', mix(P, '#ffffff', 0.08)], ['--p-green-700', mix(P, '#ffffff', 0.18)],
      ['--p-green-600', mix(P, '#ffffff', 0.3)], ['--p-green-200', mix(P, '#ffffff', 0.78)], ['--p-green-100', mix(P, '#ffffff', 0.88)], ['--p-green-50', mix(P, '#ffffff', 0.94)],
      ['--p-ink-900', mix(P, '#000000', 0.42)], ['--p-ink-600', mix(P, '#6b7280', 0.6)])
  }
  if (A !== D.accent || P !== D.primary) {
    // accent text must stay readable on the light background
    let t = 0.55, txt = mix(A, P, t)
    while (contrast(txt, B) < 4.6 && t < 0.95) { t += 0.05; txt = mix(A, P, t) }
    v.push(['--p-gold-700', txt], ['--p-gold-600', mix(A, P, 0.4)], ['--p-gold-500', mix(A, P, 0.18)], ['--p-gold-400', A], ['--p-gold-200', mix(A, '#ffffff', 0.45)], ['--p-gold-100', mix(A, '#ffffff', 0.7)])
  }
  if (B !== D.background || P !== D.primary) {
    v.push(['--p-cream-50', B], ['--p-cream-100', mix(B, P, 0.035)], ['--p-cream-200', mix(B, P, 0.1)], ['--p-cream-300', mix(B, P, 0.16)])
  }
  if (s.logoScale !== 100) v.push(['--logo-scale', String(s.logoScale / 100)])
  return v.length ? `:root{${v.map(([k, x]) => `${k}:${x}`).join(';')}}` : ''
}
