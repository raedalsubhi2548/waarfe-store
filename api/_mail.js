// Order emails to the customer (and a copy to the store), sent over the store's own mailbox (SMTP).
// Settings live only in Vercel environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, ORDER_NOTIFY_TO.
import nodemailer from 'nodemailer'
import { admin, siteUrl } from './_shared.js'
import { invoicePdf, money } from './_invoice.js'

export const SELLER = () => ({
  name: 'رائد',
  email: process.env.STORE_EMAIL || 'info@rraed.com',
  phone: process.env.STORE_PHONE || (process.env.VITE_WHATSAPP ? '0' + String(process.env.VITE_WHATSAPP).replace(/^966/, '') : ''),
  site: (process.env.SITE_URL || 'rraed.com').replace(/^https?:\/\//, '').replace(/\/$/, ''),
})

let transport
const mailer = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  const port = Number(process.env.SMTP_PORT || 465)
  transport ||= nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  return transport
}

// what each moment of the order says to the customer
const EVENTS = {
  created: { subject: (o) => `استلمنا طلبك رقم ${o.number}`, title: 'استلمنا طلبك', body: (o) => o.payment_method === 'bank' ? 'شكراً لك! طلبك مسجّل عندنا. حوّل المبلغ على الحساب البنكي الموضّح، ونبدأ التنفيذ أول ما يوصلنا التحويل.' : 'شكراً لك! طلبك مسجّل عندنا وبانتظار إتمام الدفع.' },
  paid: { subject: (o) => `تم الدفع، وهذي فاتورة طلبك رقم ${o.number}`, title: 'تم استلام الدفع', body: () => 'وصلنا الدفع، وأرفقنا لك فاتورة طلبك. بنتواصل معك قريباً ونبدأ التنفيذ.' },
  in_progress: { subject: (o) => `بدأنا تنفيذ طلبك رقم ${o.number}`, title: 'بدأنا التنفيذ', body: () => 'فريقنا بدأ يشتغل على طلبك الحين، ونحدّثك أول بأول.' },
  review: { subject: (o) => `طلبك رقم ${o.number} جاهز لمراجعتك`, title: 'جاهز لمراجعتك', body: () => 'خلصنا الشغل وهو جاهز تشوفه. راجعه وقل لنا ملاحظاتك.' },
  completed: { subject: (o) => `اكتمل طلبك رقم ${o.number}`, title: 'اكتمل طلبك', body: () => 'تم تسليم طلبك بالكامل. شكراً لثقتك، ويسعدنا نسمع رأيك.' },
  cancelled: { subject: (o) => `تم إلغاء طلبك رقم ${o.number}`, title: 'تم إلغاء الطلب', body: () => 'تم إلغاء طلبك. لو عندك أي استفسار تواصل معنا.' },
}
export const EVENT_IDS = Object.keys(EVENTS)

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function html(order, ev) {
  const e = EVENTS[ev], base = siteUrl(), s = SELLER()
  const bank = ev === 'created' && order.payment_method === 'bank' && process.env.VITE_BANK_INFO
  const rows = (order.items || []).map((it) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e9edf3;font-size:14px;color:#1f2733">${esc(it.name)}${it.qty > 1 ? ` <span style="color:#6b7686">× ${it.qty}</span>` : ''}</td><td style="padding:10px 0;border-bottom:1px solid #e9edf3;font-size:14px;color:#1f2733;text-align:left;white-space:nowrap" dir="ltr">${money(it.price * it.qty)} ر.س</td></tr>`).join('')
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#f3f6fa;font-family:Tahoma,'Segoe UI',Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fa;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;direction:rtl;text-align:right">
<tr><td style="background:#1b2b44;padding:26px 28px" align="center"><img src="${base}/logo-white.png" width="150" alt="رائد" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="padding:30px 28px 8px">
<p style="margin:0;font-size:13px;color:#6b7686">طلب رقم ${order.number}</p>
<h1 style="margin:6px 0 10px;font-size:24px;color:#1b2b44">${e.title}</h1>
<p style="margin:0;font-size:15px;line-height:1.9;color:#3a4352">أهلاً ${esc(order.customer?.name || '')}، ${e.body(order)}</p>
${bank ? `<div style="margin:18px 0 0;padding:14px 16px;background:#f3f6fa;border-radius:12px;font-size:14px;line-height:1.9;color:#1f2733;white-space:pre-line">${esc(process.env.VITE_BANK_INFO)}</div>` : ''}
</td></tr>
<tr><td style="padding:18px 28px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
${Number(order.discount) > 0 ? `<tr><td style="padding:8px 0;font-size:13px;color:#6b7686">الخصم</td><td style="padding:8px 0;font-size:13px;color:#6b7686;text-align:left" dir="ltr">${money(order.discount)} ر.س</td></tr>` : ''}
<tr><td style="padding:12px 0;font-size:16px;font-weight:bold;color:#1b2b44">الإجمالي</td><td style="padding:12px 0;font-size:16px;font-weight:bold;color:#1b2b44;text-align:left" dir="ltr">${money(order.total)} ر.س</td></tr></table></td></tr>
<tr><td style="padding:10px 28px 30px" align="center"><a href="${base}/order/${order.id}" style="display:inline-block;background:#1b2b44;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:13px 30px;border-radius:999px">تابع طلبك</a></td></tr>
<tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e9edf3;font-size:12px;line-height:1.8;color:#6b7686" align="center">
${esc(s.name)} · <a href="mailto:${s.email}" style="color:#6b7686">${s.email}</a>${s.phone ? ` · <span dir="ltr">${esc(s.phone)}</span>` : ''}<br>وصلك هذا الإيميل لأن عندك طلب في متجر ${esc(s.name)}.</td></tr>
</table></td></tr></table></body></html>`
}

/**
 * Sends the email for one moment of an order, once. Returns { sent, reason }.
 * `notified` (text[] on orders) remembers what was already sent, so retries and webhooks never repeat it.
 */
export async function sendOrderEmail(orderOrId, ev) {
  if (!EVENTS[ev]) return { sent: false, reason: 'unknown-event' }
  const t = mailer(); if (!t) return { sent: false, reason: 'smtp-not-configured' }
  const order = typeof orderOrId === 'object' ? orderOrId : (await admin.from('orders').select('*').eq('id', orderOrId).single()).data
  if (!order) return { sent: false, reason: 'order-not-found' }
  const done = Array.isArray(order.notified) ? order.notified : []
  if (done.includes(ev)) return { sent: false, reason: 'already-sent' }
  const to = order.customer?.email
  if (!to) return { sent: false, reason: 'no-email' }

  // claim the event first (only if the column exists and nobody claimed it meanwhile), then send
  if ('notified' in order) {
    const { data: claimed } = await admin.from('orders').update({ notified: [...done, ev] }).eq('id', order.id).not('notified', 'cs', `{${ev}}`).select('id')
    if (!claimed?.length) return { sent: false, reason: 'already-sent' }
  }

  const s = SELLER()
  const attachments = ev === 'paid' ? [{ filename: `فاتورة-${order.number}.pdf`, content: await invoicePdf(order, s), contentType: 'application/pdf' }] : []
  const from = process.env.MAIL_FROM || `${s.name} <${process.env.SMTP_USER}>`
  try {
    await t.sendMail({ from, to, replyTo: s.email, subject: EVENTS[ev].subject(order), html: html(order, ev), attachments })
    // a copy to the store for new and paid orders
    const copy = process.env.ORDER_NOTIFY_TO
    if (copy && (ev === 'created' || ev === 'paid')) {
      await t.sendMail({ from, to: copy, subject: `[نسخة المتجر] ${EVENTS[ev].subject(order)} · ${order.customer?.name || ''}`, html: html(order, ev), attachments }).catch(() => {})
    }
    return { sent: true }
  } catch (err) {
    // let a later retry try again
    if ('notified' in order) await admin.from('orders').update({ notified: done }).eq('id', order.id)
    console.error('mail failed', ev, order.id, err?.message)
    return { sent: false, reason: 'smtp-error' }
  }
}
