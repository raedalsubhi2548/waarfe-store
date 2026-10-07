import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CreditCard, Landmark, Lock } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { api, isDemo } from '@/lib/api.js'
import { cn } from '@/lib/utils'
import { money, effectivePrice } from '@/lib/format.js'
import { Button } from '@/components/ui/button'
import { PageHead, Panel, Field, Input, Textarea, Skeleton } from '@/components/ui/kit.jsx'

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
  const pending = useRef(null) // { key, order } of a card order whose payment didn't start

  useEffect(() => { if (user) setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone, email: user.email })) }, [user])

  if (!authReady) return <div className="container-w py-14"><Skeleton className="h-96" /></div>
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
      // if paying failed a moment ago, retry the same order instead of creating a duplicate
      const key = `${method}|${total}|${coupon?.code || ''}|${lines.map((l) => l.product.id + 'x' + l.qty).join(',')}`
      const order = (pending.current?.key === key && pending.current.order) || await api.createOrder({
        items, customer: { name: form.name, phone: form.phone, email: form.email },
        notes: form.notes, coupon: coupon?.code || null, subtotal, discount, total, paymentMethod: method,
      })
      if (method === 'card' && !isDemo) {
        pending.current = { key, order }
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
  const pay = (id) => cn('flex cursor-pointer items-center gap-4 rounded-lg border-[1.5px] p-4 transition-colors', method === id ? 'border-primary bg-sunken' : 'border-border hover:border-border-strong')

  return (
    <div className="container-w py-10 sm:py-14">
      <PageHead title="إتمام الطلب" />
      <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-6">
          <Panel title="بيانات التواصل">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم"><Input required {...f('name')} autoComplete="name" /></Field>
              <Field label="رقم الجوال"><Input required {...f('phone')} inputMode="tel" dir="ltr" placeholder="05xxxxxxxx" autoComplete="tel" className="text-end" /></Field>
              <Field label="البريد الإلكتروني" className="sm:col-span-2"><Input type="email" required {...f('email')} dir="ltr" readOnly className="text-end" /></Field>
              <Field label="ملاحظات للطلب (اختياري)" className="sm:col-span-2"><Textarea rows={3} {...f('notes')} placeholder="رابط متجرك، أفضل وقت للتواصل، أو أي تفاصيل" /></Field>
            </div>
          </Panel>
          <Panel title="طريقة الدفع">
            <div className="grid gap-3">
              <label className={pay('card')}>
                <input type="radio" name="pay" checked={method === 'card'} onChange={() => setMethod('card')} className="size-5 accent-[var(--primary)]" />
                <CreditCard className="size-6 text-primary" />
                <span className="grid"><b>بطاقة أو Apple Pay</b><small className="text-muted-foreground">مدى، فيزا، ماستركارد عبر بوابة Tap الآمنة</small></span>
              </label>
              <label className={pay('bank')}>
                <input type="radio" name="pay" checked={method === 'bank'} onChange={() => setMethod('bank')} className="size-5 accent-[var(--primary)]" />
                <Landmark className="size-6 text-primary" />
                <span className="grid"><b>تحويل بنكي</b><small className="text-muted-foreground">{BANK_INFO ? 'تظهر لك بيانات الحساب بعد الطلب' : 'نرسل لك بيانات الحساب على واتساب بعد الطلب'}</small></span>
              </label>
            </div>
            {isDemo && method === 'card' && <p className="mt-4 rounded-md border border-dashed border-accent bg-accent/15 p-3 text-sm text-accent-text">وضع العرض: الدفع بالبطاقة يُسجَّل كمدفوع بدون خصم أي مبلغ.</p>}
          </Panel>
        </div>

        <Panel title="طلبك" className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
          <ul className="grid gap-3">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <img src={p.image} alt="" className="size-12 rounded-sm object-cover" />
                <span className="flex-1 leading-6">{p.name}{qty > 1 && <span className="text-muted-foreground"> × {qty}</span>}</span>
                <strong className="tabular">{money(effectivePrice(p) * qty)}</strong>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="كود الخصم" aria-label="كود الخصم" dir="ltr" className="h-11 text-end" />
            <Button type="button" variant="outline" size="sm" className="h-11" onClick={applyCoupon} disabled={!code.trim()}>تطبيق</Button>
          </div>
          {couponErr && <p className="mt-2 text-sm text-danger">{couponErr}</p>}
          <dl className="mt-5 grid gap-2 border-t border-border pt-4 text-[15px]">
            <div className="flex justify-between"><dt className="text-muted-foreground">المجموع</dt><dd className="tabular">{money(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-success"><dt>خصم {coupon.code}</dt><dd className="tabular">− {money(discount)}</dd></div>}
            <div className="flex items-baseline justify-between border-t border-border pt-3"><dt className="font-bold">الإجمالي</dt><dd className="tabular font-display text-2xl font-semibold text-primary">{money(total)}</dd></div>
          </dl>
          {err && <p className="mt-3 text-sm text-danger" role="alert">{err}</p>}
          <Button size="lg" className="mt-4 w-full" disabled={busy}><Lock />{busy ? 'جاري تأكيد الطلب…' : method === 'card' ? `ادفع ${money(total)}` : 'أكّد الطلب'}</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">بتأكيد الطلب أنت موافق على <Link to="/policies" className="font-semibold text-primary underline">السياسات والشروط</Link>.</p>
        </Panel>
      </form>
    </div>
  )
}
