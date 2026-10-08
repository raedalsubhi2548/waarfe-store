import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ } from '@/data/content.js'
import { ALL_REVIEWS } from '@/data/reviews.js'
import { waLink, money, effectivePrice } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView.js'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Icon from '@/components/Icon.jsx'
import LineArt from '@/components/home/LineArt.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import GalleryWall from '@/components/atelier/GalleryWall.jsx'
import { SectionTitle } from '@/components/brand/Ornaments.jsx'
import PayIcons from '@/components/brand/PayIcons.jsx'
import Vine from '@/components/brand/Vine.jsx'

const Stars = ({ className }) => <span className={cn('flex gap-0.5', className)} aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>

/** Fades/rises its children in once, when scrolled into view. */
function Reveal({ as: T = 'div', className, delay = 0, children, ...p }) {
  const [ref, on] = useInView()
  return <T ref={ref} className={cn('transition-[opacity,translate,scale] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]', on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0', className)} style={{ transitionDelay: `${delay}ms` }} {...p}>{children}</T>
}

function Head({ eyebrow, title }) {
  return (
    <Reveal className="mb-8 text-center sm:mb-12">
      {eyebrow && <p className="mb-1 text-[14px] font-medium text-primary/55">{eyebrow}</p>}
      <h2 className="text-balance font-display text-[2.1rem] font-bold leading-[1.45] text-primary sm:text-[2.75rem]">{title}</h2>
    </Reveal>
  )
}

const TITLE_TEXT = {
  new: ['جديدنا ومميزاتنا', 'الأكثر طلباً عند عملائنا'],
  categories: ['كل ما يحتاجه متجرك', 'أقسام المتجر'],
  'design-services': ['نصمم لعلامتك', 'خدمات التصميم'],
  'marketing-services': ['نوصّلك لعملائك', 'خدمات التسويق'],
  'government-services': ['أوراقك الرسمية', 'الخدمات الحكومية'],
  reviews: ['آراء عملائنا', 'وش قالوا عن شغلنا'],
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
    <ul className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
      {items.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 4) * 90}><ServiceTicket p={p} className="h-full" /></Reveal>)}
    </ul>
  )
}

/* ---------------- Hero: a cinematic scene (our own AI art) merged with the header ---------------- */
const DUST = Array.from({ length: 16 }, (_, i) => ({ l: (i * 61) % 100, t: 20 + ((i * 37) % 70), d: 8 + (i % 5) * 1.8, w: i * 0.9, s: 2 + (i % 3) }))
const ART = '/brand/ai'

function Hero() {
  return (
    <section className="relative -mt-[var(--header-height)] isolate overflow-hidden bg-[#0f1a2c] text-on-inverse">
      {/* the scene */}
      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 767px)" srcSet={`${ART}/raed-hero-mobile-v3.webp`} />
        <img src={`${ART}/raed-hero-v3.webp`} alt="تصميم متاجر سلة من منصة رائد على الجوال واللابتوب" width="2800" height="1188" fetchPriority="high" decoding="async"
          className="size-full object-cover object-[50%_100%] md:object-[0%_50%] motion-safe:animate-[kenburns_28s_ease-in-out_infinite_alternate]" />
      </picture>
      {/* melt the scene into the header (top), the text side, and the page (bottom) */}
      <span className="absolute inset-x-0 top-0 -z-10 h-48 bg-[linear-gradient(#0f1a2c,transparent)]" aria-hidden="true" />
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_26_44/0.95)_0%,rgb(15_26_44/0.82)_42%,transparent_68%)] md:bg-[linear-gradient(270deg,rgb(15_26_44/0.9)_0%,rgb(15_26_44/0.55)_38%,transparent_62%)]" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 opacity-0 bg-[linear-gradient(100deg,transparent,rgb(230_238_250/0.10),transparent)] motion-safe:animate-[sweep_9s_ease-in-out_infinite]" aria-hidden="true" />
      {DUST.map((d, i) => (
        <span key={i} className="pointer-events-none absolute -z-10 rounded-full bg-[#dfe6f1]/60 motion-safe:animate-[dust_var(--d)_linear_infinite]" style={{ left: `${d.l}%`, top: `${d.t}%`, width: d.s, height: d.s, '--d': `${d.d}s`, '--dx': `${(i % 2 ? 1 : -1) * (10 + i * 2)}px`, animationDelay: `${d.w}s` }} aria-hidden="true" />
      ))}

      <div className="container-w relative flex min-h-[640px] flex-col justify-start pt-[calc(var(--header-height)+92px)] pb-[42vh] sm:min-h-[720px] md:min-h-[min(92vh,820px)] md:justify-center md:pb-32 md:pt-[calc(var(--header-height)+40px)]">
        <div className="mx-auto max-w-[560px] text-center md:ms-0 md:me-auto md:text-start lg:ms-[2%]">
          <p className="inline-flex items-center gap-3 text-[14px] font-medium text-on-inverse/70 motion-safe:animate-[rise-in_700ms_var(--p-ease-emphasized)_both]">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgb(251_252_254/0.6))]" />تصميم متاجر سلة<span className="h-px w-10 bg-[linear-gradient(270deg,transparent,rgb(251_252_254/0.6))] md:hidden" />
          </p>
          <h1 className="mt-5 font-display text-[2.35rem] font-bold leading-[1.35] sm:text-[3rem] lg:text-[3.6rem] lg:leading-[1.3] motion-safe:animate-[rise-in_850ms_var(--p-ease-emphasized)_both]">
            <span className="sr-only">تصميم متاجر سلة في السعودية: </span>
            <span className="block">متجرك يستاهل</span>
            <span className="block font-light text-[#dfe6f1]">تصميم يليق فيه</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[30ch] text-[17px] sm:max-w-[34ch] leading-[1.9] text-on-inverse/85 [text-shadow:0_1px_12px_rgb(15_26_44/0.9)] md:mx-0 motion-safe:animate-[rise-in_1s_var(--p-ease-emphasized)_both]">نصمم متجرك في سلة ونجهّزه للبيع خلال يومين إلى ستة أيام، بتفاصيل تشبه علامتك.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start motion-safe:animate-[rise-in_1.15s_var(--p-ease-emphasized)_both]">
            <Button asChild size="lg" className="bg-background px-8 font-semibold text-primary shadow-[0_16px_34px_-14px_rgb(0_0_0/0.6)] hover:bg-white"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="inverse" className="px-7 font-medium backdrop-blur"><Link to="/work">شوف أعمالنا</Link></Button>
          </div>
          <div className="mt-8 flex justify-center md:justify-start motion-safe:animate-[rise-in_1.3s_var(--p-ease-emphasized)_both]">
            <Link to="/reviews" className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#0f1a2c]/55 py-2 ps-2 pe-4 text-[13px] sm:gap-4 sm:py-2.5 sm:ps-3 sm:pe-5 text-white shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)] ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-[#0f1a2c]/70 sm:text-[15.5px]">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-primary sm:gap-2 sm:px-3">
                <b className="tabular text-[15px] font-bold leading-none sm:text-[19px]">5.0</b><Stars className="text-primary [&_svg]:size-3 sm:[&_svg]:size-[15px]" />
              </span>
              <span className="leading-tight">تقييم عملائنا</span>
              <span className="h-5 w-px bg-white/30 sm:h-6" />
              <span className="flex items-baseline gap-1.5 leading-tight"><b dir="ltr" className="tabular text-[16px] font-bold sm:text-[21px]">+200</b>طلب نفّذناه</span>
            </Link>
          </div>
        </div>
      </div>

      {/* melt softly into the cream page — no hard edge */}
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-48 bg-[linear-gradient(180deg,transparent,rgb(251_252_254/0.7)_45%,var(--background)_82%)] sm:h-72" aria-hidden="true" />
    </section>
  )
}

/** A scene that dissolves into the page: the picture melts at every edge, our words sit beside it on the same cream. */
function SceneBanner({ img, to, href, kicker, title, accent, body, cta, extra }) {
  const inner = (
    <>
      <span className="relative block aspect-[16/10] w-full overflow-hidden sm:aspect-auto sm:h-full">
        <img src={img} alt="" loading="lazy" decoding="async"
          className="size-full object-cover object-left transition-transform duration-[2s] ease-[cubic-bezier(.16,1,.3,1)] [mask-image:radial-gradient(ellipse_62%_62%_at_50%_50%,black_38%,transparent_100%)] group-hover:scale-[1.04]" />
      </span>
      <div className="relative flex flex-col justify-center px-2 pb-4 sm:py-10">
        <span className="text-[14px] font-medium text-primary/60">{kicker}</span>
        <h2 className="mt-2 font-display text-[2rem] font-bold leading-[1.45] text-primary sm:text-[2.5rem]"><span className="block">{title}</span><span className="block font-normal text-primary/60">{accent}</span></h2>
        <p className="mt-2 max-w-md text-[15px] leading-[1.9] text-muted-foreground">{body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-on-inverse shadow-[0_14px_30px_-14px_rgb(27_43_68/0.7)] transition-transform group-hover:-translate-y-0.5">{cta}<ArrowLeft className="size-4" /></span>
          {extra}
        </div>
      </div>
    </>
  )
  const cls = 'group relative grid items-center gap-2 sm:min-h-[360px] sm:grid-cols-[0.9fr_1.1fr]'
  return (
    <Reveal className="container-w mx-auto max-w-[1100px] py-4">
      {to ? <Link to={to} className={cls}>{inner}</Link> : <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>}
    </Reveal>
  )
}

function LandingPromo() {
  const { byId } = useApp()
  const p = byId['landing-page-design']
  return (
    <SceneBanner img={`${ART}/raed-landing.webp`} to="/p/landing-page-design" kicker="طفشت من الاشتراكات الشهرية؟"
      title="صفحة هبوط مبرمجة لك" accent="بدون اشتراك شهري" body="مبرمجة بـ HTML وCSS وJavaScript، مع دومين واستضافة سنة هدية."
      cta="اطلبها الحين" extra={p && <span className="tabular text-xl font-semibold text-primary">{money(effectivePrice(p))}</span>} />
  )
}

function PaymentsStrip() {
  return (
    <SceneBanner img={`${ART}/raed-installments.webp`} href={waLink('السلام عليكم، أبي أعرف عن تقسيط قيمة الخدمة')} kicker="ادفع بالطريقة اللي تريحك"
      title="قسّم قيمة متجرك" accent="على دفعات مريحة" body="ادفع بـ Apple Pay أو فيزا أو ماستركارد، أو قسّطها مع تمارا وتابي."
      cta="اسألنا عن التقسيط" extra={<PayIcons className="w-full max-w-[460px]" />} />
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
    <section className="container-w relative z-10 -mt-16 sm:-mt-24">
      <ul className="mx-auto grid max-w-4xl grid-cols-3 gap-2 px-1 py-4 sm:px-6">
        {items.map((x, i) => (
          <Reveal as="li" key={x.t} delay={i * 100} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-start">
            <LineArt name={x.art} tone="green" className="size-10 shrink-0 text-primary sm:size-12" delay={i * 0.15} />
            <span><b className="block text-[13px] font-semibold text-primary sm:text-[15px]">{x.t}</b><span className="text-[11.5px] text-muted-foreground sm:text-sm">{x.d}</span></span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}


/* ---------------- Store sections ---------------- */
const CAT_ART = {
  'design-services': 'raed-cat-design.webp',
  'marketing-services': 'raed-cat-marketing.webp',
  subscriptions: 'raed-cat-subscriptions.webp',
  'government-services': 'raed-cat-government.webp',
}
/** All categories as one still bento: a large tile locked together with four smaller ones, nothing scrolls. */
function Categories() {
  const { categories, products } = useApp()
  return (
    <section className="container-w">
      <ul className="mx-auto grid max-w-[1040px] grid-cols-2 gap-3 sm:gap-4 lg:aspect-[2/1] lg:grid-cols-4 lg:grid-rows-2">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.categoryId === c.id).length
          const big = i === 0
          // with an even count the last tile spans two columns, so the grid closes with no gap
          const wide = !big && categories.length % 2 === 0 && i === categories.length - 1
          return (
            <Reveal as="li" key={c.id} delay={i * 80} className={cn(big ? 'col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto' : wide ? 'col-span-2 aspect-[2/1] lg:aspect-auto' : 'aspect-square lg:aspect-auto')}>
              <Link to={`/c/${c.id}`} className="group relative block size-full overflow-hidden rounded-[20px] bg-[#0f1a2c] shadow-[0_1px_2px_rgb(27_43_68/0.08),0_24px_40px_-24px_rgb(27_43_68/0.7)] ring-1 ring-primary/10">
                {CAT_ART[c.id]
                  ? <img src={`${ART}/${CAT_ART[c.id]}`} alt={c.name} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
                  : <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(80%_60%_at_50%_30%,#2c4470,#1b2b44_60%,#0f1a2c)] text-on-inverse"><Icon name={c.icon} size={big ? 44 : 30} /></span>}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(15_26_44/0.85))]" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-5">
                  <span className="text-white">
                    <b className={cn('block font-semibold leading-snug', big ? 'text-[19px] sm:text-[24px]' : 'text-[14.5px] sm:text-[16px]')}>{c.name}</b>
                    <span className="tabular text-[12px] text-white/70 sm:text-[13px]">{n} خدمات</span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-colors group-hover:bg-white group-hover:text-primary sm:size-9"><ArrowLeft className="size-4" /></span>
                </span>
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
            <figure className="flex h-full flex-col rounded-xl bg-surface p-5 shadow-[0_16px_40px_-30px_rgb(27_43_68/0.5)] ring-1 ring-accent/30">
              <div className="flex items-center justify-between"><Stars className="text-[#9fb0c8]" /><Quote className="size-5 text-primary/20" strokeWidth={1.4} /></div>
              <blockquote className="mt-3 line-clamp-4 flex-1 text-[14px] leading-7">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 text-xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-semibold text-on-inverse">{r.name.charAt(0)}</span>
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
      <div className="relative isolate">
        <Vine />
        <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_18%_at_95%_14%,rgb(27_43_68/0.07),transparent),radial-gradient(40%_14%_at_5%_34%,rgb(195_206_221/0.12),transparent),radial-gradient(50%_16%_at_100%_56%,rgb(27_43_68/0.06),transparent),radial-gradient(45%_14%_at_0%_78%,rgb(27_43_68/0.06),transparent)]" aria-hidden="true" />
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
      </div>
    </>
  )
}
