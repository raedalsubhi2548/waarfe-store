const nf = new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 })
export const money = (n) => `${nf.format(Number(n) || 0)} ر.س`
export const num = (n) => nf.format(Number(n) || 0)
export const date = (d) => new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d))
export const dateTime = (d) => new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(d))
export const effectivePrice = (p) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)
export const WHATSAPP = import.meta.env.VITE_WHATSAPP || '966545607555'
export const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

// Product descriptions use a light format: first paragraph, then "## heading" + "- item" lines.
export function parseDescription(text = '') {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const intro = []
  const sections = []
  for (const l of lines) {
    if (l.startsWith('## ')) sections.push({ title: l.slice(3), items: [] })
    else if (sections.length) sections[sections.length - 1].items.push(l.replace(/^-\s*/, ''))
    else intro.push(l)
  }
  return { intro: intro.join(' '), sections }
}
