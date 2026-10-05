// Shared helpers for the Vercel serverless functions. Secrets live only here (server side).
import { createClient } from '@supabase/supabase-js'

export const admin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
export const TAP = 'https://api.tap.company/v2'
export const tapHeaders = () => ({ authorization: `Bearer ${process.env.TAP_SECRET_KEY}`, 'content-type': 'application/json' })
export const siteUrl = (req) => process.env.SITE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`

export async function userFromRequest(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data } = await admin.auth.getUser(token)
  return data?.user || null
}

// Asks Tap for the charge (never trusts the redirect) and marks the order paid if it matches.
export async function confirmCharge(chargeId) {
  const r = await fetch(`${TAP}/charges/${encodeURIComponent(chargeId)}`, { headers: tapHeaders() })
  if (!r.ok) return { ok: false, reason: 'charge-not-found' }
  const charge = await r.json()
  const orderId = charge.metadata?.order_id
  if (!orderId) return { ok: false, reason: 'no-order' }
  const { data: order } = await admin.from('orders').select('*').eq('id', orderId).single()
  if (!order) return { ok: false, reason: 'order-not-found' }
  if (charge.status !== 'CAPTURED') return { ok: false, status: charge.status, orderId }
  if (Math.abs(Number(charge.amount) - Number(order.total)) > 0.01 || charge.currency !== 'SAR') return { ok: false, reason: 'amount-mismatch', orderId }
  if (order.status === 'pending') {
    await admin.from('orders').update({
      status: 'paid', payment_ref: charge.id,
      history: [...(order.history || []), { status: 'paid', at: new Date().toISOString(), note: 'تم الدفع عبر Tap' }],
    }).eq('id', orderId).eq('status', 'pending')
  }
  return { ok: true, orderId }
}
