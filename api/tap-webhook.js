// Tap posts here after every charge update. We re-fetch the charge from Tap before trusting it.
import { confirmCharge } from './_shared.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const id = req.body?.id
  if (id) await confirmCharge(id)
  return res.status(200).json({ received: true })
}
