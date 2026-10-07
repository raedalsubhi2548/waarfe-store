// GET /api/art?f=<file on the old Salla CDN>
// The old product images show the real artwork on a laptop screen over a green background.
// This returns just that artwork (what was on the screen), as a square image, no laptop, no green.
// Cached at the edge for a year, so each image is processed once.
import sharp from 'sharp'

const CDN = 'https://cdn.salla.sa/zvxNvp/'
const SIZE = 600

const hsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, c = mx - mn
  if (!c) return [0, 0, l]
  const h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4
  return [(h * 60 + 360) % 360, c / (1 - Math.abs(2 * l - 1) || 1), l]
}

// background = the green field, its darker shadow, the faint "W" pattern and the cream waves
const isBg = (r, g, b) => {
  const [h, s, l] = hsl(r, g, b)
  if (h >= 85 && h <= 215 && s > 0.1) return true
  if (l < 0.2 && g > r + 6 && g >= b) return true
  if (h >= 20 && h < 85 && s > 0.12 && l > 0.7) return true
  return false
}

export default async function handler(req, res) {
  const f = String(req.query.f || '')
  if (!/^[\w.-]+\.(jpe?g|png|webp)$/i.test(f)) return res.status(400).end('bad file')
  const r = await fetch(CDN + f)
  if (!r.ok) return res.status(404).end('not found')
  const src = Buffer.from(await r.arrayBuffer())

  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info

  // flood-fill the green background in from the edges to find the laptop's box
  const bg = new Uint8Array(W * H)
  const stack = []
  const seed = (x, y) => { const k = y * W + x; if (!bg[k]) { const i = k * C; if (isBg(data[i], data[i + 1], data[i + 2])) { bg[k] = 1; stack.push(k) } } }
  for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1) }
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y) }
  while (stack.length) {
    const k = stack.pop(), x = k % W, y = (k - x) / W
    if (x > 0) seed(x - 1, y); if (x < W - 1) seed(x + 1, y); if (y > 0) seed(x, y - 1); if (y < H - 1) seed(x, y + 1)
  }
  let x0 = W, y0 = H, x1 = -1, y1 = -1
  for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) if (!bg[y * W + x]) {
    let n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (!bg[(y + dy) * W + x + dx]) n++
    if (n < 18) continue
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  if (x1 < 0) return res.status(422).end('no product found')

  // every mockup uses the same laptop, so the screen sits at a fixed place inside its box;
  // trim a hair more so no bezel shows
  const lw = x1 - x0, lh = y1 - y0
  const left = Math.round(x0 + lw * 0.115), right = Math.round(x0 + lw * 0.885)
  const top = Math.round(y0 + lh * 0.065), bottom = Math.round(y0 + lh * 0.795)
  const screen = sharp(src).extract({ left, top, width: right - left, height: bottom - top })

  // if the artwork sits on a plain backdrop (a logo on white, etc.), grow it to a square with that
  // same colour; a full photo is just cropped to a square instead
  const s = await screen.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const sw = s.info.width, sh = s.info.height, sc = s.info.channels
  const edge = []
  for (let x = 0; x < sw; x += 3) edge.push(x, (sh - 1) * sw + x)
  for (let y = 0; y < sh; y += 3) edge.push(y * sw, y * sw + sw - 1)
  let mr = 0, mg = 0, mb = 0
  for (const k of edge) { mr += s.data[k * sc]; mg += s.data[k * sc + 1]; mb += s.data[k * sc + 2] }
  mr /= edge.length; mg /= edge.length; mb /= edge.length
  let dev = 0
  for (const k of edge) dev += Math.abs(s.data[k * sc] - mr) + Math.abs(s.data[k * sc + 1] - mg) + Math.abs(s.data[k * sc + 2] - mb)
  dev /= edge.length * 3
  const plain = dev < 14

  let out
  if (plain) {
    const side = Math.max(sw, sh)
    const background = { r: Math.round(mr), g: Math.round(mg), b: Math.round(mb) }
    out = await sharp(await screen.png().toBuffer())
      .extend({ top: Math.floor((side - sh) / 2), bottom: Math.ceil((side - sh) / 2), left: Math.floor((side - sw) / 2), right: Math.ceil((side - sw) / 2), background })
      .resize(SIZE, SIZE, { kernel: 'lanczos3' })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 88 }).toBuffer()
  } else {
    out = await screen.resize(SIZE, SIZE, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 88 }).toBuffer()
  }

  res.setHeader('Content-Type', 'image/webp')
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  res.end(out)
}
