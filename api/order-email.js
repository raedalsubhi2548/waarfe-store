// POST { orderId, event }  — sends the email for an order moment, once.
//  · the customer may only trigger "created" for their own bank-transfer order (card orders get "paid" from Tap)
//  · an admin may trigger the email for the order's current status (after changing it in the dashboard)
import { admin, userFromRequest } from './_shared.js'
import { sendOrderEmail, EVENT_IDS } from './_mail.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const user = await userFromRequest(req)
  if (!user) return res.status(401).json({ error: 'سجّل دخولك أولاً' })
  const { orderId, event } = req.body || {}
  if (!orderId || !EVENT_IDS.includes(event)) return res.status(400).json({ error: 'طلب غير صالح' })

  const { data: order } = await admin.from('orders').select('*').eq('id', orderId).single()
  if (!order) return res.status(404).json({ error: 'الطلب غير موجود' })
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = me?.role === 'admin'

  const allowed = isAdmin ? event === order.status : order.user_id === user.id && event === 'created' && order.payment_method === 'bank' && order.status === 'pending'
  if (!allowed) return res.status(403).json({ error: 'غير مسموح' })

  const out = await sendOrderEmail(order, event)
  return res.status(200).json(out)
}
