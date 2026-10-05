import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../state.jsx'
import { api, isDemo } from '../lib/api.js'
import Icon from '../components/Icon.jsx'
import { money, effectivePrice } from '../lib/format.js'

const BANK_INFO = import.meta.env.VITE_BANK_INFO || ''

export default function Checkout() {
  const { user, authReady, lines, subtotal, clearCart, notify } = useApp()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [method, setMethod] = useState('card')
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponErr, setCouponErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { if (user) setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone, email: user.email })) }, [user])

  if (!authReady) return <div className="page wrap pad-xl"><div className="skeleton tall" /></div>
  if (!user) return <Navigate to="/login?next=/checkout" replace />
  if (lines.length === 0) return <Navigate to="/cart" replace />

  const discount = coupon ? Math.min(subtotal, coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value) : 0
  const total = Math.max(0, subtotal - discount)

  const applyCoupon = async () => {
    setCouponErr('')
    try { setCoupon(await api.validateCoupon(code)); notify('تم تطبيق الخصم') } catch (e) { setCoupon(null); setCouponErr(e.message) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!/^0?5\d{8}$|^\+?9665\d{8}$/.test(form.phone.replace(/\s/g, ''))) { setErr('اكتب رقم جوال سعودي صحيح، مثل 05xxxxxxxx'); return }
    setBusy(true)
    try {
      const items = lines.map(({ product: p, qty, note }) => ({ productId: p.id, name: p.name, price: effectivePrice(p), qty, note: note || '', image: p.image, digital: !!p.digital }))
      const order = await api.createOrder({
        items, customer: { name: form.name, phone: form.phone, email: form.email },
        notes: form.notes, coupon: coupon?.code || null, subtotal, discount, total, paymentMethod: method,
      })
      if (method === 'card' && !isDemo) {
        const { redirect } = await api.startPayment(order)
        clearCart()
        window.location.href = redirect
        return
      }
      clearCart()
      nav(`/order/${order.id}?new=1`, { replace: true })
    } catch (e2) { setErr(e2.message); setBusy(false) }
  }

  const f = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) })

  return (
    <div className="page wrap pad-top">
      <h1 className="h-page">إتمام الطلب</h1>
      <form className="checkout-grid" onSubmit={submit}>
        <div className="co-main">
          <fieldset className="panel">
            <legend>بيانات التواصل</legend>
            <div className="fields-2">
              <label className="field"><span>الاسم</span><input required {...f('name')} autoComplete="name" /></label>
              <label className="field"><span>رقم الجوال</span><input required {...f('phone')} inputMode="tel" dir="ltr" placeholder="05xxxxxxxx" autoComplete="tel" /></label>
            </div>
            <label className="field"><span>البريد الإلكتروني</span><input type="email" required {...f('email')} dir="ltr" readOnly /></label>
            <label className="field"><span>ملاحظات للطلب (اختياري)</span><textarea rows={3} {...f('notes')} placeholder="رابط متجرك، أفضل وقت للتواصل، أو أي تفاصيل" /></label>
          </fieldset>

          <fieldset className="panel">
            <legend>طريقة الدفع</legend>
            <div className="pay-options">
              <label className={'pay-opt' + (method === 'card' ? ' on' : '')}>
                <input type="radio" name="pay" checked={method === 'card'} onChange={() => setMethod('card')} />
                <Icon name="card" />
                <span><strong>بطاقة أو Apple Pay</strong><small>مدى، فيزا، ماستركارد عبر بوابة Tap الآمنة</small></span>
              </label>
              <label className={'pay-opt' + (method === 'bank' ? ' on' : '')}>
                <input type="radio" name="pay" checked={method === 'bank'} onChange={() => setMethod('bank')} />
                <Icon name="bank" />
                <span><strong>تحويل بنكي</strong><small>{BANK_INFO ? 'تظهر لك بيانات الحساب بعد الطلب' : 'نرسل لك بيانات الحساب على واتساب بعد الطلب'}</small></span>
              </label>
            </div>
            {isDemo && method === 'card' && <p className="note-demo">وضع العرض: الدفع بالبطاقة يُسجَّل كمدفوع بدون خصم أي مبلغ.</p>}
          </fieldset>
        </div>

        <aside className="summary">
          <h2>طلبك</h2>
          <ul className="sum-lines">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id}><img src={p.image} alt="" /><span>{p.name}{qty > 1 && <em> × {qty}</em>}</span><strong>{money(effectivePrice(p) * qty)}</strong></li>
            ))}
          </ul>
          <div className="coupon">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="كود الخصم" aria-label="كود الخصم" dir="ltr" />
            <button type="button" className="btn btn-ghost" onClick={applyCoupon} disabled={!code.trim()}>تطبيق</button>
          </div>
          {couponErr && <p className="err small">{couponErr}</p>}
          <div className="row-between"><span>المجموع</span><span>{money(subtotal)}</span></div>
          {discount > 0 && <div className="row-between good"><span>خصم {coupon.code}</span><span>− {money(discount)}</span></div>}
          <div className="row-between total"><span>الإجمالي</span><strong>{money(total)}</strong></div>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'جاري تأكيد الطلب…' : method === 'card' ? `ادفع ${money(total)}` : 'أكّد الطلب'}</button>
          <p className="muted small center">بتأكيد الطلب أنت موافق على <Link to="/policies" className="link-u">السياسات والشروط</Link>.</p>
        </aside>
      </form>
    </div>
  )
}
