// Shared helpers for the Vercel serverless functions. Secrets live only here (server side).
import { createClient } from '@supabase/supabase-js'

export const admin = createClient((process.env.VITE_SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
export const TAP = 'https://api.tap.company/v2'
export const tapHeaders = () => ({ authorization: `Bearer ${process.env.TAP_SECRET_KEY}`, 'content-type': 'application/json' })
// payment return/webhook addresses: from config, or the deployment's own production domain — never a request header
export const siteUrl = () => (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://waarfe-store.vercel.app')).replace(/\/$/, '')

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
