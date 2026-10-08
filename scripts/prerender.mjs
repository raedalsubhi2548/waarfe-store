// After `vite build` (+ the SSR build in dist-ssr): write a real HTML file for every public page, rendered by the
// app itself with the live catalog (own title, description, canonical, Open Graph, JSON-LD), plus sitemap.xml and
// robots.txt. The browser hydrates that HTML with the same catalog, so the first paint needs no JavaScript.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { FAQ } from '../src/data/content.js'
import { ALL_REVIEWS } from '../src/data/reviews.js'
import { SITE, seoFor, headHtml } from '../src/lib/seo.js'
import { productPath, categoryPath, toSlug, RESERVED } from '../src/lib/slug.js'
import { render, loadCatalog } from '../dist-ssr/entry-server.js'

const DIST = new URL('../dist/', import.meta.url).pathname
// The stylesheet is inlined into every page: no render-blocking request before the first paint.
const template = readFileSync(join(DIST, 'index.html'), 'utf8').replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => `<style>${readFileSync(join(DIST, href.slice(1)), 'utf8').replace(/<\/style/gi, '<\\/style')}</style>`)
const catalog = await loadCatalog()
const { categories, products } = catalog
const data = { products, categories, faq: FAQ, reviews: ALL_REVIEWS }
// embedded for hydration; `<` escaped so no product text can close the script tag
const catalogJson = `<script type="application/json" id="__catalog">${JSON.stringify(catalog).replace(/</g, '\\u003c')}</script>`
// the home hero is the biggest thing on the first screen: start fetching it with the HTML, not after the app runs
const HERO_PRELOAD = '    <link rel="preload" as="image" href="/brand/ai/raed-hero-mobile-v3.webp" type="image/webp" media="(max-width: 767px)" fetchpriority="high" />\n    <link rel="preload" as="image" href="/brand/ai/raed-hero-v3.webp" type="image/webp" media="(min-width: 768px)" fetchpriority="high" />\n'

// categories and services share the top level with the fixed pages: a clash would hide one of them
const taken = new Set(RESERVED)
for (const slug of [...categories.map((c) => c.id), ...products.map((p) => toSlug(p.id))]) {
  if (taken.has(slug)) throw new Error(`address clash: /${slug}`)
  taken.add(slug)
}
const productSet = new Set(products.filter((p) => p.active !== false).map((p) => productPath(p.id)))

const routes = ['/', '/shop', '/work', '/reviews', '/contact', '/policies',
  ...categories.map((c) => categoryPath(c.id)), ...products.filter((p) => p.active !== false).map((p) => productPath(p.id))]

for (const path of routes) {
  const s = seoFor(path, data)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    // title, description and Open Graph come first in <head>: link previews (WhatsApp, X…) read only the start of the
    // page, and the inlined stylesheet would otherwise push them past that point
    .replace(/(<meta name="viewport"[^>]*>\n)/, `$1    ${headHtml(s)}\n`)
    .replace('</head>', `${path === '/' ? HERO_PRELOAD : ''}  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${await render(path, catalog)}</div>${catalogJson}`)
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
${routes.map((r) => `  <url><loc>${url(r === '/' ? '/' : r)}</loc><lastmod>${today}</lastmod><changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${r === '/' ? '1.0' : productSet.has(r) ? '0.8' : '0.6'}</priority></url>`).join('\n')}
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
console.log(`prerendered ${routes.length} pages (${products.length} products), sitemap.xml, robots.txt`)
process.exit(0) // the Supabase client keeps timers alive
