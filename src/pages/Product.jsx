import { coverFor } from '@/lib/cover.js'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ShieldCheck, Clock, Download, MessageCircle, Check } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { cn } from '@/lib/utils'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import { Ticket } from '@/components/home/Waybill.jsx'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Qty, Textarea, Skeleton } from '@/components/ui/kit.jsx'
import { money, effectivePrice, parseDescription, waLink } from '@/lib/format.js'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { id } = useParams()
  const { byId, categories, products, addToCart, toggleWish, wishlist, catalogReady } = useApp()
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const p = byId[id]
  if (!p) return catalogReady ? <NotFound /> : <div className="container-w py-14"><Skeleton className="h-[480px]" /></div>

  const cat = categories.find((c) => c.id === p.categoryId)
  const { intro, sections } = parseDescription(p.description)
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4)
  const wished = wishlist.includes(p.id)
  const onSale = p.salePrice && p.salePrice < p.price
  const total = effectivePrice(p) * qty

  return (
    <div className="container-w py-8 sm:py-12 [--notch:var(--background)]">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" aria-label="المسار">
        <Link to="/" className="hover:underline">الرئيسية</Link><span>/</span>
        {cat && <><Link to={`/c/${cat.id}`} className="hover:underline">{cat.name}</Link><span>/</span></>}
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
          <div className="relative overflow-hidden rounded-xl bg-sunken shadow-card">
            <img src={p.image} alt={p.name} width="500" height="500" onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = 1; e.currentTarget.src = coverFor(p) } }} className="aspect-square w-full object-cover" />
            {p.badge && <Badge variant="green" className="absolute top-4 start-4 text-sm">{p.badge}</Badge>}
          </div>
        </div>

        <div>
          <h1 className="text-balance font-display text-display-sm font-semibold leading-tight text-primary sm:text-display-md">{p.name}</h1>
          <p className="mt-3 text-[17px] leading-8 text-muted-foreground">{p.summary}</p>

          <Ticket className="mt-6" head={
            <div className="flex flex-wrap items-baseline gap-3 p-5">
              <span className="tabular font-display text-4xl font-semibold text-primary">{money(effectivePrice(p))}</span>
              {onSale && <s className="tabular text-muted-foreground">{money(p.price)}</s>}
              {onSale && <Badge variant="soft" className="bg-success-soft text-success">وفّر {money(p.price - p.salePrice)}</Badge>}
              {p.perUnit && <span className="text-sm text-muted-foreground">{p.perUnit}</span>}
            </div>
          }>
            <div className="grid gap-4 p-5">
              {!p.digital && (
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold">وش تحتاج بالضبط؟ <span className="font-normal text-muted-foreground">(اختياري)</span></span>
                  <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="اسم متجرك، رابطه، أو أي تفاصيل تساعدنا نبدأ أسرع" />
                </label>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {!p.digital && <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} />}
                <Button size="lg" className="min-w-0 flex-1" onClick={() => addToCart(p.id, qty, note)}>
                  أضف للسلة <span className="tabular text-accent">{money(total)}</span>
                </Button>
                <button
                  onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
                  className={cn('grid size-14 place-items-center rounded-full border-[1.5px] border-border-strong transition-colors', wished ? 'text-danger' : 'text-primary hover:border-primary')}
                ><Heart className="size-5" fill={wished ? 'currentColor' : 'none'} /></button>
              </div>
              <ul className="grid gap-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-primary" />دفع آمن، وتتابع طلبك من حسابك خطوة بخطوة</li>
                <li className="flex items-center gap-2.5">{p.digital ? <Download className="size-4 text-primary" /> : <Clock className="size-4 text-primary" />}{p.digital ? 'تحميل فوري بعد الدفع' : 'نتواصل معك بعد الطلب مباشرة'}</li>
                <li><a href={waLink(`السلام عليكم، عندي سؤال عن: ${p.name}`)} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 font-semibold text-primary hover:underline"><MessageCircle className="size-4" />اسأل عن الخدمة على واتساب</a></li>
              </ul>
            </div>
          </Ticket>
        </div>
      </div>

      <section className="mt-16 grid gap-8 border-t-2 border-primary pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">عن الخدمة</h2>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-9">{intro}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <div key={s.title} className="rounded-lg bg-surface p-5 shadow-hairline ring-1 ring-border">
              <h3 className="mb-3 font-display font-semibold text-primary">{s.title}</h3>
              <ul className="grid gap-2">
                {s.items.map((it) => <li key={it} className="flex gap-2 text-[15px] leading-7"><Check className="mt-1.5 size-3.5 shrink-0 rounded-full bg-accent p-0.5 text-primary" strokeWidth={3} />{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold text-primary">من نفس القسم</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">{related.map((r) => <ServiceTicket key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  )
}
