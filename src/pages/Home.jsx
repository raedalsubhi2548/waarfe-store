import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ } from '@/data/content.js'
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
import { SectionTitle } from '@/components/brand/Ornaments.jsx'
import PayIcons from '@/components/brand/PayIcons.jsx'

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
    <ul className="mx-auto grid max-w-[980px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {items.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 4) * 90}><ServiceTicket p={p} className="h-full" /></Reveal>)}
    </ul>
  )
}

/* ---------------- Hero: a cinematic scene (our own AI art) merged with the header ---------------- */
const DUST = Array.from({ length: 16 }, (_, i) => ({ l: (i * 61) % 100, t: 20 + ((i * 37) % 70), d: 8 + (i % 5) * 1.8, w: i * 0.9, s: 2 + (i % 3) }))
const ART = '/brand/ai'

function Hero() {
  return (
    <section className="relative -mt-[var(--header-height)] isolate overflow-hidden bg-[#062a22] text-on-inverse">
      {/* the scene */}
      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 767px)" srcSet={`${ART}/waarfe-hero-mobile.webp`} />
        <img src={`${ART}/waarfe-hero.webp`} alt="" width="2800" height="1188" fetchPriority="high" decoding="async"
          className="size-full object-cover object-[50%_100%] md:object-[0%_50%] motion-safe:animate-[kenburns_28s_ease-in-out_infinite_alternate]" />
      </picture>
      {/* melt the scene into the header (top), the text side, and the page (bottom) */}
      <span className="absolute inset-x-0 top-0 -z-10 h-48 bg-[linear-gradient(#062a22,transparent)]" aria-hidden="true" />
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_42_34/0.95)_0%,rgb(6_42_34/0.82)_42%,transparent_68%)] md:bg-[linear-gradient(270deg,rgb(6_42_34/0.9)_0%,rgb(6_42_34/0.55)_38%,transparent_62%)]" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 opacity-0 bg-[linear-gradient(100deg,transparent,rgb(246_231_168/0.10),transparent)] motion-safe:animate-[sweep_9s_ease-in-out_infinite]" aria-hidden="true" />
      {DUST.map((d, i) => (
        <span key={i} className="pointer-events-none absolute -z-10 rounded-full bg-[#e8d48a] shadow-[0_0_8px_#f3e3a1] motion-safe:animate-[dust_var(--d)_linear_infinite]" style={{ left: `${d.l}%`, top: `${d.t}%`, width: d.s, height: d.s, '--d': `${d.d}s`, '--dx': `${(i % 2 ? 1 : -1) * (10 + i * 2)}px`, animationDelay: `${d.w}s` }} aria-hidden="true" />
      ))}

      <div className="container-w relative flex min-h-[640px] flex-col justify-start pt-[calc(var(--header-height)+92px)] pb-[42vh] sm:min-h-[720px] md:min-h-[min(92vh,820px)] md:justify-center md:pb-32 md:pt-[calc(var(--header-height)+40px)]">
        <div className="mx-auto max-w-[560px] text-center md:ms-0 md:me-auto md:text-start lg:ms-[2%]">
          <p className="inline-flex items-center gap-3 text-[14px] font-medium text-accent motion-safe:animate-[rise-in_700ms_var(--p-ease-emphasized)_both]">
            <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,var(--accent))]" />تصميم متاجر سلة<span className="h-px w-10 bg-[linear-gradient(270deg,transparent,var(--accent))] md:hidden" />
          </p>
          <h1 className="mt-5 font-display text-[2.35rem] font-bold leading-[1.35] sm:text-[3rem] lg:text-[3.6rem] lg:leading-[1.3] motion-safe:animate-[rise-in_850ms_var(--p-ease-emphasized)_both]">
            <span className="block">متجرك يستاهل</span>
            <span className="block text-accent [text-shadow:0_2px_30px_rgb(215_198_118/0.35)]">تصميم يليق فيه</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[30ch] text-[17px] sm:max-w-[34ch] leading-[1.9] text-on-inverse/85 [text-shadow:0_1px_12px_rgb(6_42_34/0.9)] md:mx-0 motion-safe:animate-[rise-in_1s_var(--p-ease-emphasized)_both]">نصمم متجرك في سلة ونجهّزه للبيع خلال يومين إلى ستة أيام، بتفاصيل تشبه علامتك.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start motion-safe:animate-[rise-in_1.15s_var(--p-ease-emphasized)_both]">
            <Button asChild size="lg" variant="accent" className="px-8 font-semibold shadow-[0_16px_34px_-12px_rgb(215_198_118/0.7)]"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="inverse" className="px-7 font-medium backdrop-blur"><Link to="/work">شوف أعمالنا</Link></Button>
          </div>
          <div className="mt-9 flex items-center justify-center gap-5 text-[13.5px] text-on-inverse/75 md:justify-start motion-safe:animate-[rise-in_1.3s_var(--p-ease-emphasized)_both]">
            <span className="flex items-center gap-2"><Stars className="text-accent" /><b className="tabular font-semibold text-on-inverse">5.0</b> تقييم عملائنا</span>
            <span className="h-4 w-px bg-accent/40" />
            <span><b dir="ltr" className="font-semibold text-on-inverse">+200</b> طلب على سلة</span>
          </div>
        </div>
      </div>

      {/* concave arch into the cream page, with a gold hairline */}
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[70px] w-full sm:h-[120px]" aria-hidden="true">
        <path d="M0 140 V40 Q720 150 1440 40 V140 Z" fill="var(--background)" />
        <path d="M0 40 Q720 150 1440 40" fill="none" stroke="#d7c676" strokeOpacity=".8" strokeWidth="1.4" />
      </svg>
    </section>
  )
}

/** Wide image banner: AI scene on one side, our words on the other (RTL: text on the right). */
function SceneBanner({ img, to, href, kicker, title, accent, body, cta, extra }) {
  const inner = (
    <>
      <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full origin-left scale-[1.1] object-cover object-left transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.14]" />
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(6_42_34/0.95)_0%,rgb(6_42_34/0.6)_45%,transparent_75%)] sm:bg-[linear-gradient(270deg,rgb(6_42_34/0.96)_0%,rgb(6_42_34/0.75)_40%,transparent_70%)]" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-[8px] rounded-[18px] ring-1 ring-accent/35" aria-hidden="true" />
      <div className="relative me-auto flex min-h-[340px] max-w-[440px] flex-col justify-end p-6 sm:min-h-[300px] sm:justify-center sm:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-primary shadow-[0_8px_20px_-10px_rgb(215_198_118/0.8)]">{kicker}</span>
        <h2 className="mt-3 font-display text-[1.45rem] font-bold leading-[1.5] sm:text-[1.8rem]"><span className="block">{title}</span><span className="block text-accent">{accent}</span></h2>
        <p className="mt-2 text-[14.5px] leading-[1.85] text-on-inverse/85">{body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-semibold text-primary shadow-[0_14px_30px_-12px_rgb(215_198_118/0.7)] transition-transform group-hover:-translate-y-0.5">{cta}<ArrowLeft className="size-4" /></span>
          {extra}
        </div>
      </div>
    </>
  )
  const cls = 'group relative isolate block overflow-hidden rounded-[24px] bg-[#062a22] text-on-inverse shadow-[0_40px_80px_-40px_rgb(9_56_46/0.9)]'
  return (
    <Reveal className="container-w mx-auto max-w-[1100px] py-6">
      {to ? <Link to={to} className={cls}>{inner}</Link> : <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>}
    </Reveal>
  )
}

function LandingPromo() {
  const { byId } = useApp()
  const p = byId['landing-page-design']
  return (
    <SceneBanner img={`${ART}/waarfe-landing.webp`} to="/p/landing-page-design" kicker="طفشت من الاشتراكات الشهرية؟"
      title="صفحة هبوط مبرمجة لك" accent="بدون اشتراك شهري" body="مبرمجة بـ HTML وCSS وJavaScript، مع دومين واستضافة سنة هدية."
      cta="اطلبها الحين" extra={p && <span className="tabular text-xl font-semibold text-accent">{money(effectivePrice(p))}</span>} />
  )
}

function PaymentsStrip() {
  return (
    <SceneBanner img={`${ART}/waarfe-installments.webp`} href={waLink('السلام عليكم، أبي أعرف عن تقسيط قيمة الخدمة')} kicker="ادفع بالطريقة اللي تريحك"
      title="قسّم قيمة متجرك" accent="على دفعات مريحة" body="مدى، Apple Pay، البطاقات أو التحويل البنكي، واسألنا عن التقسيط مع تمارا وتابي."
      cta="اسألنا عن التقسيط" extra={<PayIcons className="w-full" />} />
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
const CAT_ART = {
  'design-services': 'waarfe-cat-design.webp',
  'marketing-services': 'waarfe-cat-marketing.webp',
  'government-services': 'waarfe-cat-government.webp',
}
/** All categories in one row: small arch-topped cards. */
function Categories() {
  const { categories, products } = useApp()
  return (
    <section className="container-w">
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-auto sm:grid sm:max-w-[1000px] sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.categoryId === c.id).length
          return (
            <Reveal as="li" key={c.id} delay={i * 80} className="w-[136px] shrink-0 snap-start sm:w-auto">
              <Link to={`/c/${c.id}`} className="group block text-center">
                <span className="relative block rounded-t-[999px] rounded-b-[18px] bg-[linear-gradient(160deg,#f3e3a1,#b8973c_45%,#e8d384)] p-[1.5px] shadow-[0_18px_34px_-20px_rgb(9_56_46/0.7)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_44px_-22px_rgb(9_56_46/0.8)]">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[16.5px] bg-[#062a22]">
                    {CAT_ART[c.id]
                      ? <img src={`${ART}/${CAT_ART[c.id]}`} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.08]" />
                      : <span className="grid size-full place-items-center bg-[radial-gradient(80%_60%_at_50%_30%,#1a6a55,#09382e_60%,#052119)] text-accent"><span className="grid size-16 place-items-center rounded-full ring-1 ring-accent/50 shadow-[0_0_40px_-6px_rgb(215_198_118/0.5)]"><Icon name={c.icon} size={28} /></span></span>}
                    <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(transparent,rgb(6_42_34/0.75))]" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-3 block text-[15px] font-semibold text-primary">{c.name}</span>
                <span className="tabular text-[12.5px] text-muted-foreground">{n} خدمات</span>
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
