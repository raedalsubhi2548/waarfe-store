import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, Check, ChevronLeft, Quote, Hand } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ } from '@/data/content.js'
import { FEATURED_REVIEW, HOME_REVIEWS, CORE_SERVICES, ALL_REVIEWS } from '@/data/reviews.js'
import { PREVIEW, STORE_PDFS, WORK } from '@/data/work.js'
import { money, effectivePrice, parseDescription, waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Icon from '@/components/Icon.jsx'
import Showroom3D from '@/components/home/Showroom3D.jsx'
import Divider from '@/components/home/Divider.jsx'
import Phone from '@/components/home/Phone.jsx'
import { WorkGallery } from '@/components/home/WorkGallery.jsx'

const Stars = ({ className }) => <span className={cn('flex gap-0.5', className)} aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>

function Head({ eyebrow, title, action, center }) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10', center && 'justify-center text-center')}>
      <div>
        {eyebrow && <p className="mb-2 text-sm font-bold text-accent-text">{eyebrow}</p>}
        <h2 className="text-balance font-display text-[1.9rem] font-bold leading-tight text-primary sm:text-display-md">{title}</h2>
      </div>
      {action}
    </div>
  )
}
const More = ({ to, children }) => (
  <Link to={to} className="group inline-flex h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary">
    <span className="border-b-2 border-accent pb-0.5">{children}</span><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
  </Link>
)

/* ---------------- Hero: the showroom ---------------- */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-inverse text-on-inverse">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_70%,rgb(215_198_118/0.20),transparent_70%),radial-gradient(40%_40%_at_85%_0%,rgb(215_198_118/0.10),transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(var(--accent)_1px,transparent_1px),linear-gradient(90deg,var(--accent)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]" aria-hidden="true" />
      <div className="container-w pt-12 text-center sm:pt-16">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/5 px-3 py-1.5 text-sm motion-safe:animate-[rise-in_500ms_var(--p-ease-emphasized)]">
          <Stars className="text-accent" /><span className="tabular font-bold">5.0</span><span className="text-on-inverse/70">· +200 طلب على سلة</span>
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance font-display text-[2.6rem] font-bold leading-[1.15] sm:text-display-lg lg:text-display-xl motion-safe:animate-[rise-in_620ms_var(--p-ease-emphasized)]">
          متجرك في سلة، <span className="text-accent">بتصميم يبيع.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-balance text-lg leading-8 text-on-inverse/75 motion-safe:animate-[rise-in_720ms_var(--p-ease-emphasized)]">نصمم متجرك ونجهّزه للبيع من يومين إلى 6 أيام.</p>
        <div className="mt-7 flex justify-center gap-3 motion-safe:animate-[rise-in_820ms_var(--p-ease-emphasized)]">
          <Button asChild size="lg" variant="accent" className="px-7"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
          <Button asChild size="lg" variant="ghost" className="border border-on-inverse/25 px-6 text-on-inverse hover:bg-white/10 hover:text-on-inverse"><Link to="/work">شوف أعمالنا</Link></Button>
        </div>
      </div>
      <div className="relative mt-6 sm:mt-10"><Showroom3D /></div>
      <p className="pb-8 text-center text-xs text-on-inverse/45"><Hand className="me-1 inline size-3.5" />اسحب وشوف متاجر سلّمناها</p>
    </section>
  )
}

/* ---------------- Core services ---------------- */
function Core() {
  const { byId, addToCart, catalogReady } = useApp()
  const [main, ...rest] = CORE_SERVICES.map((id) => byId[id]).filter(Boolean)
  if (!catalogReady || !main) return <div className="container-w grid gap-4 py-16 lg:grid-cols-[1.4fr_1fr]"><div className="h-96 animate-pulse rounded-xl bg-sunken" /><div className="h-96 animate-pulse rounded-xl bg-sunken" /></div>
  const points = parseDescription(main.description).sections.find((s) => s.title.startsWith('تفاصيل'))?.items.slice(0, 4) || []
  return (
    <section className="container-w py-14 sm:py-20">
      <Head eyebrow="اللي يطلبه عملاؤنا أكثر" title="خدماتنا الأساسية" action={<More to="/shop">كل الخدمات</More>} />
      <div className="grid gap-3 sm:gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* flagship */}
        <article className="relative grid overflow-hidden rounded-xl bg-inverse text-on-inverse sm:grid-cols-[1fr_0.9fr]">
          <div className="relative z-10 flex flex-col p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground"><Star className="size-3.5" fill="currentColor" strokeWidth={0} />الأكثر طلباً</span>
            <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl"><Link to={`/p/${main.id}`} className="hover:underline hover:underline-offset-8">{main.name}</Link></h3>
            <p className="mt-2 leading-8 text-on-inverse/75">{main.summary}</p>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {points.map((t) => <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={3} />{t}</li>)}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
              <span className="tabular font-display text-3xl font-bold text-accent">{money(effectivePrice(main))}</span>
              <Button variant="accent" onClick={() => addToCart(main.id)}>أضف للسلة</Button>
              <Link to={`/p/${main.id}`} className="text-sm font-semibold underline underline-offset-4 opacity-80 hover:opacity-100">التفاصيل</Link>
            </div>
          </div>
          <div className="relative hidden items-end justify-center gap-3 overflow-hidden px-6 pt-10 sm:flex" aria-hidden="true">
            <span className="absolute inset-0 bg-[radial-gradient(closest-side,rgb(215_198_118/0.25),transparent)]" />
            <Phone pdfId={STORE_PDFS[0].id} at={8} className="relative w-[46%] translate-y-6 rotate-[-4deg]" />
            <Phone pdfId={STORE_PDFS[1].id} at={14} className="relative w-[46%] translate-y-12 rotate-[4deg]" />
          </div>
        </article>

        {/* two companions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-1">
          {rest.map((p) => (
            <article key={p.id} className="group flex flex-col overflow-hidden rounded-xl bg-surface shadow-hairline ring-1 ring-border transition-shadow hover:shadow-card lg:flex-row">
              <Link to={`/p/${p.id}`} className="block shrink-0 overflow-hidden bg-sunken lg:w-[42%]"><img src={p.image} alt="" loading="lazy" className="aspect-square size-full object-cover transition-transform duration-700 ease-emphasized group-hover:scale-[1.04]" /></Link>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-display text-[15px] font-bold leading-7 text-primary sm:text-lg"><Link to={`/p/${p.id}`} className="hover:underline">{p.name}</Link></h3>
                <p className="mt-1 line-clamp-2 hidden text-sm leading-7 text-muted-foreground sm:block">{p.summary}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="tabular font-display text-lg font-bold text-primary">{money(effectivePrice(p))}</span>
                  <Button size="sm" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}>أضف</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Installments ---------------- */
function Installments() {
  return (
    <section className="container-w">
      <div className="relative grid items-center gap-6 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#f6efd6,#fefbf2_55%,#efe5c2)] p-6 ring-1 ring-accent/40 sm:grid-cols-[1fr_auto] sm:p-10">
        <span className="pointer-events-none absolute -bottom-24 -start-16 size-64 rounded-full border-[22px] border-accent/15" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-16 place-items-center rounded-md bg-white shadow-hairline"><img src="https://cdn.tamara.co/assets/svg/tamara-logo-badge-ar.svg" alt="تمارا" className="max-h-[60%]" /></span>
            <span className="grid h-9 w-16 place-items-center rounded-md bg-white shadow-hairline"><img src="https://cdn.tabby.ai/assets/logo.svg" alt="تابي" className="max-h-[60%]" /></span>
          </div>
          <h2 className="mt-4 text-balance font-display text-2xl font-bold text-primary sm:text-3xl">تبي متجر؟ قسّط قيمته.</h2>
          <p className="mt-2 max-w-md leading-8 text-muted-foreground">قسّم قيمة تصميم متجرك والخدمات على دفعات مع تمارا وتابي، وابدأ اليوم.</p>
        </div>
        <div className="relative grid justify-items-center gap-4 sm:w-72">
          {/* payment plan animation: one part today, the rest fill in over time */}
          <div className="grid w-full grid-cols-4 gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="relative h-3 overflow-hidden rounded-full bg-primary/10">
                <span className="absolute inset-y-0 start-0 w-full origin-right scale-x-0 rounded-full bg-primary motion-safe:animate-[plan_6s_ease-in-out_infinite] motion-reduce:scale-x-100" style={{ animationDelay: `${i * 0.9}s` }} />
              </span>
            ))}
          </div>
          <div className="flex w-full justify-between text-xs font-bold text-muted-foreground" aria-hidden="true"><span className="text-primary">اليوم</span><span>بعدين</span></div>
          <Button asChild className="w-full"><a href={waLink('السلام عليكم، أبي أصمم متجري وأقسّط المبلغ')} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />اسألنا عن التقسيط</a></Button>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Categories ---------------- */
function Categories() {
  const { categories, products } = useApp()
  return (
    <section className="container-w py-14 sm:py-20">
      <Head eyebrow="كل شي يحتاجه متجرك" title="تصفّح حسب القسم" />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.categoryId === c.id).length
          return (
            <li key={c.id} className={cn(i === categories.length - 1 && categories.length % 2 && 'col-span-2 lg:col-span-1')}>
              <Link to={`/c/${c.id}`} className="group flex h-full flex-col rounded-lg bg-surface p-4 shadow-hairline ring-1 ring-border transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-card sm:p-5">
                <span className="grid size-11 place-items-center rounded-md bg-primary text-accent transition-transform duration-500 group-hover:rotate-[-8deg]"><Icon name={c.icon} size={20} /></span>
                <span className="mt-4 font-display font-bold text-primary">{c.name}</span>
                <span className="mt-1 hidden text-sm leading-6 text-muted-foreground sm:line-clamp-2">{c.blurb}</span>
                <span className="mt-auto flex items-center justify-between pt-4 text-sm">
                  <span className="tabular font-semibold text-accent-text">{n} خدمات</span>
                  <ChevronLeft className="size-4 text-primary transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ---------------- Stores we delivered ---------------- */
function Stores() {
  return (
    <section className="relative overflow-hidden bg-inverse py-14 text-on-inverse sm:py-20">
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgb(215_198_118/0.18),transparent)]" aria-hidden="true" />
      <div className="container-w relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold text-accent">متاجر سلّمناها كاملة</p>
            <h2 className="font-display text-[1.9rem] font-bold leading-tight sm:text-display-md">من الفكرة لمتجر يبيع</h2>
          </div>
          <Link to="/work" className="group inline-flex h-11 items-center gap-2 text-sm font-bold"><span className="border-b-2 border-accent pb-0.5">كل المتاجر</span><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></Link>
        </div>
        <ul className="grid grid-cols-3 items-end gap-3 sm:gap-8 lg:px-16">
          {STORE_PDFS.map((s, i) => (
            <li key={s.id} className={cn(i === 1 && '-translate-y-4 sm:-translate-y-8')}>
              <Link to="/work" className="group block focus-visible:outline-none" aria-label={`متجر ${s.name}`}>
                <Phone pdfId={s.id} scrollOnHover size={420} className="transition-transform duration-500 ease-emphasized group-hover:-translate-y-2" />
                <p className="mt-4 text-center font-display text-sm font-bold sm:text-base">{s.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Banners & social ---------------- */
function Banners() {
  return (
    <section className="container-w py-14 sm:py-20">
      <Head eyebrow="بنرات وتصاميم سوشال ميديا" title="تصاميم تشد العين" action={<More to="/work?tab=banners">كل التصاميم ({WORK.length})</More>} />
      <WorkGallery items={PREVIEW} className="columns-2 sm:columns-3 lg:columns-4" />
    </section>
  )
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  const f = FEATURED_REVIEW
  return (
    <section className="container-w py-14 sm:py-20">
      <Head eyebrow="تقييمات منشورة في متجرنا على سلة" title="وش قالوا عملاؤنا" action={<More to="/reviews">كل الآراء ({ALL_REVIEWS.length})</More>} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <figure className="relative col-span-2 flex flex-col overflow-hidden rounded-xl bg-inverse p-6 text-on-inverse sm:p-8 lg:col-span-1 lg:row-span-2">
          <Quote className="size-10 text-accent" />
          <blockquote className="mt-4 flex-1 font-display text-lg leading-9 sm:text-xl">{f.text}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="grid size-11 place-items-center rounded-full bg-accent font-display font-bold text-accent-foreground">{f.name.charAt(0)}</span>
            <span><b className="block">{f.name}</b><span className="text-sm text-on-inverse/70">{f.city}</span></span>
            <Stars className="ms-auto text-accent" />
          </figcaption>
        </figure>
        {HOME_REVIEWS.map((r, i) => (
          <figure key={i} className="flex flex-col rounded-lg bg-surface p-4 shadow-hairline ring-1 ring-border sm:p-5">
            <Stars className="text-accent-text" />
            <blockquote className="mt-3 line-clamp-5 flex-1 text-sm leading-7 sm:text-[15px] sm:leading-8">{r.text}</blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 text-xs sm:text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken font-display font-bold text-primary">{r.name.charAt(0)}</span>
              <span className="min-w-0"><b className="block truncate text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground">{r.city}</span>}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Core />
      <Installments />
      <Divider className="mt-14 sm:mt-20" />
      <Categories />
      <Stores />
      <Banners />
      <Divider />
      <Reviews />
      <Divider />
      <section className="container-w grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]">
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
      <section className="container-w pb-4">
        <div className="relative overflow-hidden rounded-xl bg-inverse px-6 py-10 text-center text-on-inverse sm:py-14">
          <span className="pointer-events-none absolute -bottom-20 -end-20 size-64 rounded-full border-[24px] border-accent/10" aria-hidden="true" />
          <Divider tone="dark" className="mb-2 !w-full max-w-xs" />
          <h2 className="text-balance font-display text-2xl font-bold sm:text-display-sm">محتار من وين تبدأ؟</h2>
          <p className="mx-auto mt-2 max-w-md text-on-inverse/80">قل لنا وش نشاطك، ونرتّب لك اللي تحتاجه فعلاً.</p>
          <Button asChild size="lg" variant="accent" className="mt-6"><a href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer"><MessageCircle />استشرنا على واتساب</a></Button>
        </div>
      </section>
    </>
  )
}
