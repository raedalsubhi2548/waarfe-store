// One source of truth for titles, descriptions, canonical links, social cards and structured
// data. Used at runtime (useSeo) and at build time (scripts/prerender.mjs) so crawlers that do
// not run JavaScript still get the full head for every public page.

export const SITE = {
  name: 'رائد',
  nameEn: 'Raed',
  // Browser: the address the visitor is on. Build: SITE_URL, else the Vercel production domain
  // (the custom domain once it is connected), else rraed.com.
  url: typeof window !== 'undefined' ? window.location.origin
    : (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://rraed.com')),
  phone: '+966536090915',
  email: 'info@rraed.com',
  logo: '/logo.png',
  ogImage: '/og.jpg',
  tagline: 'تصميم متاجر سلة وصفحات الهبوط والتسويق والخدمات التجارية',
  description: 'رائد: تصميم متاجر سلة احترافية، صفحات هبوط مبرمجة بدون اشتراك شهري، حملات إعلانية على سناب وتيك توك وإنستغرام، ربط أدوات قوقل والبكسل، والخدمات الحكومية للمتاجر في السعودية.',
}

const CAT_ART = {
  'design-services': '/brand/ai/raed-cat-design.webp',
  'marketing-services': '/brand/ai/raed-cat-marketing.webp',
  subscriptions: '/brand/ai/raed-cat-subscriptions.webp',
  'government-services': '/brand/ai/raed-cat-government.webp',
  'digital-products': '/brand/ai/raed-cat-digital.webp',
}

const abs = (p) => (p?.startsWith('http') ? p : SITE.url.replace(/\/$/, '') + p)
const clip = (s = '', n = 158) => { const t = String(s).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t }
const price = (p) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)

const ORG = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': abs('/#org'),
  name: `${SITE.name} | ${SITE.nameEn}`,
  alternateName: [SITE.name, SITE.nameEn],
  url: abs('/'),
  logo: abs(SITE.logo),
  image: abs(SITE.ogImage),
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  areaServed: { '@type': 'Country', name: 'المملكة العربية السعودية' },
  priceRange: 'SAR',
  contactPoint: [{ '@type': 'ContactPoint', telephone: SITE.phone, email: SITE.email, contactType: 'customer service', availableLanguage: ['ar', 'en'] }],
})

const WEBSITE = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: abs('/'),
  name: SITE.name,
  inLanguage: 'ar-SA',
  publisher: { '@id': abs('/#org') },
  potentialAction: { '@type': 'SearchAction', target: abs('/shop?q={search_term_string}'), 'query-input': 'required name=search_term_string' },
})

const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
})

/** Build the head for a route. data: { products, categories, product, category, faq, reviews } */
export function seoFor(path, data = {}) {
  const { products = [], categories = [], faq = [], reviews = [] } = data
  const base = { canonical: abs(path === '/' ? '/' : path), image: abs(SITE.ogImage), robots: 'index,follow', type: 'website', jsonLd: [] }
  const t = (s) => `${s} | ${SITE.name}`

  if (path === '/') {
    return {
      ...base,
      title: `${SITE.name} | تصميم متاجر سلة وصفحات هبوط وتسويق إلكتروني`,
      description: SITE.description,
      jsonLd: [ORG(), WEBSITE(),
        faq.length && { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) },
      ].filter(Boolean),
    }
  }
  if (path === '/shop') {
    return {
      ...base,
      title: t('كل الخدمات'),
      description: clip(`كل خدمات ${SITE.name} بأسعار ثابتة: ${categories.map((c) => c.name).join('، ')}.`),
      jsonLd: [crumbs([['الرئيسية', '/'], ['كل الخدمات', '/shop']]), itemList(products)],
    }
  }
  const cm = path.match(/^\/c\/([^/]+)$/)
  if (cm) {
    const c = data.category || categories.find((x) => x.id === cm[1])
    if (!c) return { ...base, title: t('القسم غير موجود'), description: SITE.description, robots: 'noindex' }
    const list = products.filter((p) => p.categoryId === c.id)
    return {
      ...base,
      title: t(c.name),
      description: clip(`${c.name} من ${SITE.name}: ${c.blurb || ''} ${list.slice(0, 4).map((p) => p.name).join('، ')}.`),
      image: abs(CAT_ART[c.id] || SITE.ogImage),
      jsonLd: [crumbs([['الرئيسية', '/'], ['كل الخدمات', '/shop'], [c.name, `/c/${c.id}`]]), itemList(list)],
    }
  }
  const pm = path.match(/^\/p\/([^/]+)$/)
  if (pm) {
    const p = data.product || products.find((x) => x.id === pm[1])
    if (!p) return { ...base, title: t('الخدمة غير موجودة'), description: SITE.description, robots: 'noindex' }
    const c = categories.find((x) => x.id === p.categoryId)
    const img = abs(CAT_ART[p.categoryId] || SITE.ogImage)
    return {
      ...base,
      type: 'product',
      title: t(p.name),
      description: clip(p.summary || p.description || `${p.name} من ${SITE.name}.`),
      image: img,
      price: price(p),
      jsonLd: [
        crumbs([['الرئيسية', '/'], ...(c ? [[c.name, `/c/${c.id}`]] : []), [p.name, `/p/${p.id}`]]),
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: clip(p.summary || p.description || p.name, 500),
          image: [img],
          sku: p.id,
          brand: { '@type': 'Brand', name: SITE.name },
          category: c?.name,
          offers: { '@type': 'Offer', url: abs(`/p/${p.id}`), priceCurrency: 'SAR', price: String(price(p)), availability: 'https://schema.org/InStock', seller: { '@id': abs('/#org') } },
          ...(reviews.length ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', bestRating: '5', reviewCount: String(reviews.length) } } : {}),
        },
      ],
    }
  }
  if (path === '/work') return { ...base, title: t('أعمالنا'), description: clip(`متاجر صممها ${SITE.name} في سلة، وبنرات وتصاميم سوشال ميديا لعملائنا.`), jsonLd: [crumbs([['الرئيسية', '/'], ['أعمالنا', '/work']])] }
  if (path === '/reviews') return { ...base, title: t('آراء العملاء'), description: clip(`${reviews.length} رأي مكتوب من عملاء ${SITE.name} عن تصميم المتاجر والخدمات، وكلها بتقييم 5 من 5.`), jsonLd: [crumbs([['الرئيسية', '/'], ['آراء العملاء', '/reviews']])] }
  if (path === '/contact') return { ...base, title: t('تواصل معنا'), description: clip(`تواصل مع ${SITE.name} على واتساب 0536090915 أو على البريد ${SITE.email}، ونرد عليك بنفس اليوم.`), jsonLd: [ORG(), crumbs([['الرئيسية', '/'], ['تواصل معنا', '/contact']])] }
  if (path === '/policies') return { ...base, title: t('السياسات والشروط'), description: clip(`سياسة الاستخدام والإلغاء والاسترجاع والخصوصية في ${SITE.name}.`) }
  // private or transactional pages
  return { ...base, title: SITE.name, description: SITE.description, robots: 'noindex,nofollow' }
}

function itemList(list) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/p/${p.id}`), name: p.name })),
  }
}

/** Render the head tags as an HTML string (build-time prerender). */
export function headHtml(s) {
  const e = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return [
    `<title>${e(s.title)}</title>`,
    `<meta name="description" content="${e(s.description)}" />`,
    `<meta name="robots" content="${e(s.robots)}" />`,
    `<link rel="canonical" href="${e(s.canonical)}" />`,
    `<meta property="og:site_name" content="${e(SITE.name)}" />`,
    `<meta property="og:locale" content="ar_SA" />`,
    `<meta property="og:type" content="${e(s.type)}" />`,
    `<meta property="og:title" content="${e(s.title)}" />`,
    `<meta property="og:description" content="${e(s.description)}" />`,
    `<meta property="og:url" content="${e(s.canonical)}" />`,
    `<meta property="og:image" content="${e(s.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(s.title)}" />`,
    `<meta name="twitter:description" content="${e(s.description)}" />`,
    `<meta name="twitter:image" content="${e(s.image)}" />`,
    ...(s.price != null ? [`<meta property="product:price:amount" content="${e(s.price)}" />`, `<meta property="product:price:currency" content="SAR" />`] : []),
    ...s.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
}
