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
import AtelierHero from '@/components/atelier/AtelierHero.jsx'
import GalleryWall from '@/components/atelier/GalleryWall.jsx'
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

/* ---------------- Core services ---------------- */
const ART_FOR = { 'salla-store-design': 'store', 'landing-page-design': 'landing', 'google-tools-integration': 'analytics' }
const SHORT = { 'salla-store-design': 'متجر متكامل جاهز للبيع من أول يوم.', 'landing-page-design': 'صفحة هبوط مبرمجة تبيع منتجك.', 'google-tools-integration': 'تعرف وش يصير في متجرك بالأرقام.' }

/** Card that tilts toward the pointer, sitting on a soft plinth. */
function Tilt({ className, children }) {
  const onMove = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`); el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`); el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }
  return (
    <div className="[perspective:1000px]">
      <div onPointerMove={onMove} onPointerLeave={onLeave} className={cn('relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] [transform-style:preserve-3d]', className)}>
        {children}
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.6),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <span className="mx-auto mt-3 block h-3 w-3/4 rounded-[50%] bg-[radial-gradient(closest-side,rgb(9_56_46/0.18),transparent)]" aria-hidden="true" />
    </div>
  )
}

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
              <Tilt className="group h-full rounded-xl">
              <article className="relative flex h-full flex-col items-center rounded-xl bg-[linear-gradient(180deg,#ffffff,#fdf8ea)] p-5 text-center shadow-[0_1px_0_rgb(215_198_118/0.4),0_24px_50px_-30px_rgb(9_56_46/0.4)] ring-1 ring-accent/40 sm:p-8">
                <span className="pointer-events-none absolute inset-2 rounded-[14px] border border-accent/25" aria-hidden="true" />
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
              </Tilt>
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

/* ---------------- Reviews: two rows drifting in opposite directions ---------------- */
function ReviewRow({ items, reverse }) {
  const row = [...items, ...items]
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]">
      <ul className={cn('flex w-max shrink-0 gap-4 py-3 motion-safe:animate-[marquee_70s_linear_infinite] group-hover:[animation-play-state:paused]', reverse && '[animation-direction:reverse]')}>
        {row.map((r, i) => (
          <li key={i} aria-hidden={i >= items.length || undefined} className="w-[280px] shrink-0 sm:w-[340px]">
            <figure className="flex h-full flex-col rounded-xl bg-surface p-5 shadow-[0_16px_40px_-30px_rgb(9_56_46/0.5)] ring-1 ring-accent/30">
              <div className="flex items-center justify-between"><Stars className="text-accent-text" /><Quote className="size-5 text-accent/70" strokeWidth={1.4} /></div>
              <blockquote className="mt-3 line-clamp-4 flex-1 text-[14px] leading-7">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 text-xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-semibold text-accent">{r.name.charAt(0)}</span>
                <span className="min-w-0"><b className="block truncate font-semibold text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground">{r.city}</span>}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Reviews() {
  const short = ALL_REVIEWS.filter((r) => r.text.length < 170)
  const half = Math.ceil(short.length / 2)
  return (
    <section className="py-16 sm:py-24">
      <div className="container-w"><Head center eyebrow="تقييمات منشورة في متجرنا على سلة" title="وش قالوا عملاؤنا" /></div>
      <div className="grid gap-2">
        <ReviewRow items={short.slice(0, half)} />
        <ReviewRow items={short.slice(half)} reverse />
      </div>
      <div className="mt-10 text-center"><Button asChild variant="outline" className="font-medium"><Link to="/reviews">كل الآراء ({ALL_REVIEWS.length})<ArrowLeft className="size-4" /></Link></Button></div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <AtelierHero />
      <Promises />
      <Core />
      <Divider />
      <Categories />
      <Installments />
      <GalleryWall />
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
