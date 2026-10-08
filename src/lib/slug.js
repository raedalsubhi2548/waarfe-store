// Public product addresses. Products keep their database ids; a few old ids carried the earlier
// store's name, so they get a clean address here (and the old one redirects in vercel.json).
const ALIAS = {}
const BACK = Object.fromEntries(Object.entries(ALIAS).map(([id, slug]) => [slug, id]))

export const toSlug = (id) => ALIAS[id] || id
export const fromSlug = (slug) => BACK[slug] || slug
export const productPath = (id) => `/p/${toSlug(id)}`
