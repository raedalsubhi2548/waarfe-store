// Store designer: the owner's look-and-feel settings (logo, colours, background, header, footer and the home page
// as an ordered list of blocks). Saved as one JSON row (site_settings, id 'main'), baked into the pre-rendered
// pages and applied live. Every value is checked here before it reaches the page.
import { waLink } from './format.js'

export const DEFAULT_SETTINGS = {
  logo: '/logo-300.png', // on light backgrounds (header after scrolling, menus)
  logoLight: '/logo-white.png', // on dark backgrounds (hero, footer)
  logoScale: 100, // percent
  colors: { primary: '#1b2b44', accent: '#c3cedd', background: '#fbfcfe' },
  announcement: { on: false, text: '', link: '' },
}


// ---------- home page blocks ----------
// Each block type: a name, an icon (lucide name, for the designer) and its fields. Field kinds:
// text · textarea · link · image · switch · select · number · category · product · products · items
export const ICONS = ['store', 'landing', 'analytics', 'shield', 'chat', 'clock'] // the line drawings in LineArt
export const BLOCKS = {
  hero: { name: 'الواجهة الرئيسية', icon: 'Sparkles', hint: 'صورة كبيرة بعنوان وزر، أول ما يشوفه الزائر.', fields: [
    ['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title1', 'العنوان (السطر الأول)', 'text', 60], ['title2', 'العنوان (السطر الثاني)', 'text', 60],
    ['text', 'الوصف', 'textarea', 220], ['cta', 'نص الزر', 'text', 30], ['ctaLink', 'رابط الزر', 'link'],
    ['image', 'صورة الخلفية (كمبيوتر)', 'image'], ['imageMobile', 'صورة الخلفية (جوال)', 'image'], ['showStats', 'إظهار شارة التقييم وعدد الطلبات', 'switch'],
  ] },
  banner: { name: 'بانر صورة', icon: 'Image', hint: 'صورة إعلانية بعرض الصفحة أو داخل إطار، ولها رابط.', fields: [
    ['image', 'الصورة (كمبيوتر)', 'image'], ['imageMobile', 'الصورة (جوال، اختياري)', 'image'], ['link', 'الرابط (اختياري)', 'link'], ['alt', 'وصف الصورة (لقوقل)', 'text', 120],
    ['size', 'العرض', 'select', [['container', 'داخل إطار'], ['full', 'بعرض الشاشة']]],
  ] },
  promises: { name: 'مميزات المتجر', icon: 'BadgeCheck', hint: 'ثلاث نقاط قصيرة مع رسومات.', fields: [['items', 'المميزات', 'items']] },
  products: { name: 'منتجات', icon: 'LayoutGrid', hint: 'رف منتجات: من قسم، أو تختارها بنفسك، أو الأحدث.', fields: [
    ['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 60],
    ['source', 'المنتجات', 'select', [['category', 'من قسم'], ['picked', 'أختارها بنفسي'], ['latest', 'الأحدث'], ['featured', 'المميزة']]],
    ['category', 'القسم', 'category'], ['ids', 'اختر المنتجات', 'products'], ['limit', 'عدد المنتجات', 'number', [2, 12]], ['viewAll', 'زر «عرض الكل»', 'switch'],
  ] },
  categories: { name: 'أقسام المتجر', icon: 'Shapes', hint: 'كل أقسام المتجر بصورها.', fields: [['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 60]] },
  imageText: { name: 'صورة مع نص', icon: 'PanelLeft', hint: 'صورة بجانبها عنوان ووصف وزر.', fields: [
    ['kicker', 'سطر صغير', 'text', 60], ['title', 'العنوان', 'text', 60], ['accent', 'سطر ثاني للعنوان', 'text', 60], ['text', 'الوصف', 'textarea', 260],
    ['cta', 'نص الزر', 'text', 30], ['link', 'الرابط', 'link'], ['image', 'الصورة', 'image'], ['priceOf', 'إظهار سعر منتج (اختياري)', 'product'], ['payIcons', 'إظهار شعارات الدفع', 'switch'],
  ] },
  text: { name: 'نص حر', icon: 'Type', hint: 'عنوان وفقرة، مع زر اختياري.', fields: [
    ['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 80], ['text', 'النص', 'textarea', 900],
    ['cta', 'نص الزر (اختياري)', 'text', 30], ['link', 'رابط الزر', 'link'], ['align', 'المحاذاة', 'select', [['center', 'وسط'], ['start', 'يمين']]],
  ] },
  gallery: { name: 'معرض الأعمال', icon: 'GalleryHorizontal', hint: 'صور أعمالكم تتحرك في صفين.', fields: [['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 60], ['text', 'الوصف', 'textarea', 160]] },
  reviews: { name: 'آراء العملاء', icon: 'MessageSquareQuote', hint: 'تقييمات العملاء تتحرك في صفين.', fields: [['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 60]] },
  faq: { name: 'الأسئلة الشائعة', icon: 'CircleHelp', hint: 'أسئلة تتكرر مع إجاباتها.', fields: [['eyebrow', 'سطر صغير فوق العنوان', 'text', 60], ['title', 'العنوان', 'text', 60]] },
}

const HERO = {
  eyebrow: 'تصميم متاجر سلة', title1: 'متجرك يستاهل', title2: 'تصميم يليق فيه',
  text: 'نصمم متجرك في سلة ونجهّزه للبيع خلال يومين إلى ستة أيام، بتفاصيل تشبه علامتك.',
  cta: 'ابدأ متجرك', ctaLink: '/salla-store-design', image: '', imageMobile: '', showStats: true,
}
/** What a freshly added block starts with. */
export const BLOCK_DEFAULTS = {
  hero: HERO,
  banner: { image: '', imageMobile: '', link: '', alt: '', size: 'container' },
  promises: { items: [{ icon: 'clock', title: 'تسليم المتجر', text: 'من يومين إلى 6 أيام' }, { icon: 'shield', title: 'دفع آمن', text: 'مدى، فيزا، ماستركارد وApple Pay' }, { icon: 'chat', title: 'تواصل مباشر', text: 'على واتساب طول التنفيذ' }] },
  products: { eyebrow: '', title: 'منتجاتنا', source: 'latest', category: '', ids: [], limit: 4, viewAll: true },
  categories: { eyebrow: 'كل ما يحتاجه متجرك', title: 'أقسام المتجر' },
  imageText: { kicker: '', title: 'عنوان جذاب', accent: '', text: '', cta: 'اطلب الحين', link: '/shop', image: '', priceOf: '', payIcons: false },
  text: { eyebrow: '', title: 'عنوان القسم', text: 'اكتب هنا النص اللي تبيه يظهر لعملائك.', cta: '', link: '', align: 'center' },
  gallery: { eyebrow: 'من مكتب منصة رائد', title: 'بنرات وتصاميم سوشال ميديا', text: 'نماذج حقيقية من شغلنا لعملائنا، مرّر عليها عشان توقف.' },
  reviews: { eyebrow: 'آراء عملائنا', title: 'وش قالوا عن شغلنا' },
  faq: { eyebrow: 'قبل ما تطلب', title: 'أسئلة تتكرر' },
}

/** The home page as it was designed (used until the owner saves their own). */
export const defaultHome = (hero = {}) => [
  { id: 'hero', type: 'hero', on: true, ...HERO, ...hero },
  { id: 'promises', type: 'promises', on: true, ...BLOCK_DEFAULTS.promises },
  { id: 'new', type: 'products', on: true, eyebrow: 'جديدنا ومميزاتنا', title: 'الأكثر طلباً عند عملائنا', source: 'picked', category: '', ids: ['salla-store-design', 'landing-page-design', 'google-tools-integration', 'ai-integration-chatgpt-claude-salla'], limit: 4, viewAll: true, viewAllTo: '/shop' },
  { id: 'landing', type: 'imageText', on: true, kicker: 'طفشت من الاشتراكات الشهرية؟', title: 'صفحة هبوط مبرمجة لك', accent: 'بدون اشتراك شهري', text: 'مبرمجة بـ HTML وCSS وJavaScript، مع دومين واستضافة سنة هدية.', cta: 'اطلبها الحين', link: '/landing-page-design', image: '/brand/ai/raed-landing.webp', priceOf: 'landing-page-design', payIcons: false },
  { id: 'categories', type: 'categories', on: true, ...BLOCK_DEFAULTS.categories },
  { id: 'design', type: 'products', on: true, eyebrow: 'نصمم لعلامتك', title: 'خدمات التصميم', source: 'category', category: 'design-services', ids: [], limit: 4, viewAll: true },
  { id: 'marketing', type: 'products', on: true, eyebrow: 'نوصّلك لعملائك', title: 'خدمات التسويق', source: 'category', category: 'marketing-services', ids: [], limit: 4, viewAll: true },
  { id: 'payments', type: 'imageText', on: true, kicker: 'ادفع بالطريقة اللي تريحك', title: 'قسّم قيمة متجرك', accent: 'على دفعات مريحة', text: 'ادفع بـ Apple Pay أو فيزا أو ماستركارد، أو قسّطها مع تمارا وتابي.', cta: 'اسألنا عن التقسيط', link: waLink('السلام عليكم، أبي أعرف عن تقسيط قيمة الخدمة'), image: '/brand/ai/raed-installments.webp', priceOf: '', payIcons: true },
  { id: 'government', type: 'products', on: true, eyebrow: 'أوراقك الرسمية', title: 'الخدمات الحكومية', source: 'category', category: 'government-services', ids: [], limit: 4, viewAll: true },
  { id: 'gallery', type: 'gallery', on: true, ...BLOCK_DEFAULTS.gallery },
  { id: 'reviews', type: 'reviews', on: true, ...BLOCK_DEFAULTS.reviews },
  { id: 'faq', type: 'faq', on: true, ...BLOCK_DEFAULTS.faq },
]

const SLUG = /^[\w؀-ۿ-]{1,80}$/ // product / category ids
function cleanBlock(b) {
  if (!b || typeof b !== 'object' || !BLOCKS[b.type]) return null
  const def = BLOCK_DEFAULTS[b.type]
  const out = { id: typeof b.id === 'string' && /^[\w-]{1,40}$/.test(b.id) ? b.id : 'b' + Math.random().toString(36).slice(2, 8), type: b.type, on: b.on !== false }
  for (const [key, , kind, opt] of BLOCKS[b.type].fields) {
    const v = b[key], d = def[key]
    if (kind === 'text' || kind === 'textarea') out[key] = text(v, d, opt)
    else if (kind === 'link') out[key] = safeLink(v, typeof v === 'string' && !v.trim() ? '' : d)
    else if (kind === 'image') out[key] = safeUrl(v, '')
    else if (kind === 'switch') out[key] = typeof v === 'boolean' ? v : !!d
    else if (kind === 'select') out[key] = opt.some(([x]) => x === v) ? v : d
    else if (kind === 'number') out[key] = Math.min(opt[1], Math.max(opt[0], Math.round(Number(v)) || d))
    else if (kind === 'category' || kind === 'product') out[key] = typeof v === 'string' && (v === '' || SLUG.test(v)) ? v : d
    else if (kind === 'products') out[key] = Array.isArray(v) ? v.filter((x) => typeof x === 'string' && SLUG.test(x)).slice(0, 12) : d
    else if (kind === 'items') out[key] = Array.isArray(v) ? v.slice(0, 4).map((x) => ({ icon: ICONS.includes(x?.icon) ? x.icon : 'store', title: text(x?.title, '', 40), text: text(x?.text, '', 60) })) : d
  }
  if (typeof b.viewAllTo === 'string') out.viewAllTo = safeLink(b.viewAllTo, '')
  return out
}

export const DEFAULT_HEADER_LINKS = [{ label: 'كل الخدمات', to: '/shop' }, { label: 'أعمالنا', to: '/work' }, { label: 'آراء العملاء', to: '/reviews' }, { label: 'تواصل', to: '/contact' }]
export const DEFAULT_CTA = ['محتار من وين تبدأ؟', 'قل لنا وش نشاطك، ونرتّب لك اللي تحتاجه فعلاً.']
export const DEFAULT_ABOUT = 'نصمم متجرك ونسوّقه ونجهّز أوراقه الرسمية، من جهة وحدة.'

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
    // the first designer kept the hero on its own; it now lives in the home blocks
    home: (Array.isArray(s.home) ? s.home : defaultHome(typeof s.hero === 'object' ? s.hero : {})).slice(0, 30).map(cleanBlock).filter(Boolean),
    background: { image: safeUrl(s.background?.image, ''), decor: s.background?.decor !== false },
    header: {
      links: Array.isArray(s.header?.links) ? s.header.links.slice(0, 6).map((l) => ({ label: text(l?.label, '', 24), to: safeLink(l?.to, '') })).filter((l) => l.label && l.to) : DEFAULT_HEADER_LINKS,
      search: s.header?.search !== false, wishlist: s.header?.wishlist !== false,
    },
    footer: {
      about: text(s.footer?.about, DEFAULT_ABOUT, 200), payments: s.footer?.payments !== false,
      cta: s.footer?.cta !== false, ctaTitle: text(s.footer?.ctaTitle, DEFAULT_CTA[0], 60) || DEFAULT_CTA[0], ctaText: text(s.footer?.ctaText, DEFAULT_CTA[1], 140),
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
  let css = v.length ? `:root{${v.map(([k, x]) => `${k}:${x}`).join(';')}}` : ''
  // a background picture behind the whole store (characters that could end the url() are escaped)
  if (s.background.image) css += `body{background-image:url("${s.background.image.replace(/["\\\n\r()]/g, encodeURIComponent)}");background-size:cover;background-position:center;background-attachment:fixed}`
  return css
}
