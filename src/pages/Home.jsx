import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, ChevronLeft, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ, BANNERS, TITLES } from '@/data/content.js'
import { ALL_REVIEWS } from '@/data/reviews.js'
import { waLink, money, effectivePrice } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView.js'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Icon from '@/components/Icon.jsx'
import Divider from '@/components/home/Divider.jsx'
import LineArt from '@/components/home/LineArt.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import GalleryWall from '@/components/atelier/GalleryWall.jsx'
import { SectionTitle, ArchPattern, Sprig } from '@/components/brand/Ornaments.jsx'
import PayIcons from '@/components/brand/PayIcons.jsx'
import { STORE_PDFS } from '@/data/work.js'
import { useEffect, useState } from 'react'

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

const TITLE_TEXT = {
  new: ['جديدنا ومميزاتنا', 'الأكثر طلباً عند عملائنا'],
  categories: ['كل ما يحتاجه متجرك', 'أقسام المتجر'],
  'design-services': ['نصمم لعلامتك', 'خدمات التصميم'],
  'marketing-services': ['نوصّلك لعملائك', 'خدمات التسويق'],
  'government-services': ['أوراقك الرسمية', 'الخدمات الحكومية'],
  reviews: ['من متجرنا في سلة', 'وش قالوا عن وارف'],
}
function Title({ id, className }) {
  const [eyebrow, title] = TITLE_TEXT[id]
  return <Reveal className={cn('container-w', className)}><SectionTitle eyebrow={eyebrow} title={title} /></Reveal>
}

const ViewAll = ({ to, children = 'عرض الكل' }) => (
  <div className="mt-10 text-center">
    <Button asChild variant="outline" className="font-medium"><Link to={to}>{children}<ArrowLeft className="size-4" /></Link></Button>
  </div>
)

/** Products as covers on a shelf. */
function Shelf({ items }) {
  return (
    <ul className="mx-auto grid max-w-[1060px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {items.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 4) * 90}><ServiceTicket p={p} className="h-full" /></Reveal>)}
    </ul>
  )
}

/* ---------------- Hero: green scene, medallion logo hangs from the header, delivered stores in an arch ---------------- */
const DUST = Array.from({ length: 18 }, (_, i) => ({ l: (i * 61) % 100, t: 35 + ((i * 37) % 60), d: 7 + (i % 5) * 1.6, w: i * 0.8, s: 2 + (i % 3) }))
const lh3 = (id, w) => `https://lh3.googleusercontent.com/d/${id}=w${w}`

function ArchWindow() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % STORE_PDFS.length), 7000); return () => clearInterval(t) }, [])
  return (
    <div className="relative mx-auto w-[min(78vw,340px)] lg:w-[380px]">
      {/* outer gold frame */}
      <div className="rounded-t-[999px] rounded-b-[28px] bg-[linear-gradient(145deg,#f6e7a8,#b8973c_30%,#f3df93_55%,#9c7c2c_80%,#e8d384)] p-[3px] shadow-[0_50px_90px_-30px_rgb(0_0_0/0.65),0_0_80px_-20px_rgb(215_198_118/0.45)]">
        <div className="rounded-t-[999px] rounded-b-[25px] bg-[#062a22] p-2.5">
          <div className="relative aspect-[3/4.3] overflow-hidden rounded-t-[999px] rounded-b-[18px] bg-[#f3ecd6] ring-1 ring-accent/50 [container-type:size]">
            {STORE_PDFS.map((s, k) => (
              <img key={s.id} src={lh3(s.id, 600)} alt="" decoding="async" loading={k === 0 ? 'eager' : 'lazy'}
                className={cn('absolute inset-x-0 top-0 w-full transition-opacity duration-[1.6s] motion-safe:animate-[screen-scroll_40s_ease-in-out_infinite_alternate]', k === i ? 'opacity-100' : 'opacity-0')} />
            ))}
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.25),transparent_35%)]" />
            <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(6_42_34/0.85))] px-4 pt-10 pb-3 text-center text-[12px] text-on-inverse/90">متجر <b className="text-accent">{STORE_PDFS[i].name}</b> · من تصميم وارف</span>
          </div>
        </div>
      </div>
      {/* floating chips */}
      <div className="absolute -start-8 top-[38%] flex items-center gap-2 rounded-full bg-background/95 py-2 ps-2 pe-4 shadow-[0_20px_40px_-15px_rgb(0_0_0/0.5)] motion-safe:animate-[float_6s_ease-in-out_infinite] sm:-start-14">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-[11px] font-bold text-accent">+200</span>
        <span className="text-[12.5px] font-semibold text-primary">طلب على سلة</span>
      </div>
      <div className="absolute -end-6 bottom-[16%] flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#f3e3a1,#d7c676)] px-3.5 py-2 text-primary shadow-[0_20px_40px_-15px_rgb(0_0_0/0.5)] motion-safe:animate-[float_7s_1.5s_ease-in-out_infinite] sm:-end-12">
        <Stars className="text-primary" /><b className="tabular text-[13px]">5.0</b>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative -mt-[var(--header-height)] overflow-hidden bg-[radial-gradient(70%_60%_at_70%_30%,#14604c,#09382e_55%,#05261f)] text-on-inverse">
      <ArchPattern className="opacity-80 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]" />
      <span className="pointer-events-none absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(215_198_118/0.22),transparent)]" aria-hidden="true" />
      {DUST.map((d, i) => (
        <span key={i} className="pointer-events-none absolute rounded-full bg-[#e8d48a] shadow-[0_0_8px_#f3e3a1] motion-safe:animate-[dust_var(--d)_linear_infinite]" style={{ left: `${d.l}%`, top: `${d.t}%`, width: d.s, height: d.s, '--d': `${d.d}s`, '--dx': `${(i % 2 ? 1 : -1) * (10 + i * 2)}px`, animationDelay: `${d.w}s` }} aria-hidden="true" />
      ))}

      <div className="container-w relative grid items-center gap-12 pt-[calc(var(--header-height)+96px)] pb-32 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pt-[calc(var(--header-height)+80px)] lg:pb-40">
        <div className="text-center lg:text-start">
          <p className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-accent motion-safe:animate-[rise-in_700ms_var(--p-ease-emphasized)_both]"><span className="h-px w-8 bg-accent" />وارف · تصميم متاجر سلة</p>
          <h1 className="mt-5 text-balance font-display text-[2.4rem] font-semibold leading-[1.25] sm:text-display-lg lg:text-[3.6rem] lg:leading-[1.15] motion-safe:animate-[rise-in_850ms_var(--p-ease-emphasized)_both]">
            متجرك يستاهل<br /><span className="bg-[linear-gradient(90deg,#f6e7a8,#d7c676,#f3df93,#b8973c,#f6e7a8)] bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-[foil_6s_linear_infinite]">تصميم يليق فيه.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[38ch] text-[16.5px] leading-8 text-on-inverse/75 lg:mx-0 motion-safe:animate-[rise-in_1s_var(--p-ease-emphasized)_both]">نصمم متجرك في سلة ونجهّزه للبيع من يومين إلى 6 أيام، بتفاصيل تشبه علامتك.</p>
          <div className="mt-8 flex justify-center gap-3 lg:justify-start motion-safe:animate-[rise-in_1.15s_var(--p-ease-emphasized)_both]">
            <Button asChild size="lg" variant="accent" className="px-8 font-semibold shadow-[0_16px_34px_-12px_rgb(215_198_118/0.7)]"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="inverse" className="px-7 font-medium"><Link to="/work">شوف أعمالنا</Link></Button>
          </div>
        </div>
        <div className="motion-safe:animate-[rise-in_1.2s_var(--p-ease-emphasized)_both]"><ArchWindow /></div>
      </div>

      {/* concave arch into the cream page, with a gold hairline */}
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[90px] w-full sm:h-[140px]" aria-hidden="true">
        <path d="M0 140 V40 Q720 150 1440 40 V140 Z" fill="var(--background)" />
        <path d="M0 40 Q720 150 1440 40" fill="none" stroke="#d7c676" strokeOpacity=".7" strokeWidth="1.4" />
      </svg>
    </section>
  )
}

/** Our own promo banner for the landing-page service (facts from the product). */
function LandingPromo() {
  const { byId } = useApp()
  const p = byId['landing-page-design']
  return (
    <Reveal className="container-w py-6">
      <Link to="/p/landing-page-design" className="group relative grid items-center gap-6 overflow-hidden rounded-[28px] bg-[radial-gradient(90%_120%_at_85%_0%,#14604c,#09382e_55%,#05261f)] p-7 text-on-inverse shadow-[0_40px_70px_-35px_rgb(9_56_46/0.8)] ring-1 ring-accent/40 sm:grid-cols-[1.2fr_1fr] sm:p-12">
        <ArchPattern className="opacity-60" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-[12px] font-medium text-accent ring-1 ring-accent/40">طفشت من الاشتراكات الشهرية؟</span>
          <h2 className="mt-4 text-balance font-display text-[1.7rem] font-semibold leading-snug sm:text-[2.2rem]">صفحة هبوط مبرمجة لك،<br /><span className="text-accent">بدون اشتراك شهري.</span></h2>
          <p className="mt-3 max-w-md leading-8 text-on-inverse/75">مبرمجة بـ HTML وCSS وJavaScript، مع دومين واستضافة سنة هدية.</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-primary transition-transform group-hover:-translate-y-0.5">اطلبها الحين<ArrowLeft className="size-4" /></span>
            {p && <span className="tabular text-xl font-semibold text-accent">{money(effectivePrice(p))}</span>}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xs text-accent"><LineArt name="landing" className="w-full" /></div>
      </Link>
    </Reveal>
  )
}

function PaymentsStrip() {
  return (
    <Reveal className="container-w py-10">
      <div className="flex flex-col items-center gap-5 rounded-[28px] bg-surface/70 px-6 py-8 text-center ring-1 ring-accent/30 sm:flex-row sm:justify-between sm:text-start">
        <div>
          <p className="font-display text-xl font-semibold text-primary">ادفع بالطريقة اللي تريحك</p>
          <p className="mt-1 text-sm text-muted-foreground">مدى، Apple Pay، البطاقات، أو تحويل بنكي.</p>
        </div>
        <PayIcons />
      </div>
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
    <section className="container-w relative z-10 -mt-6 sm:-mt-16">
      <ul className="mx-auto grid max-w-4xl grid-cols-3 gap-2 rounded-2xl bg-white/75 px-3 py-5 shadow-[0_30px_60px_-30px_rgb(9_56_46/0.45)] ring-1 ring-accent/40 backdrop-blur-xl sm:px-6 sm:py-7">
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
      <Title id={id} className="mb-10 sm:mb-14" />
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
      <Title id="new" className="mb-10 sm:mb-14" />
      <div className="container-w"><Shelf items={items} /><ViewAll to="/shop" /></div>
    </section>
  )
}

/* ---------------- Reviews: two rows drifting in opposite directions ---------------- */
function ReviewRow({ items, reverse }) {
  const row = [...items, ...items]
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]">
      <ul className={cn('flex w-max shrink-0 gap-4 py-3 motion-safe:animate-[marquee_160s_linear_infinite] group-hover:[animation-play-state:paused]', reverse && '[animation-direction:reverse]')}>
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
      <Title id="reviews" className="mb-10 sm:mb-12" />
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
      <LandingPromo />
      <section className="py-12 sm:py-16">
        <Title id="categories" className="mb-10 sm:mb-14" />
        <Categories />
      </section>
      <CategoryShelf id="design-services" />
      <CategoryShelf id="marketing-services" />
      <PaymentsStrip />
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
