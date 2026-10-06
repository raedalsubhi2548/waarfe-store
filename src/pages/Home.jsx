import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, ChevronLeft, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ } from '@/data/content.js'
import { FEATURED_REVIEW, HOME_REVIEWS, CORE_SERVICES, ALL_REVIEWS } from '@/data/reviews.js'
import { PREVIEW, STORE_PDFS, WORK } from '@/data/work.js'
import { money, effectivePrice, waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView.js'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Icon from '@/components/Icon.jsx'
import Bag3D from '@/components/home/Bag3D.jsx'
import Divider from '@/components/home/Divider.jsx'
import Phone from '@/components/home/Phone.jsx'
import LineArt from '@/components/home/LineArt.jsx'
import { WorkGallery } from '@/components/home/WorkGallery.jsx'

const Stars = ({ className }) => <span className={cn('flex gap-0.5', className)} aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>

/** Fades/rises its children in once, when scrolled into view. */
function Reveal({ as: T = 'div', className, delay = 0, children, ...p }) {
  const [ref, on] = useInView()
  return <T ref={ref} className={cn('transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]', on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0', className)} style={{ transitionDelay: `${delay}ms` }} {...p}>{children}</T>
}

function Head({ eyebrow, title, action, center }) {
  return (
    <Reveal className={cn('mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12', center && 'flex-col items-center justify-center text-center')}>
      <div>
        {eyebrow && <p className={cn('mb-3 flex items-center gap-2 text-[13px] font-medium tracking-wide text-accent-text', center && 'justify-center')}><span className="h-px w-6 bg-accent" />{eyebrow}</p>}
        <h2 className="text-balance font-display text-[1.6rem] font-semibold leading-snug text-primary sm:text-display-sm lg:text-display-md">{title}</h2>
      </div>
      {action}
    </Reveal>
  )
}
const More = ({ to, children }) => (
  <Link to={to} className="group inline-flex h-10 items-center gap-2 text-sm font-medium text-primary">
    <span className="border-b border-accent pb-0.5">{children}</span><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
  </Link>
)

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_22%_45%,rgb(215_198_118/0.22),transparent_70%),radial-gradient(35%_40%_at_90%_10%,rgb(9_56_46/0.05),transparent)]" aria-hidden="true" />
      <div className="container-w grid items-center gap-2 pt-10 pb-8 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pt-16 lg:pb-14">
        <div className="text-center lg:text-start">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[13px] shadow-hairline ring-1 ring-accent/30 motion-safe:animate-[rise-in_600ms_var(--p-ease-emphasized)]">
            <Stars className="text-accent-text" /><span className="tabular font-semibold text-primary">5.0</span><span className="text-muted-foreground">· +200 طلب على سلة</span>
          </p>
          <h1 className="mt-6 text-balance font-display text-[2.15rem] font-semibold leading-[1.3] text-primary sm:text-display-lg lg:text-display-xl motion-safe:animate-[rise-in_750ms_var(--p-ease-emphasized)]">
            متجرك في سلة،<br /><span className="relative inline-block">بتصميم يبيع.
              <svg viewBox="0 0 300 20" className="absolute -bottom-2 start-0 h-3 w-full" fill="none" aria-hidden="true"><path d="M4 14 C 80 4, 200 4, 296 12" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" pathLength="1" className="[stroke-dasharray:1] motion-safe:animate-[draw_1.2s_.8s_cubic-bezier(.65,0,.35,1)_both]" /></svg>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[36ch] text-[16.5px] leading-8 text-muted-foreground lg:mx-0 motion-safe:animate-[rise-in_900ms_var(--p-ease-emphasized)]">نصمم متجرك ونجهّزه للبيع من يومين إلى 6 أيام، بلمسة تشبه علامتك.</p>
          <div className="mt-8 flex justify-center gap-3 lg:justify-start motion-safe:animate-[rise-in_1050ms_var(--p-ease-emphasized)]">
            <Button asChild size="lg" className="px-7 font-medium"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="px-6 font-medium"><Link to="/work">شوف أعمالنا</Link></Button>
          </div>
        </div>
        <Bag3D className="order-first mx-auto aspect-square w-full max-w-[340px] sm:max-w-[440px] lg:order-none lg:max-w-[560px]" />
      </div>
    </section>
  )
}

/* ---------------- Core services ---------------- */
const ART_FOR = { 'salla-store-design': 'store', 'landing-page-design': 'landing', 'google-tools-integration': 'analytics' }
const SHORT = { 'salla-store-design': 'متجر متكامل جاهز للبيع من أول يوم.', 'landing-page-design': 'صفحة هبوط مبرمجة تبيع منتجك.', 'google-tools-integration': 'تعرف وش يصير في متجرك بالأرقام.' }

function Core() {
  const { byId, addToCart, catalogReady } = useApp()
  const list = CORE_SERVICES.map((id) => byId[id]).filter(Boolean)
  return (
    <section className="container-w py-16 sm:py-24">
      <Head center eyebrow="اللي يطلبه عملاؤنا أكثر" title="خدماتنا الأساسية" />
      {!catalogReady ? <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-sunken" />)}</div> : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 120} className={cn(i === 0 && 'col-span-2 lg:col-span-1')}>
              <article className="group relative flex h-full flex-col items-center rounded-xl bg-surface p-5 text-center shadow-[0_1px_0_rgb(215_198_118/0.4),0_20px_50px_-35px_rgb(9_56_46/0.45)] ring-1 ring-accent/35 transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(9_56_46/0.45)] sm:p-8">
                {i === 0 && <span className="absolute top-4 start-4 rounded-full bg-accent/25 px-2.5 py-0.5 text-[11px] font-semibold text-accent-text">الأكثر طلباً</span>}
                <LineArt name={ART_FOR[p.id]} className="size-20 sm:size-28" delay={0.2 + i * 0.15} />
                <h3 className="mt-5 font-display text-base font-semibold leading-7 text-primary sm:text-xl">
                  <Link to={`/p/${p.id}`} className="after:absolute after:inset-0">{p.name.replace(' (برمجة مخصصة)', '')}</Link>
                </h3>
                <span className="mt-3 h-px w-12 bg-accent transition-[width] duration-500 group-hover:w-20" />
                <p className="mt-3 hidden text-sm leading-7 text-muted-foreground sm:block">{SHORT[p.id]}</p>
                <div className="relative z-10 mt-auto flex w-full flex-col items-center gap-3 pt-6">
                  <span className="tabular font-display text-lg font-semibold text-primary sm:text-2xl">{money(effectivePrice(p))}</span>
                  <Button size="sm" variant="outline" className="w-full max-w-44 font-medium" onClick={() => addToCart(p.id)}>أضف للسلة</Button>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      )}
      <Reveal className="mt-10 text-center"><More to="/shop">كل الخدمات</More></Reveal>
    </section>
  )
}

/* ---------------- Promise strip (true facts only) ---------------- */
function Promises() {
  const items = [
    { art: 'clock', t: 'تسليم المتجر', d: 'من يومين إلى 6 أيام' },
    { art: 'shield', t: 'دفع آمن', d: 'بطاقة، Apple Pay، أو تحويل' },
    { art: 'chat', t: 'تواصل مباشر', d: 'على واتساب طول التنفيذ' },
  ]
  return (
    <section className="bg-sunken/70">
      <ul className="container-w grid grid-cols-3 gap-2 py-8 sm:py-10">
        {items.map((x, i) => (
          <Reveal as="li" key={x.t} delay={i * 100} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-start">
            <LineArt name={x.art} className="size-10 shrink-0 sm:size-12" delay={i * 0.15} />
            <span><b className="block text-[13px] font-semibold text-primary sm:text-[15px]">{x.t}</b><span className="text-[11.5px] text-muted-foreground sm:text-sm">{x.d}</span></span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

/* ---------------- Installments ---------------- */
function Installments() {
  return (
    <section className="container-w pb-16 sm:pb-24">
      <Reveal className="relative grid items-center gap-6 overflow-hidden rounded-xl bg-surface p-6 shadow-[0_20px_50px_-35px_rgb(9_56_46/0.4)] ring-1 ring-accent/35 sm:grid-cols-[1fr_auto] sm:p-10">
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-10 -start-10 size-56 opacity-60" fill="none" aria-hidden="true">
          {[40, 62, 84].map((r) => <circle key={r} cx="100" cy="100" r={r} stroke="var(--accent)" strokeOpacity=".35" strokeDasharray="2 6" className="origin-center motion-safe:animate-[spin_40s_linear_infinite]" />)}
        </svg>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-14 place-items-center rounded-md bg-white ring-1 ring-black/5"><img src="https://cdn.tamara.co/assets/svg/tamara-logo-badge-ar.svg" alt="تمارا" className="max-h-[60%]" /></span>
            <span className="grid h-8 w-14 place-items-center rounded-md bg-white ring-1 ring-black/5"><img src="https://cdn.tabby.ai/assets/logo.svg" alt="تابي" className="max-h-[60%]" /></span>
          </div>
          <h2 className="mt-4 font-display text-[1.45rem] font-semibold text-primary sm:text-display-sm">تبي متجر؟ قسّط قيمته.</h2>
          <p className="mt-2 max-w-md leading-8 text-muted-foreground">قسّم قيمة تصميم متجرك والخدمات على دفعات مع تمارا وتابي، وابدأ اليوم.</p>
        </div>
        <div className="relative grid gap-3 sm:w-64">
          <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="relative h-2 overflow-hidden rounded-full bg-primary/10">
                <span className="absolute inset-0 origin-right scale-x-0 rounded-full bg-accent motion-safe:animate-[plan_6s_ease-in-out_infinite] motion-reduce:scale-x-100" style={{ animationDelay: `${i * 0.9}s` }} />
              </span>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground" aria-hidden="true"><span className="font-semibold text-primary">اليوم</span><span>على دفعات</span></div>
          <Button asChild className="mt-1 font-medium"><a href={waLink('السلام عليكم، أبي أصمم متجري وأقسّط المبلغ')} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />اسألنا عن التقسيط</a></Button>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------------- Categories ---------------- */
function Categories() {
  const { categories, products } = useApp()
  return (
    <section className="container-w py-16 sm:py-20">
      <Head center eyebrow="كل شي يحتاجه متجرك" title="تصفّح حسب القسم" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.categoryId === c.id).length
          return (
            <Reveal as="li" key={c.id} delay={i * 70} className={cn(i === categories.length - 1 && categories.length % 2 && 'col-span-2 sm:col-span-1')}>
              <Link to={`/c/${c.id}`} className="group flex h-full items-center gap-3 rounded-lg bg-surface p-3.5 ring-1 ring-border transition-[box-shadow,ring-color] duration-300 hover:shadow-card hover:ring-accent/60 sm:flex-col sm:items-start sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full text-primary ring-1 ring-accent/60 transition-colors duration-300 group-hover:bg-primary group-hover:text-accent sm:size-12"><Icon name={c.icon} size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-primary sm:text-base">{c.name}</span>
                  <span className="tabular text-xs text-muted-foreground">{n} خدمات</span>
                </span>
                <ChevronLeft className="hidden size-4 text-accent-text transition-transform group-hover:-translate-x-1 sm:block sm:self-end" />
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}

/* ---------------- Stores we delivered ---------------- */
function Stores() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background),#f4ecd3_55%,var(--background))] py-16 sm:py-24">
      <div className="container-w">
        <Head center eyebrow="متاجر سلّمناها كاملة" title="من الفكرة لمتجر يبيع" />
        <ul className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-3 sm:gap-10">
          {STORE_PDFS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 140} className={cn(i === 1 && '-translate-y-0 sm:mb-10')}>
              <Link to="/work" className="group block" aria-label={`متجر ${s.name}`}>
                <Phone pdfId={s.id} scrollOnHover size={420} className="transition-transform duration-700 ease-emphasized group-hover:-translate-y-2" />
                <p className="mt-4 text-center text-[13px] font-semibold text-primary sm:text-[15px]">{s.name}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10 text-center"><More to="/work">كل المتاجر</More></Reveal>
      </div>
    </section>
  )
}

/* ---------------- Banners & social ---------------- */
function Banners() {
  return (
    <section className="container-w py-16 sm:py-24">
      <Head center eyebrow="بنرات وسوشال ميديا" title="تصاميم تشد العين" />
      <Reveal><WorkGallery items={PREVIEW} className="columns-2 sm:columns-3 lg:columns-4" /></Reveal>
      <Reveal className="mt-10 text-center"><More to="/work?tab=banners">كل التصاميم ({WORK.length})</More></Reveal>
    </section>
  )
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  const f = FEATURED_REVIEW
  return (
    <section className="container-w py-16 sm:py-24">
      <Head center eyebrow="تقييمات منشورة في متجرنا على سلة" title="وش قالوا عملاؤنا" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <Reveal as="figure" className="relative col-span-2 flex flex-col overflow-hidden rounded-xl bg-surface p-6 ring-1 ring-accent/40 sm:p-8 lg:col-span-1 lg:row-span-2">
          <Quote className="size-9 text-accent" strokeWidth={1.4} />
          <blockquote className="mt-4 flex-1 text-[16px] leading-9 text-foreground sm:text-[17px]">{f.text}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5 text-sm">
            <span className="grid size-10 place-items-center rounded-full bg-primary font-semibold text-accent">{f.name.charAt(0)}</span>
            <span><b className="block font-semibold text-primary">{f.name}</b><span className="text-muted-foreground">{f.city}</span></span>
            <Stars className="ms-auto text-accent-text" />
          </figcaption>
        </Reveal>
        {HOME_REVIEWS.map((r, i) => (
          <Reveal as="figure" key={i} delay={i * 90} className="flex flex-col rounded-lg bg-surface p-4 ring-1 ring-border sm:p-5">
            <Stars className="text-accent-text" />
            <blockquote className="mt-3 line-clamp-5 flex-1 text-[13.5px] leading-7 sm:text-[15px] sm:leading-8">{r.text}</blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 text-xs sm:text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken font-semibold text-primary">{r.name.charAt(0)}</span>
              <span className="min-w-0"><b className="block truncate font-semibold text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground">{r.city}</span>}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center"><More to="/reviews">كل الآراء ({ALL_REVIEWS.length})</More></Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <Core />
      <Divider />
      <Categories />
      <Installments />
      <Stores />
      <Banners />
      <Divider />
      <Reviews />
      <Divider />
      <section className="container-w grid gap-8 py-16 sm:py-24 lg:grid-cols-[0.7fr_1.3fr]">
        <Head eyebrow="قبل ما تطلب" title="أسئلة تتكرر" />
        <Accordion type="single" collapsible className="grid gap-3">
          {FAQ.map((q, i) => (
            <AccordionItem key={q.q} value={String(i)}>
              <AccordionTrigger>{q.q}</AccordionTrigger>
              <AccordionContent>{q.a} {q.link && <Link className="font-semibold text-primary underline underline-offset-4" to={q.link}>السياسات والشروط</Link>}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section className="container-w pb-6">
        <Reveal className="relative overflow-hidden rounded-xl bg-primary px-6 py-12 text-center text-on-inverse sm:py-16">
          <svg viewBox="0 0 400 400" className="pointer-events-none absolute -top-24 -end-24 size-80 opacity-30" fill="none" aria-hidden="true">
            {[60, 100, 140, 180].map((r) => <circle key={r} cx="200" cy="200" r={r} stroke="var(--accent)" strokeOpacity=".5" />)}
          </svg>
          <Divider tone="dark" className="mb-3 !w-full max-w-xs" />
          <h2 className="font-display text-[1.5rem] font-semibold sm:text-display-sm">محتار من وين تبدأ؟</h2>
          <p className="mx-auto mt-2 max-w-md text-on-inverse/80">قل لنا وش نشاطك، ونرتّب لك اللي تحتاجه فعلاً.</p>
          <Button asChild size="lg" variant="accent" className="mt-7 font-medium"><a href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer"><MessageCircle />استشرنا على واتساب</a></Button>
        </Reveal>
      </section>
    </>
  )
}
