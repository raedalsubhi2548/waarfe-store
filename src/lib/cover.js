// Product covers drawn in code: one hand-made line illustration per service, on the Raed navy.
// They stand in until the owner uploads a real photo from the dashboard.

const W = '#ffffff'   // main stroke
const S = '#c3cedd'   // silver accent
const N = '#1b2b44'   // navy (for fills inside light shapes)
const line = (d, c = W, w = 9) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
const dot = (x, y, r, c = S) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`

// Every glyph sits inside the 120–280 box so the set reads as one family.
const ICONS = {
  // storefront with awning and a door
  'salla-store-design': line('M128 172 L144 128 H256 L272 172') + line('M128 172 q18 22 36 0 q18 22 36 0 q18 22 36 0 q18 22 36 0', S) + line('M140 190 V276 H260 V190') + line('M186 276 V232 Q200 220 214 232 V276') + dot(242, 218, 6, S),
  // browser window with hero block, text lines and a cursor
  'landing-page-design': line('M120 136 H280 V264 H120 Z') + line('M120 160 H280') + dot(136, 148, 4, S) + dot(150, 148, 4, S) + dot(164, 148, 4, S) + line('M140 184 H220', S, 8) + line('M140 206 H196', W, 7) + line('M140 238 H192', S, 12) + line('M232 214 L268 228 L252 236 L262 256 L254 260 L244 240 L232 252 Z', W, 6),
  // billboard / banner frame with a mountain and sun
  'banner-design': line('M116 140 H284 V236 H116 Z') + line('M128 228 L172 182 L204 212 L228 192 L272 228', S) + dot(244, 166, 13, S) + line('M180 236 V276 M220 236 V276') + line('M160 276 H240'),
  // pen-tool nib with bezier handles
  'logo-design': line('M200 132 L242 206 L200 262 L158 206 Z') + dot(200, 206, 11, W) + line('M200 217 V262') + line('M128 150 H168 M232 150 H272', S, 6) + dot(128, 150, 9, S) + dot(272, 150, 9, S) + line('M168 150 Q200 120 232 150', S, 6),
  // box with option chips (size / colour / quantity)
  'add-product-options': line('M132 168 L184 144 L236 168 L184 192 Z') + line('M132 168 V230 L184 254 V192') + line('M236 168 V230 L184 254') + line('M246 164 H280 M246 196 H272 M246 228 H284', S, 9) + dot(246, 164, 7, W) + dot(246, 196, 7, W) + dot(246, 228, 7, W),
  // box with a plus badge
  'add-products': line('M136 176 L196 148 L256 176 L196 204 Z') + line('M136 176 V244 L196 272 V204') + line('M256 176 V244 L196 272') + `<circle cx="262" cy="140" r="26" fill="${S}"/>` + line('M262 126 V154 M248 140 H276', N, 7),
  // AI: a spark star with orbiting nodes (chat bubble)
  'ai-integration-chatgpt-claude-salla': line('M132 150 H268 Q280 150 280 162 V232 Q280 244 268 244 H178 L148 270 V244 H132 Q120 244 120 232 V162 Q120 150 132 150 Z') + line('M200 168 L208 190 L230 198 L208 206 L200 228 L192 206 L170 198 L192 190 Z', S, 6) + dot(246, 176, 6, W) + dot(154, 220, 6, W),
  // vertical phone with a story ring and a megaphone tag (no platform logos)
  'snapchat-ads-creation': line('M168 124 H232 Q244 124 244 136 V264 Q244 276 232 276 H168 Q156 276 156 264 V136 Q156 124 168 124 Z') + `<circle cx="200" cy="184" r="24" fill="none" stroke="${S}" stroke-width="7" stroke-dasharray="10 7"/>` + line('M178 232 H222 M186 250 H214', W, 7) + line('M262 168 L282 158 V202 L262 192 Z', S, 6),
  // short-video frame with play and a music note
  'tiktok-ads-creation': line('M150 128 H250 Q262 128 262 140 V260 Q262 272 250 272 H150 Q138 272 138 260 V140 Q138 128 150 128 Z') + line('M188 176 L224 198 L188 220 Z', S, 8) + line('M276 196 V244', W, 7) + `<ellipse cx="266" cy="246" rx="11" ry="9" fill="${W}"/>` + line('M276 196 L292 204', W, 7),
  // classic camera with lens (not the Instagram glyph)
  'instagram-ads-creation': line('M128 168 H164 L176 148 H224 L236 168 H272 Q284 168 284 180 V252 Q284 264 272 264 H128 Q116 264 116 252 V180 Q116 168 128 168 Z') + `<circle cx="200" cy="214" r="32" fill="none" stroke="${S}" stroke-width="9"/>` + dot(200, 214, 10, W) + dot(258, 188, 6, S),
  // code brackets with a tracking target
  'pixel-integration': line('M160 158 L120 200 L160 242') + line('M240 158 L280 200 L240 242') + `<circle cx="200" cy="200" r="30" fill="none" stroke="${S}" stroke-width="8"/>` + dot(200, 200, 10, W) + line('M200 152 V164 M200 236 V248 M152 200 H164 M236 200 H248', S, 6),
  // analytics bars with a magnifier
  'google-tools-integration': line('M124 268 H276') + line('M146 268 V220 M180 268 V188 M214 268 V206', S, 16) + `<circle cx="236" cy="160" r="30" fill="none" stroke="${W}" stroke-width="9"/>` + line('M258 182 L282 206') + line('M222 166 L232 152 L246 164', S, 6),
  // calendar with a renewal check
  'salla-subscription': line('M128 150 H272 V268 H128 Z') + line('M128 186 H272') + line('M164 132 V164 M236 132 V164') + line('M172 226 L192 246 L230 208', S, 10),
  // layered layout swatches with a brush
  'salla-theme': line('M124 150 H232 V246 H124 Z') + line('M124 178 H232', S, 7) + line('M140 198 H184 M140 220 H170', S, 7) + line('M260 132 L284 156 L222 218 L198 226 L206 202 Z') + dot(196, 230, 6, S),
  // globe with meridians
  'buy-domain': `<circle cx="200" cy="200" r="70" fill="none" stroke="${W}" stroke-width="9"/>` + line('M200 130 Q160 200 200 270 M200 130 Q240 200 200 270', S, 7) + line('M136 176 H264 M136 224 H264', S, 7),
  // building with a document
  'issue-commercial-registration-saudi': line('M128 274 H272') + line('M140 274 V178 L200 140 L260 178 V274') + line('M168 200 V246 M200 200 V246 M232 200 V246', S, 8) + line('M184 274 V258 H216 V274', W, 7),
  // ID card with a person
  'freelance-certificate-family-platform': line('M116 150 H284 V256 H116 Z') + `<circle cx="160" cy="194" r="18" fill="none" stroke="${S}" stroke-width="8"/>` + line('M134 238 Q160 214 186 238', S, 8) + line('M210 186 H262 M210 210 H252 M210 232 H240', W, 7),
  // shield with a check
  'business-verification': line('M200 128 L262 152 V204 Q262 250 200 276 Q138 250 138 204 V152 Z') + line('M172 202 L194 224 L232 182', S, 10),
  // card split into instalments (4 payments)
  'tabby-registration': line('M116 150 H284 V250 H116 Z') + line('M116 176 H284', S, 8) + dot(150, 222, 11, S) + dot(186, 222, 11, W) + dot(222, 222, 11, W) + dot(258, 222, 11, W),
  // pie split into quarters (pay in parts)
  'tmara-registration': `<circle cx="200" cy="200" r="68" fill="none" stroke="${W}" stroke-width="9"/>` + line('M200 132 V268 M132 200 H268') + `<path d="M200 200 L200 132 A68 68 0 0 1 268 200 Z" fill="${S}"/>`,
  // open book with a spark
  'waarfe-ai-ad-campaigns-guide': line('M200 164 Q160 144 120 154 V262 Q160 252 200 272 Q240 252 280 262 V154 Q240 144 200 164 Z') + line('M200 164 V272', S, 7) + line('M238 120 L244 136 L260 142 L244 148 L238 164 L232 148 L216 142 L232 136 Z', S, 5),
}

// Fallback glyphs by category (for services added later from the dashboard).
const BY_CATEGORY = {
  'design-services': ICONS['logo-design'],
  'marketing-services': line('M140 190 H172 L246 150 V266 L172 226 H140 Z') + line('M270 180 Q290 208 270 236', S),
  subscriptions: ICONS['salla-subscription'],
  'government-services': ICONS['business-verification'],
  'digital-products': ICONS['waarfe-ai-ad-campaigns-guide'],
}

/** Just the line drawing for a service (shared with /api/art, which puts it on the laptop screen). */
export const glyphFor = (p) => ICONS[p.id] || BY_CATEGORY[p.categoryId] || ICONS['logo-design']

const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export function coverFor(p) {
  const h = hash(p.id)
  const glyph = ICONS[p.id] || BY_CATEGORY[p.categoryId] || ICONS['logo-design']
  // same look as the product photos from /api/art: a framed navy print resting on the store's soft backdrop
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
<defs>
<linearGradient id="b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fbfcfe"/><stop offset="1" stop-color="#e6ecf4"/></linearGradient>
<radialGradient id="f" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#1b2b44" stop-opacity=".10"/><stop offset="1" stop-color="#1b2b44" stop-opacity="0"/></radialGradient>
<radialGradient id="g" cx="50%" cy="25%" r="90%"><stop offset="0" stop-color="#34507f"/><stop offset=".55" stop-color="#1b2b44"/><stop offset="1" stop-color="#0f1a2c"/></radialGradient>
<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".4"/><stop offset="1" stop-color="#9fb0c8" stop-opacity="0"/></linearGradient>
<filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="11"/></filter>
<clipPath id="c"><rect x="52" y="78" width="296" height="220" rx="12"/></clipPath>
</defs>
<rect width="400" height="400" fill="url(#b)"/>
<rect width="400" height="400" fill="url(#f)"/>
<path d="M-14 353 Q140 313 248 348 T414 336" fill="none" stroke="#1b2b44" stroke-opacity=".10" stroke-width="1.5"/>
<rect x="64" y="100" width="272" height="210" rx="12" fill="#1b2b44" fill-opacity=".38" filter="url(#sh)"/>
<rect x="48" y="74" width="304" height="228" rx="15" fill="#ffffff" stroke="#1b2b44" stroke-opacity=".08"/>
<g clip-path="url(#c)">
<rect x="52" y="78" width="296" height="220" fill="url(#g)"/>
<path d="M110 250 A100 100 0 1 1 290 262" fill="none" stroke="url(#s)" stroke-width="4" stroke-linecap="round" transform="rotate(${(h % 50) - 25} 200 188)"/>
<g transform="translate(200 188) scale(.8) translate(-200 -200)">${glyph}</g>
</g>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
