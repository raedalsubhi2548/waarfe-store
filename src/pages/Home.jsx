import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react'
import { FAQ } from '@/data/content.js'
import { waLink, money, effectivePrice } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { useInView } from '@/lib/useInView.js'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import PayIcons from '@/components/brand/PayIcons.jsx'
import StoreBuilder from '@/components/play/StoreBuilder.jsx'
import ServiceFinder from '@/components/play/ServiceFinder.jsx'
import CategoryExplorer from '@/components/play/CategoryExplorer.jsx'
import ReviewDeck from '@/components/play/ReviewDeck.jsx'
import WorkRail from '@/components/play/WorkRail.jsx'
import CursorGlow from '@/components/play/CursorGlow.jsx'

const ART = '/brand/ai'

/** Fades/rises its children in once, when scrolled into view. */
function Reveal({ as: T = 'div', className, delay = 0, children, ...p }) {
  const [ref, on] = useInView()
  return <T ref={ref} className={cn('transition-[opacity,translate,scale] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]', on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0', className)} style={{ transitionDelay: `${delay}ms` }} {...p}>{children}</T>
}

function Head({ eyebrow, title }) {
  return (
    <Reveal className="mb-8 text-center sm:mb-12">
      {eyebrow && <p className="mb-3 flex items-center justify-center gap-2 text-[13.5px] font-medium text-primary/60"><span className="h-px w-6 bg-primary/25" />{eyebrow}<span className="h-px w-6 bg-primary/25" /></p>}
      <h2 className="text-balance font-display text-[1.6rem] font-semibold text-primary sm:text-display-sm lg:text-display-md">{title}</h2>
    </Reveal>
  )
}


/** A slow ticker of true facts, carrying the hero's green into the page. */
function TrustTicker() {
  const items = [
    [Star, '5.0 تقييم عملائنا في سلة'],
    [Sparkles, '+200 طلب على متجرنا في سلة'],
    [Clock, 'تسليم المتجر من يومين إلى 6 أيام'],
    [ShieldCheck, 'دفع آمن: مدى، Apple Pay، البطاقات'],
    [MessageCircle, 'تواصل مباشر على واتساب'],
  ]
  const row = [...items, ...items, ...items]
  return (
    <div className="relative overflow-hidden bg-[#062a22] pb-10 text-on-inverse/85">
      <div className="flex [mask-image:linear-gradient(to_left,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max shrink-0 items-center gap-10 py-4 motion-safe:animate-[marquee_60s_linear_infinite]">
          {row.map(([I, t], k) => <li key={k} aria-hidden={k >= items.length || undefined} className="flex shrink-0 items-center gap-2.5 text-[14.5px]"><I className="size-4 text-[#8fd3b6]" />{t}<span className="ms-8 size-1 rounded-full bg-white/25" /></li>)}
        </ul>
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(#062a22,var(--background))]" aria-hidden="true" />
    </div>
  )
}

/** Wide image banner: AI scene on one side, our words on the other (RTL: text on the right). */
function SceneBanner({ img, to, href, kicker, title, accent, body, cta, extra }) {
  const inner = (
    <>
      <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full origin-left scale-[1.1] object-cover object-left transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.14]" />
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(6_42_34/0.95)_0%,rgb(6_42_34/0.6)_45%,transparent_75%)] sm:bg-[linear-gradient(270deg,rgb(6_42_34/0.96)_0%,rgb(6_42_34/0.75)_40%,transparent_70%)]" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-[8px] rounded-[18px] ring-1 ring-white/15" aria-hidden="true" />
      <div className="relative me-auto flex min-h-[340px] max-w-[440px] flex-col justify-end p-6 sm:min-h-[300px] sm:justify-center sm:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-background px-3.5 py-1.5 text-[13px] font-semibold text-primary shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)]">{kicker}</span>
        <h2 className="mt-3 font-display text-[1.45rem] font-bold leading-[1.5] sm:text-[1.8rem]"><span className="block">{title}</span><span className="block font-light text-[#efe7cf]">{accent}</span></h2>
        <p className="mt-2 text-[14.5px] leading-[1.85] text-on-inverse/85">{body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-[14px] font-semibold text-primary shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)] transition-transform group-hover:-translate-y-0.5">{cta}<ArrowLeft className="size-4" /></span>
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
      cta="اطلبها الحين" extra={p && <span className="tabular text-xl font-semibold text-on-inverse">{money(effectivePrice(p))}</span>} />
  )
}

function PaymentsStrip() {
  return (
    <SceneBanner img={`${ART}/waarfe-installments.webp`} href={waLink('السلام عليكم، أبي أعرف عن تقسيط قيمة الخدمة')} kicker="ادفع بالطريقة اللي تريحك"
      title="قسّم قيمة متجرك" accent="على دفعات مريحة" body="مدى، Apple Pay، البطاقات أو التحويل البنكي، واسألنا عن التقسيط مع تمارا وتابي."
      cta="اسألنا عن التقسيط" extra={<PayIcons className="w-full" />} />
  )
}


export default function Home() {
  return (
    <>
      <StoreBuilder />
      <TrustTicker />
      <div className="relative isolate">
        <CursorGlow />
        <ServiceFinder />
        <LandingPromo />
        <CategoryExplorer />
        <PaymentsStrip />
        <WorkRail />
        <ReviewDeck />
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
