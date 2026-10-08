const nf = new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 })
export const money = (n) => `${nf.format(Number(n) || 0)} ر.س`
export const num = (n) => nf.format(Number(n) || 0)
export const date = (d) => new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d))
export const dateTime = (d) => new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(d))
export const effectivePrice = (p) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)
// The store's WhatsApp and phone (0536090915). Fixed here so an old setting can't override it.
export const WHATSAPP = '966536090915'
export const EMAIL = 'info@rraed.com'
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

// ---- product options (same rules as place_order in the database) ----
// A selection is a list of "optionId:valueId" keys. Unknown keys are ignored.
export const optKey = (o, v) => `${o.id}:${v.id}`
export function chosenOptions(p, sel = []) {
  const set = new Set(sel), out = []
  for (const o of p?.options || []) for (const v of o.values) if (set.has(optKey(o, v))) out.push({ option: o.name, value: v.name, price: Number(v.price) || 0 })
  return out
}
export const unitPrice = (p, sel) => effectivePrice(p) + chosenOptions(p, sel).reduce((s, c) => s + c.price, 0)
// required choices still missing (names), for the add-to-cart check
export const missingOptions = (p, sel = []) => (p?.options || []).filter((o) => o.required && !o.values.some((v) => sel.includes(optKey(o, v)))).map((o) => o.name)
// keeps only keys that still exist on the product (an option may have been removed since it was added to the cart)
export const cleanSelection = (p, sel = []) => { const ok = new Set((p?.options || []).flatMap((o) => o.values.map((v) => optKey(o, v)))); return [...new Set(sel)].filter((k) => ok.has(k)).sort() }
