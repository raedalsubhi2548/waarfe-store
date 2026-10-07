// Branded product covers drawn in code (navy, white and silver), so every service has a clean
// on-brand image until the owner uploads a real one from the dashboard.

const GLYPHS = {
  // pen nib + ruler — design
  'design-services': '<path d="M200 120 L246 214 L200 270 L154 214 Z" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linejoin="round"/><circle cx="200" cy="214" r="11" fill="#e6ecf5"/><path d="M200 225 V270" stroke="#e6ecf5" stroke-width="7"/><path d="M150 300 H250" stroke="#9fb0c8" stroke-width="7" stroke-linecap="round"/>',
  // megaphone + waves — marketing
  'marketing-services': '<path d="M140 190 H172 L246 150 V266 L172 226 H140 Z" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linejoin="round"/><path d="M172 226 L186 282 H206 L196 232" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linejoin="round"/><path d="M270 180 Q290 208 270 236 M290 160 Q322 208 290 256" fill="none" stroke="#9fb0c8" stroke-width="7" stroke-linecap="round"/>',
  // key — subscriptions
  subscriptions: '<circle cx="168" cy="200" r="38" fill="none" stroke="#e6ecf5" stroke-width="7"/><circle cx="168" cy="200" r="12" fill="#9fb0c8"/><path d="M206 200 H286 M256 200 V228 M276 200 V220" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linecap="round"/>',
  // document + seal — government
  'government-services': '<path d="M152 130 H232 L262 160 V290 H152 Z" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linejoin="round"/><path d="M176 180 H236 M176 206 H236 M176 232 H212" stroke="#9fb0c8" stroke-width="6" stroke-linecap="round"/><circle cx="246" cy="270" r="24" fill="#c3cedd"/><path d="M236 270 l7 7 l13 -14" fill="none" stroke="#1b2b44" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
  // open book — digital products
  'digital-products': '<path d="M200 160 Q160 140 124 150 V272 Q160 262 200 282 Q240 262 276 272 V150 Q240 140 200 160 Z" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linejoin="round"/><path d="M200 160 V282" stroke="#9fb0c8" stroke-width="6"/>',
}

const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export function coverFor(p) {
  const h = hash(p.id)
  const rot = (h % 70) - 35
  const glyph = GLYPHS[p.categoryId] || GLYPHS['design-services']
  const deep = ['#0f1a2c', '#13213a', '#162640'][h % 3]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
<defs>
<radialGradient id="g" cx="${30 + (h % 40)}%" cy="20%" r="95%"><stop offset="0" stop-color="#3a5689"/><stop offset=".55" stop-color="#1b2b44"/><stop offset="1" stop-color="${deep}"/></radialGradient>
<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#9fb0c8" stop-opacity=".05"/></linearGradient>
</defs>
<rect width="400" height="400" fill="url(#g)"/>
<g transform="rotate(${rot} 200 200)"><path d="M70 230 A140 140 0 1 1 300 330" fill="none" stroke="url(#s)" stroke-width="16" stroke-linecap="round"/></g>
<path d="M-10 ${330 + (h % 30)} Q120 ${300 + (h % 40)} 220 ${340 - (h % 20)} T420 ${320 + (h % 30)}" fill="none" stroke="#ffffff" stroke-opacity=".12" stroke-width="3"/>
${glyph}
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
