import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star, Quote } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { FAQ } from '@/data/content.js'
import { HOME_REVIEWS, MOST_REQUESTED, ALL_REVIEWS } from '@/data/reviews.js'
import { PROOF, PREVIEW, STORE_PDFS, img } from '@/data/work.js'
import { money, effectivePrice, waLink } from '@/lib/format.js'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'
import Storefront3D from '@/components/home/Storefront3D.jsx'
import Divider from '@/components/home/Divider.jsx'
import { StoreCases } from '@/components/home/WorkGallery.jsx'

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-bold text-accent-text">{eyebrow}</p>}
        <h2 className="text-balance font-display text-display-sm font-bold text-primary sm:text-display-md">{title}</h2>
      </div>
      {action}
    </div>
  )
}

const ViewAll = ({ to, children }) => (
  <Button asChild variant="outline"><Link to={to}>{children}<ArrowLeft className="size-4" /></Link></Button>
)

function ReviewCard({ r }) {
  return (
    <figure className="flex h-full flex-col rounded-lg bg-surface p-5 shadow-hairline ring-1 ring-border">
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5 text-accent-text" aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-4" fill="currentColor" strokeWidth={0} />)}</span>
        <Quote className="size-5 text-accent/60" />
      </div>
      <blockquote className="mt-3 line-clamp-4 flex-1 leading-8">{r.text}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm">
        <span className="grid size-9 place-items-center rounded-full bg-sunken font-display font-bold text-primary">{r.name.charAt(0)}</span>
        <span><b className="block text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground">{r.city}</span>}</span>
      </figcaption>
    </figure>
  )
}

export default function Home() {
  const { byId, catalogReady } = useApp()
  const flagship = byId['salla-store-design']
  const top = MOST_REQUESTED.map((id) => byId[id]).filter(Boolean)

  return (
    <>
      {/* ---------- Hero: one promise + the 3D storefront ---------- */}
      <section className="relative overflow-hidden">
        <div className="container-w grid items-center gap-6 pt-8 pb-10 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:pt-12 lg:pb-16">
          <div className="motion-safe:animate-[rise-in_520ms_var(--p-ease-emphasized)]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sunken px-3 py-1.5 text-sm font-semibold text-primary">
              <span className="flex gap-0.5 text-accent-text">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>
              +200 طلب على سلة
            </p>
            <h1 className="text-balance font-display text-[2.4rem] font-bold leading-[1.2] text-primary sm:text-display-lg lg:text-display-xl">
              متجرك في سلة،<br />بتصميم يبيع.
            </h1>
            <p className="mt-4 max-w-[38ch] text-lg leading-9 text-muted-foreground">نصمم متجرك ونجهّزه للبيع من يومين إلى 6 أيام.</p>
            <div className="mt-7 flex gap-2 sm:gap-3">
              {flagship && (
                <Button asChild size="lg" className="flex-1 px-4 sm:flex-none sm:px-8"><Link to={`/p/${flagship.id}`}>صمّم متجري <span className="tabular text-accent">{money(effectivePrice(flagship))}</span></Link></Button>
              )}
              <Button asChild size="lg" variant="outline" className="px-4 sm:px-8"><Link to="/work">أعمالنا</Link></Button>
            </div>
          </div>
          <div className="motion-safe:animate-[rise-in_700ms_var(--p-ease-emphasized)]"><Storefront3D /></div>
        </div>
      </section>

      <Divider />

      {/* ---------- Most requested (real Salla sales ranking) ---------- */}
      <section className="container-w py-14 sm:py-20 [--notch:var(--background)]">
        <SectionHead eyebrow="مرتّبة حسب طلبات عملائنا في سلة" title="الأكثر طلباً" action={<ViewAll to="/shop">عرض الكل</ViewAll>} />
        {!catalogReady
          ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-sunken" />)}</div>
          : <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{top.map((p, i) => <ServiceTicket key={p.id} p={p} rank={i + 1} />)}</div>}
        <div className="mt-8 text-center sm:hidden"><ViewAll to="/shop">عرض كل الخدمات</ViewAll></div>
      </section>

      {/* ---------- Proof strip ---------- */}
      <section className="container-w">
        <dl className="relative grid grid-cols-3 overflow-hidden rounded-xl bg-inverse py-7 text-on-inverse sm:py-10">
          <span className="pointer-events-none absolute -top-16 -start-16 size-48 rounded-full border-[18px] border-accent/10" aria-hidden="true" />
          {PROOF.map((s, i) => (
            <div key={s.label} className="relative px-2 text-center sm:px-6">
              {i > 0 && <span className="absolute inset-y-2 start-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" aria-hidden="true" />}
              <dt className="sr-only">{s.label}</dt>
              <dd className="tabular font-display text-[1.9rem] font-bold leading-none text-accent sm:text-display-md" dir={s.ltr ? 'ltr' : undefined}>{s.value}</dd>
              <dd className="mx-auto mt-3 max-w-[16ch] text-xs leading-6 text-on-inverse/80 sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Divider className="mt-14 sm:mt-20" />

      {/* ---------- Work preview ---------- */}
      <section className="py-14 sm:py-20">
        <div className="container-w"><SectionHead eyebrow="من معرض أعمالنا" title="شغلنا يتكلم" action={<ViewAll to="/work">كل الأعمال</ViewAll>} /></div>
        <ul className="container-w -my-2 flex snap-x snap-mandatory gap-3 overflow-x-auto py-2 [scrollbar-width:none] sm:gap-4">
          {PREVIEW.map((id, i) => (
            <li key={id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]">
              <Link to="/work" className="group block overflow-hidden rounded-lg bg-sunken shadow-hairline ring-1 ring-border">
                <img src={img(id, 900)} alt={`تصميم ${i + 1} من أعمال وارف`} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-emphasized group-hover:scale-[1.03]" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="container-w mt-10">
          <h3 className="mb-4 font-display text-lg font-bold text-primary">متاجر سلّمناها كاملة <span className="tabular text-sm font-normal text-muted-foreground">({STORE_PDFS.length})</span></h3>
          <StoreCases compact />
        </div>
      </section>

      <Divider />

      {/* ---------- Reviews ---------- */}
      <section className="py-14 sm:py-20">
        <div className="container-w">
          <SectionHead eyebrow="تقييمات منشورة في متجرنا على سلة" title="وش قالوا عملاؤنا" action={<ViewAll to="/reviews">المزيد ({ALL_REVIEWS.length})</ViewAll>} />
        </div>
        <ul className="container-w -my-2 flex snap-x snap-mandatory gap-3 overflow-x-auto py-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4">
          {HOME_REVIEWS.map((r, i) => (
            <li key={i} className={`w-[82%] shrink-0 snap-start sm:w-auto ${i > 3 ? 'sm:hidden' : ''}`}><ReviewCard r={r} /></li>
          ))}
        </ul>
        <div className="container-w mt-8 text-center"><Button asChild size="lg"><Link to="/reviews">شوف كل الآراء<ArrowLeft className="size-4" /></Link></Button></div>
      </section>

      <Divider />

      {/* ---------- FAQ ---------- */}
      <section className="container-w grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionHead eyebrow="قبل ما تطلب" title="أسئلة تتكرر" />
        <Accordion type="single" collapsible className="grid gap-3">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={String(i)}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a} {f.link && <Link className="font-semibold text-primary underline underline-offset-4" to={f.link}>السياسات والشروط</Link>}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ---------- Close ---------- */}
      <section className="container-w pb-4">
        <div className="relative overflow-hidden rounded-xl bg-inverse px-6 py-10 text-center text-on-inverse sm:py-14">
          <span className="pointer-events-none absolute -bottom-20 -end-20 size-64 rounded-full border-[24px] border-accent/10" aria-hidden="true" />
          <h2 className="text-balance font-display text-2xl font-bold sm:text-display-sm">محتار من وين تبدأ؟</h2>
          <p className="mx-auto mt-2 max-w-md text-on-inverse/80">قل لنا وش نشاطك، ونرتّب لك اللي تحتاجه فعلاً.</p>
          <Button asChild size="lg" variant="accent" className="mt-6"><a href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer"><MessageCircle />استشرنا على واتساب</a></Button>
        </div>
      </section>
    </>
  )
}
