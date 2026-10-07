// GET /api/art?f=<file on the old Salla CDN>  ->  the same artwork re-coloured to navy & silver (WebP).
// Cached at the edge for a year, so each image is processed once.
import sharp from 'sharp'
import { recolor } from '../src/lib/recolor.js'

const CDN = 'https://cdn.salla.sa/zvxNvp/'

export default async function handler(req, res) {
  const f = String(req.query.f || '')
  if (!/^[\w.-]+\.(jpe?g|png|webp)$/i.test(f)) return res.status(400).end('bad file')
  const r = await fetch(CDN + f)
  if (!r.ok) return res.status(404).end('not found')
  const { data, info } = await sharp(Buffer.from(await r.arrayBuffer())).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  recolor(data, info.channels)
  const out = await sharp(data, { raw: info }).webp({ quality: 86 }).toBuffer()
  res.setHeader('Content-Type', 'image/webp')
  res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  res.end(out)
}
