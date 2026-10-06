import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, ChevronLeft, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ, BANNERS, TITLES } from '@/data/content.js'
import { ALL_REVIEWS } from '@/data/reviews.js'
import { waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView.js'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Icon from '@/components/Icon.jsx'
import Divider from '@/components/home/Divider.jsx'
import LineArt from '@/components/home/LineArt.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import GalleryWall from '@/components/atelier/GalleryWall.jsx'

const Stars = ({ className }) => <span className={cn('flex gap-0.5', className)} aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>

/** Fades/rises its children in once, when scrolled into view. */
function Reveal({ as: T = 'div', className, delay = 0, children, ...p }) {
  const [ref, on] = useInView()
  return <T ref={ref} className={cn('transition-[opacity,translate,scale] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]', on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0', className)} style={{ transitionDelay: `${delay}ms` }} {...p}>{children}</T>
}

function Head({ eyebrow, title }) {
  return (
    <Reveal className="mb-8 text-center sm:mb-12">
      {eyebrow && <p className="mb-3 flex items-center justify-center gap-2 text-[13px] font-medium text-accent-text"><span className="h-px w-6 bg-accent" />{eyebrow}<span className="h-px w-6 bg-accent" /></p>}
      <h2 className="text-balance font-display text-[1.6rem] font-semibold text-primary sm:text-display-sm lg:text-display-md">{title}</h2>
    </Reveal>
  )
}

/** A section-title strip from the Salla store (the green pill with leaves). */
function Title({ t, className }) {
  const [ref, on] = useInView()
  return (
    <div ref={ref} className={cn('container-w', className)}>
      <h2 className="sr-only">{t.alt}</h2>
      <img src={t.src} alt="" width="1440" height="211" loading="lazy" decoding="async"
        className={cn('mx-auto w-full max-w-[680px] transition-[opacity,scale] duration-[900ms] ease-[cubic-bezier(.34,1.4,.64,1)]', on ? 'scale-100 opacity-100' : 'scale-90 opacity-0')} />
    </div>
  )
}

const ViewAll = ({ to, children = 'عرض الكل' }) => (
  <div className="mt-10 text-center">
    <Button asChild variant="outline" className="font-medium"><Link to={to}>{children}<ArrowLeft className="size-4" /></Link></Button>
  </div>
)

/** Products as covers on a shelf. */
function Shelf({ items }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {items.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 4) * 90}><ServiceTicket p={p} className="h-full" /></Reveal>)}
    </ul>
  )
}

/* ---------------- Hero: the store's own main banner ---------------- */
function Hero() {
  const b = BANNERS.hero
  return (
    <section className="container-w pt-5 sm:pt-8">
      <Link to={b.to} className="group relative block overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgb(9_56_46/0.55)] ring-1 ring-accent/30">
        <img src={b.src} alt={b.alt} width={b.w} height={b.h} fetchpriority="high" className="w-full motion-safe:animate-[hero-in_1.6s_cubic-bezier(.16,1,.3,1)_both] transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.35)_50%,transparent_65%)] bg-[length:250%_100%] bg-[position:120%_0] motion-safe:animate-[sheen_1.8s_.6s_ease-out_both]" aria-hidden="true" />
      </Link>
    </section>
  )
}

function Banner({ b, className }) {
  const img = <img src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" decoding="async" className="w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.015]" />
  return (
    <Reveal className={cn('container-w', className)}>
      {b.to ? <Link to={b.to} className="group block overflow-hidden rounded-xl shadow-[0_24px_50px_-30px_rgb(9_56_46/0.5)]">{img}</Link> : <div className="overflow-hidden rounded-xl shadow-[0_24px_50px_-30px_rgb(9_56_46/0.5)]">{img}</div>}
    </Reveal>
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
    <section className="mt-8 bg-sunken/70 sm:mt-12">
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


/* ---------------- Store sections ---------------- */
function Categories() {
  const { categories, products } = useApp()
  return (
    <section className="container-w">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.categoryId === c.id).length
          return (
            <Reveal as="li" key={c.id} delay={i * 70} className={cn(i === categories.length - 1 && categories.length % 2 && 'col-span-2 sm:col-span-1')}>
              <Link to={`/c/${c.id}`} className="group flex h-full items-center gap-3 rounded-xl bg-surface p-4 ring-1 ring-accent/30 transition-[box-shadow,ring-color] duration-300 hover:shadow-card hover:ring-accent/70 sm:flex-col sm:items-start sm:p-5">
                <span className="cloth grid size-11 shrink-0 place-items-center rounded-lg text-accent transition-transform duration-500 group-hover:-rotate-6 sm:size-12"><Icon name={c.icon} size={19} /></span>
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

function CategoryShelf({ id }) {
  const { products, catalogReady } = useApp()
  const items = products.filter((p) => p.categoryId === id).slice(0, 4)
  if (!catalogReady || !items.length) return null
  return (
    <section className="py-12 sm:py-16">
      <Title t={TITLES[id]} className="mb-8 sm:mb-12" />
      <div className="container-w">
        <Shelf items={items} />
        <ViewAll to={`/c/${id}`} />
      </div>
    </section>
  )
}

function New() {
  const { byId, catalogReady } = useApp()
  const items = ['salla-store-design', 'landing-page-design', 'google-tools-integration', 'ai-integration-chatgpt-claude-salla'].map((id) => byId[id]).filter(Boolean)
  if (!catalogReady) return <div className="container-w grid grid-cols-2 gap-6 py-16 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-sunken" />)}</div>
  return (
    <section className="py-12 sm:py-16">
      <Title t={TITLES.new} className="mb-8 sm:mb-12" />
      <div className="container-w"><Shelf items={items} /><ViewAll to="/shop" /></div>
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
    <section className="py-12 sm:py-16">
      <Title t={TITLES.reviews} className="mb-8 sm:mb-10" />
      <div className="grid gap-2">
        <ReviewRow items={short.slice(0, half)} />
        <ReviewRow items={short.slice(half)} reverse />
      </div>
      <ViewAll to="/reviews">كل الآراء ({ALL_REVIEWS.length})</ViewAll>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <New />
      <Banner b={BANNERS.landing} />
      <section className="py-12 sm:py-16">
        <Title t={TITLES.categories} className="mb-8 sm:mb-12" />
        <Categories />
      </section>
      <CategoryShelf id="design-services" />
      <CategoryShelf id="marketing-services" />
      <Banner b={BANNERS.payments} className="py-4" />
      <CategoryShelf id="government-services" />
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
