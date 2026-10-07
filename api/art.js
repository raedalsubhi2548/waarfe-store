// GET /api/art?f=<file on the old Salla CDN>&id=<product id>
// Lifts the laptop out of the old green artwork, clears its screen and draws the service's own
// line icon on it, then places it on the Raed navy background. Cached at the edge for a year, so each image is processed once.
import sharp from 'sharp'
import { glyphFor } from '../src/lib/cover.js'

const CDN = 'https://cdn.salla.sa/zvxNvp/'
const SIZE = 600

const hsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, c = mx - mn
  if (!c) return [0, 0, l]
  let h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4
  return [(h * 60 + 360) % 360, c / (1 - Math.abs(2 * l - 1) || 1), l]
}

// background = the green field, its darker shadow, the faint "W" pattern and the cream waves
const isBg = (r, g, b) => {
  const [h, s, l] = hsl(r, g, b)
  if (h >= 85 && h <= 215 && s > 0.1) return true // greens (field, pattern, shadow)
  if (l < 0.2 && g > r + 6 && g >= b) return true // near-black green shadow
  if (h >= 20 && h < 85 && s > 0.12 && l > 0.7) return true // cream waves
  return false
}

const BG = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 400 400">
<defs><radialGradient id="g" cx="50%" cy="34%" r="85%"><stop offset="0" stop-color="#34507f"/><stop offset=".55" stop-color="#1b2b44"/><stop offset="1" stop-color="#0f1a2c"/></radialGradient>
<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#9fb0c8" stop-opacity="0"/></linearGradient></defs>
<rect width="400" height="400" fill="url(#g)"/>
<circle cx="200" cy="196" r="132" fill="#fff" fill-opacity=".05"/>
<path d="M78 262 A132 132 0 1 1 312 300" fill="none" stroke="url(#s)" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="200" cy="290" rx="130" ry="12" fill="#000" fill-opacity=".35"/>
<path d="M-10 360 Q140 326 230 356 T410 344" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="3"/>
</svg>`

export default async function handler(req, res) {
  const f = String(req.query.f || '')
  if (!/^[\w.-]+\.(jpe?g|png|webp)$/i.test(f)) return res.status(400).end('bad file')
  const r = await fetch(CDN + f)
  if (!r.ok) return res.status(404).end('not found')

  const { data, info } = await sharp(Buffer.from(await r.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const px = (x, y) => (y * W + x) * 4

  // flood-fill the background in from every edge, so greens inside the screen stay untouched
  const bg = new Uint8Array(W * H)
  const stack = []
  const seed = (x, y) => { const k = y * W + x; if (!bg[k]) { const i = k * 4; if (isBg(data[i], data[i + 1], data[i + 2])) { bg[k] = 1; stack.push(k) } } }
  for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1) }
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y) }
  while (stack.length) {
    const k = stack.pop(), x = k % W, y = (k - x) / W
    if (x > 0) seed(x - 1, y); if (x < W - 1) seed(x + 1, y); if (y > 0) seed(x, y - 1); if (y < H - 1) seed(x, y + 1)
  }

  // keep only the biggest solid object (the device); compute its box
  let x0 = W, y0 = H, x1 = -1, y1 = -1
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!bg[y * W + x]) {
    // ignore stray specks: need a few solid neighbours
    let n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && !bg[yy * W + xx]) n++ }
    if (n < 18) continue
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  if (x1 < 0) return res.status(422).end('no product found')

  // alpha from the mask, softened by one pixel at the edge
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = y * W + x
    if (bg[k]) { data[k * 4 + 3] = 0; continue }
    let edge = 0; if (x > 0 && bg[k - 1]) edge++; if (x < W - 1 && bg[k + 1]) edge++; if (y > 0 && bg[k - W]) edge++; if (y < H - 1 && bg[k + W]) edge++
    data[k * 4 + 3] = edge ? 150 : 255
  }

  // find the screen: inside the black bezel, scanning in from each side of the laptop
  const dark = (x, y) => { const i = px(x, y); const [, s2, l] = hsl(data[i], data[i + 1], data[i + 2]); return l < 0.22 && s2 < 0.5 }
  const solid = (x, y) => !bg[y * W + x]
  const scan = (from, to, step, at) => { // returns first index after a dark run
    let seenDark = false
    for (let v = from; step > 0 ? v <= to : v >= to; v += step) {
      const [x, y] = at(v)
      if (!solid(x, y)) continue
      if (dark(x, y)) seenDark = true
      else if (seenDark) return v
    }
    return -1
  }
  const cx = Math.round((x0 + x1) / 2)
  const sTop = scan(y0, y1, 1, (v) => [cx, v])
  const sBot = scan(y1, y0, -1, (v) => [cx, v])
  const ym = Math.round((sTop + sBot) / 2)
  const sLeft = scan(x0, x1, 1, (v) => [v, ym])
  const sRight = scan(x1, x0, -1, (v) => [v, ym])
  if (req.query.debug) return res.json({ W, H, laptop: [x0, y0, x1, y1], screen: [sLeft, sTop, sRight, sBot] })
  const composites = []
  const sw = sRight - sLeft + 1, sh = sBot - sTop + 1
  if (sTop > 0 && sBot > sTop && sLeft > 0 && sRight > sLeft && sw > (x1 - x0) * 0.4 && sh > (y1 - y0) * 0.3) {
    const g = Math.round(sh * 0.9)
    const screen = `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}">
<defs><radialGradient id="g" cx="50%" cy="30%" r="90%"><stop offset="0" stop-color="#34507f"/><stop offset=".6" stop-color="#1b2b44"/><stop offset="1" stop-color="#0f1a2c"/></radialGradient></defs>
<rect width="${sw}" height="${sh}" fill="url(#g)"/>
<svg x="${Math.round((sw - g) / 2)}" y="${Math.round((sh - g) / 2)}" width="${g}" height="${g}" viewBox="104 104 192 192">${glyphFor({ id: String(req.query.id || ''), categoryId: '' })}</svg>
</svg>`
    composites.push({ input: Buffer.from(screen), left: sLeft, top: sTop })
  }

  const pad = 2
  const withScreen = composites.length ? await sharp(data, { raw: info }).composite(composites).raw().toBuffer() : data
  const cut = await sharp(withScreen, { raw: info })
    .extract({ left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad), width: Math.min(W, x1 + pad) - Math.max(0, x0 - pad) + 1, height: Math.min(H, y1 + pad) - Math.max(0, y0 - pad) + 1 })
    .resize({ width: Math.round(SIZE * 0.78), height: Math.round(SIZE * 0.62), fit: 'inside' })
    .png().toBuffer({ resolveWithObject: true })

  const left = Math.round((SIZE - cut.info.width) / 2)
  const top = Math.round(SIZE * 0.725 - cut.info.height) // sit the device on the shadow line
  const out = await sharp(Buffer.from(BG))
    .composite([{ input: cut.data, left, top: Math.max(8, top) }])
    .webp({ quality: 86 }).toBuffer()

  res.setHeader('Content-Type', 'image/webp')
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  res.end(out)
}
