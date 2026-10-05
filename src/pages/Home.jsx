import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Clock, MessageCircle, Star, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { STOPS } from '@/data/route.js'
import { REVIEWS, FAQ, BANNERS } from '@/data/content.js'
import { money, effectivePrice, parseDescription, waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Waybill, Ticket, Barcode, useStopCounts, servicesLabel } from '@/components/home/Waybill.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import { WorkGallery, StoreCases } from '@/components/home/WorkGallery.jsx'
import { WORK, FEATURED, PROOF } from '@/data/work.js'

function SectionHead({ title, lead, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-balance font-display text-display-sm font-bold text-primary sm:text-display-md">{title}</h2>
        {lead && <p className="mt-2 text-[17px] leading-8 text-muted-foreground">{lead}</p>}
      </div>
      {action}
    </div>
  )
}

/** Horizontal tracker: the four stops as one rail. Mirrors the waybill selection. */
function Tracker({ active, onSelect }) {
  const counts = useStopCounts()
  return (
    <div role="tablist" aria-label="محطات متجرك" className="relative grid grid-cols-4 gap-1">
      <span className="absolute inset-x-[12.5%] top-[21px] h-[3px] rounded-full bg-[var(--tracker-rail)]" aria-hidden="true" />
      <span
        className="absolute start-[12.5%] top-[21px] h-[3px] rounded-full bg-[var(--tracker-fill)] transition-[width] duration-500 ease-emphasized"
        style={{ width: `${(active / (STOPS.length - 1)) * 75}%` }}
        aria-hidden="true"
      />
      {STOPS.map((s, i) => (
        <button
          key={s.key} role="tab" aria-selected={i === active} aria-controls="stop-panel" id={`stop-${s.key}`}
          onClick={() => onSelect(i)}
          className="group relative flex flex-col items-center gap-2 rounded-md px-1 pb-2 text-center"
        >
          <span className={cn(
            'relative z-10 grid size-11 place-items-center rounded-full border-[3px] font-display font-bold transition-colors duration-300',
            i < active ? 'border-primary bg-primary text-accent' : i === active ? 'border-accent bg-accent text-accent-foreground' : 'border-[var(--tracker-rail)] bg-surface text-muted-foreground group-hover:border-primary',
          )}>
            {i < active ? <Check className="size-4" strokeWidth={3} /> : i + 1}
          </span>
          <span className={cn('font-display text-[15px] font-semibold sm:text-base', i === active ? 'text-primary' : 'text-foreground')}>{s.title}</span>
          <span className="hidden text-xs text-muted-foreground sm:block">{s.name}، {servicesLabel(counts[i])}</span>
        </button>
      ))}
    </div>
  )
}

function Reviews() {
  const row = [...REVIEWS, ...REVIEWS]
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_6%,black_94%,transparent)]">
      <ul className="flex w-max gap-4 py-2 motion-safe:animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {row.map((r, i) => (
          <li key={i} aria-hidden={i >= REVIEWS.length || undefined} className="w-[300px] shrink-0 sm:w-[340px]">
            <Ticket className="h-full" head={
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <span className="flex gap-0.5 text-accent-text" aria-label="تقييم 5 من 5">{Array.from({ length: 5 }, (_, k) => <Star key={k} className="size-4" fill="currentColor" strokeWidth={0} />)}</span>
                <Badge variant="soft">تقييم منشور</Badge>
              </div>
            }>
              <blockquote className="flex h-[calc(100%-56px)] flex-col p-5 pt-4">
                <p className="flex-1 leading-8 text-foreground">{r.text}</p>
                <footer className="mt-4 text-sm"><b className="text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground"> — {r.city}</span>}</footer>
              </blockquote>
            </Ticket>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Home() {
  const { products, byId, addToCart, catalogReady } = useApp()
  const [active, setActive] = useState(1)
  const panelRef = useRef(null)
  const stop = STOPS[active]
  const stopServices = useMemo(() => stop.ids.map((id) => byId[id]).filter(Boolean), [stop, byId])
  const flagship = byId['salla-store-design']
  const guide = byId['waarfe-ai-ad-campaigns-guide']
  const details = flagship ? parseDescription(flagship.description).sections.find((s) => s.title.startsWith('تفاصيل'))?.items || [] : []

  const choose = (i, scroll) => {
    setActive(i)
    if (scroll) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ---------- First viewport: the offer + the waybill ---------- */}
      <section className="container-w grid items-center gap-10 pt-8 pb-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14 lg:pb-20">
        <div className="motion-safe:animate-[rise-in_520ms_var(--p-ease-emphasized)]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sunken px-3 py-1.5 text-sm font-semibold text-primary">
            <ShieldCheck className="size-4 text-accent-text" /> نشتغل على سلة يومياً
          </p>
          <h1 className="text-balance font-display text-[2.35rem] font-bold leading-[1.2] text-primary sm:text-display-lg lg:text-display-xl">
            من الورق الرسمي لأول طلب، بجهة وحدة.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-9 text-muted-foreground">
            سجل تجاري، متجر سلة، دفع وتتبّع، وحملات إعلانية. كل خدمة بسعر واضح، وتتابع طلبك من حسابك خطوة بخطوة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => choose(active, true)}>اختر محطتك<ArrowLeft /></Button>
            {flagship && (
              <Button asChild size="lg" variant="outline">
                <Link to={`/p/${flagship.id}`}>تصميم متجر سلة <span className="tabular text-accent-text">{money(effectivePrice(flagship))}</span></Link>
              </Button>
            )}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Clock className="size-4 text-primary" />تسليم المتجر من 2 إلى 6 أيام</li>
            <li className="flex items-center gap-2"><Star className="size-4 text-accent-text" fill="currentColor" strokeWidth={0} />تقييمات منشورة من عملائنا</li>
          </ul>
        </div>
        <div className="motion-safe:animate-[rise-in_620ms_var(--p-ease-emphasized)]">
          <Waybill active={active} onSelect={(i) => choose(i, true)} />
        </div>
      </section>

      {/* ---------- The route: pick a stop, see its services ---------- */}
      <section ref={panelRef} className="scroll-mt-24 bg-surface py-16 [--notch:var(--surface)] sm:py-20">
        <div className="container-w">
          <SectionHead title="اختر محطتك، وشوف خدماتها" lead="أربع محطات من الورق لأول طلب. ابدأ من وين ما وصلت." />
          <Tracker active={active} onSelect={(i) => choose(i, false)} />
          <div id="stop-panel" role="tabpanel" aria-labelledby={`stop-${stop.key}`} className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-sunken px-5 py-4">
              <p className="text-[15px] leading-7"><b className="font-display text-primary">{stop.title}: {stop.name}.</b> <span className="text-muted-foreground">{stop.text}</span></p>
              <Link to="/shop" className="text-sm font-semibold text-primary underline underline-offset-4">كل الخدمات ({products.length})</Link>
            </div>
            {!catalogReady
              ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-sunken" />)}</div>
              : <div key={stop.key} className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 motion-safe:animate-[rise-in_360ms_var(--p-ease-emphasized)]">{stopServices.slice(0, 8).map((p) => <ServiceTicket key={p.id} p={p} />)}</div>}
            {stopServices.length > 8 && <p className="mt-6 text-center"><Link to="/shop" className="font-semibold text-primary underline underline-offset-4">و{stopServices.length - 8} خدمات ثانية في صفحة كل الخدمات</Link></p>}
          </div>
        </div>
      </section>

      {/* ---------- Flagship ---------- */}
      {flagship && (
        <section className="container-w py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative">
              <img src={flagship.image} alt={flagship.name} loading="lazy" width="500" height="500" className="aspect-square w-full max-w-md rounded-xl object-cover shadow-card" />
              <span className="absolute -bottom-5 end-6 rotate-[-6deg] rounded-sm border-2 border-accent bg-background px-4 py-2 font-display font-bold text-accent-text shadow-hairline">من 2 إلى 6 أيام</span>
            </div>
            <div>
              <Badge variant="gold">{flagship.badge}</Badge>
              <h2 className="mt-4 font-display text-display-sm font-bold text-primary sm:text-display-md">{flagship.name}</h2>
              <p className="mt-3 max-w-[52ch] text-[17px] leading-8 text-muted-foreground">{flagship.summary}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {details.map((t) => <li key={t} className="flex gap-2.5 text-[15px] leading-7"><Check className="mt-1 size-4 shrink-0 rounded-full bg-accent p-0.5 text-primary" strokeWidth={3} />{t}</li>)}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="tabular font-display text-3xl font-bold text-primary">{money(effectivePrice(flagship))}</span>
                <Button size="lg" onClick={() => addToCart(flagship.id)}>أضف للسلة</Button>
                <Link to={`/p/${flagship.id}`} className="font-semibold text-primary underline underline-offset-4">كل التفاصيل</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Proof: numbers, portfolio, reviews ---------- */}
      <section className="py-16 sm:py-20">
        <div className="container-w">
          <dl className="grid grid-cols-3 divide-x divide-x-reverse divide-border-strong rounded-xl bg-inverse px-2 py-6 text-on-inverse sm:px-6 sm:py-8">
            {PROOF.map((s) => (
              <div key={s.label} className="px-2 text-center sm:px-6">
                <dt className="sr-only">{s.label}</dt>
                <dd className="tabular font-display text-3xl font-bold text-accent sm:text-display-md" dir={s.ltr ? 'ltr' : undefined}>{s.value}</dd>
                <dd className="mt-1 text-xs leading-6 text-on-inverse/80 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16">
            <SectionHead
              title="من أعمالنا"
              lead="بنرات وتصاميم سوّيناها لمتاجر عملائنا. اضغط أي تصميم وشوفه بحجمه الكامل."
              action={<Link to="/work" className="font-semibold text-primary underline underline-offset-4">كل الأعمال ({WORK.length})</Link>}
            />
            <WorkGallery items={FEATURED} />
            <div className="mt-10">
              <h3 className="mb-4 font-display text-xl font-bold text-primary">متاجر سلّمناها كاملة</h3>
              <StoreCases />
            </div>
          </div>
        </div>

        <div className="container-w mt-16"><SectionHead title="وش قالوا عن وارف" lead="تقييمات منشورة من عملاء متجرنا في سلة." /></div>
        <Reviews />
      </section>

      {/* ---------- Store banner (real asset from Salla) ---------- */}
      <section className="container-w">
        <Link to={BANNERS.landing.to} className="block overflow-hidden rounded-xl shadow-card transition-shadow hover:shadow-overlay">
          <img src={BANNERS.landing.src} alt={BANNERS.landing.alt} width={BANNERS.landing.w} height={BANNERS.landing.h} loading="lazy" className="w-full" />
        </Link>
      </section>

      {/* ---------- Digital guide ---------- */}
      {guide && (
        <section className="container-w pt-16 sm:pt-20">
          <div className="grid items-center gap-8 overflow-hidden rounded-xl bg-inverse p-6 text-on-inverse sm:grid-cols-[auto_1fr] sm:p-10">
            <img src={guide.image} alt="" loading="lazy" className="mx-auto w-36 rotate-[-4deg] rounded-sm shadow-overlay sm:w-44" />
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="size-4" />منتج رقمي، تحميل فوري</p>
              <h2 className="mt-2 text-balance font-display text-2xl font-bold leading-snug sm:text-3xl">{guide.name}</h2>
              <p className="mt-3 max-w-[60ch] leading-8 text-on-inverse/80">{guide.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="tabular font-display text-2xl font-bold text-accent">{money(effectivePrice(guide))}</span>
                {guide.salePrice && <s className="tabular text-on-inverse/50">{money(guide.price)}</s>}
                <Button variant="accent" onClick={() => addToCart(guide.id)}>احصل على الدليل</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      <section className="container-w grid gap-10 pt-16 sm:pt-24 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead title="أسئلة تتكرر" lead="ما لقيت جوابك؟ كلّمنا على واتساب ونرد عليك." action={null} />
        <Accordion type="single" collapsible defaultValue="0" className="grid gap-3">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={String(i)}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a} {f.link && <Link className="font-semibold text-primary underline underline-offset-4" to={f.link}>السياسات والشروط</Link>}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ---------- Close ---------- */}
      <section className="container-w pt-16 sm:pt-24">
        <Ticket className="overflow-hidden" head={
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">محتار من وين تبدأ؟</h2>
              <p className="mt-2 text-muted-foreground">قل لنا وش نشاطك ووين وصلت، ونرتّب لك المحطات اللي تحتاجها فعلاً.</p>
            </div>
            <Barcode value="WAARFE-HELP" className="hidden sm:block" />
          </div>
        }>
          <div className="flex flex-wrap gap-3 p-6 sm:p-8">
            <Button asChild size="lg"><a href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer"><MessageCircle />استشرنا على واتساب</a></Button>
            <Button asChild size="lg" variant="outline"><Link to="/shop">تصفّح كل الخدمات</Link></Button>
          </div>
        </Ticket>
      </section>
    </>
  )
}
