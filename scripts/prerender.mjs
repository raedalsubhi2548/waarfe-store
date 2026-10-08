// After `vite build`: write a real HTML file for every public page (own title, description,
// canonical, Open Graph, JSON-LD and readable content), plus sitemap.xml and robots.txt.
// The SPA still boots on top of each page, so visitors see no difference.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { seedProducts, seedCategories } from '../src/data/seed.js'
import { FAQ } from '../src/data/content.js'
import { ALL_REVIEWS } from '../src/data/reviews.js'
import { POLICY_SECTIONS } from '../src/data/terms.js'
import { SITE, WA_LOCAL, seoFor, headHtml } from '../src/lib/seo.js'
import { productPath, fromSlug } from '../src/lib/slug.js'

const DIST = new URL('../dist/', import.meta.url).pathname
const template = readFileSync(join(DIST, 'index.html'), 'utf8')
const data = { products: seedProducts, categories: seedCategories, faq: FAQ, reviews: ALL_REVIEWS }
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const money = (n) => `${n} ر.س`
const price = (p) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)
const nav = `<nav><a href="/">الرئيسية</a> · <a href="/shop">كل الخدمات</a> · ${seedCategories.map((c) => `<a href="/c/${c.id}">${esc(c.name)}</a>`).join(' · ')} · <a href="/work">أعمالنا</a> · <a href="/reviews">آراء العملاء</a> · <a href="/contact">تواصل معنا</a></nav>`
const list = (ps) => `<ul>${ps.map((p) => `<li><a href="${productPath(p.id)}">${esc(p.name)}</a> — ${money(price(p))}</li>`).join('')}</ul>`

function body(path) {
  if (path === '/') return `<h1>${esc(SITE.name)}: تصميم متاجر سلة وصفحات هبوط وتسويق</h1><p>${esc(SITE.description)}</p>${seedCategories.map((c) => `<h2><a href="/c/${c.id}">${esc(c.name)}</a></h2><p>${esc(c.blurb || '')}</p>${list(seedProducts.filter((p) => p.categoryId === c.id))}`).join('')}<h2>أسئلة تتكرر</h2>${FAQ.map((q) => `<h3>${esc(q.q)}</h3><p>${esc(q.a)}</p>`).join('')}`
  if (path === '/shop') return `<h1>كل الخدمات</h1>${list(seedProducts)}`
  const c = path.match(/^\/c\/(.+)$/)?.[1]
  if (c) { const cat = seedCategories.find((x) => x.id === c); return `<h1>${esc(cat.name)}</h1><p>${esc(cat.blurb || '')}</p>${list(seedProducts.filter((p) => p.categoryId === c))}` }
  const id = path.match(/^\/p\/(.+)$/)?.[1]
  if (id) { const p = seedProducts.find((x) => x.id === fromSlug(id)); return `<h1>${esc(p.name)}</h1><p><strong>${money(price(p))}</strong></p><p>${esc(p.summary || '')}</p><div>${esc(p.description || '').replace(/\n/g, '<br>')}</div>` }
  if (path === '/reviews') return `<h1>آراء العملاء</h1>${ALL_REVIEWS.map((r) => `<blockquote><p>${esc(r.text)}</p><cite>${esc(r.name)}${r.city ? '، ' + esc(r.city) : ''}</cite></blockquote>`).join('')}`
  if (path === '/contact') return `<h1>تواصل معنا</h1><p>واتساب: <a href="https://wa.me/${SITE.phone.slice(1)}">${WA_LOCAL}</a></p><p>البريد: <a href="mailto:${SITE.email}">${SITE.email}</a></p>`
  if (path === '/work') return `<h1>أعمالنا: متاجر سلة صممناها</h1><p>متاجر صممناها في سلة، وبنرات وتصاميم سوشال ميديا لعملائنا.</p>`
  if (path === '/policies') return `<h1>السياسات والشروط</h1>${POLICY_SECTIONS.map((x) => `<h2>${esc(x.h)}</h2><ul>${x.p.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`).join('')}`
  return ''
}

// the home hero is the biggest thing on the first screen: start fetching it with the HTML, not after the app runs
const HERO_PRELOAD = '    <link rel="preload" as="image" href="/brand/ai/raed-hero-mobile-v3.webp" type="image/webp" media="(max-width: 767px)" fetchpriority="high" />\n    <link rel="preload" as="image" href="/brand/ai/raed-hero-v3.webp" type="image/webp" media="(min-width: 768px)" fetchpriority="high" />\n'

const routes = ['/', '/shop', '/work', '/reviews', '/contact', '/policies',
  ...seedCategories.map((c) => `/c/${c.id}`), ...seedProducts.map((p) => productPath(p.id))]

for (const path of routes) {
  const s = seoFor(path, data)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', `    ${headHtml(s)}\n${path === '/' ? HERO_PRELOAD : ''}  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="prerender">${nav}${body(path)}<p><a href="https://wa.me/${SITE.phone.slice(1)}">واتساب ${WA_LOCAL}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p></div></div>`)
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1) + '.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

// The SPA fallback for every other route keeps a neutral, crawlable head.
writeFileSync(join(DIST, '200.html'), template)

const today = new Date().toISOString().slice(0, 10)
const url = (p) => SITE.url.replace(/\/$/, '') + p
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${url(r === '/' ? '/' : r)}</loc><lastmod>${today}</lastmod><changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${r === '/' ? '1.0' : r.startsWith('/p/') ? '0.8' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`)
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /checkout
Disallow: /cart
Disallow: /order/
Disallow: /login
Disallow: /api/
Allow: /api/art

Sitemap: ${url('/sitemap.xml')}
`)
console.log(`prerendered ${routes.length} pages, sitemap.xml, robots.txt`)
