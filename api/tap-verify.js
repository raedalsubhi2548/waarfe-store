// GET ?order=<id>&tap_id=<charge id>  — called when Tap redirects the customer back.
import { confirmCharge } from './_shared.js'

export default async function handler(req, res) {
  const { tap_id: tapId } = req.query
  if (!tapId) return res.status(400).json({ ok: false })
  const out = await confirmCharge(tapId)
  return res.status(200).json(out)
}
