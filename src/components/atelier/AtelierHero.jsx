import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STORE_PDFS } from '@/data/work.js'
import { cn } from '@/lib/utils'

const lh3 = (id, w) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
// Velvet in front, then Glisten, then مروج اليسر
const STORES = [STORE_PDFS[0], STORE_PDFS[1], STORE_PDFS[2]].map((s) => lh3(s.id, 400))
const CH = [[0, 0.24], [0.32, 0.6], [0.68, 1.01]]

/** A pinned, scroll-driven 3D opening: three chapters, one camera move. */
export default function AtelierHero() {
  const section = useRef(null)
  const canvas = useRef(null)
  const chapters = useRef([])
  const rail = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let api, alive = true, raf = 0
    const progress = () => {
      const el = section.current
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)))
    }
    const paint = () => {
      raf = 0
      const p = progress()
      api?.setProgress(p)
      chapters.current.forEach((n, i) => {
        if (!n) return
        const [a, b] = CH[i], fade = 0.07
        const o = i === 0 ? (p < b - fade ? 1 : Math.max(0, (b - p) / fade))
          : p < a ? 0 : p < a + fade ? (p - a) / fade : p < b - fade || i === CH.length - 1 ? 1 : Math.max(0, (b - p) / fade)
        n.style.opacity = o.toFixed(3)
        n.style.translate = `0 ${((1 - o) * (p < a ? 24 : -24)).toFixed(1)}px`
        n.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
      })
      if (rail.current) rail.current.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    paint()
    const go = () => import('./atelierScene.js').then(({ createAtelier }) => {
      if (!alive || !canvas.current) return
      try { api = createAtelier(canvas.current, { stores: STORES, onReady: () => alive && setReady(true) }); paint() } catch { /* WebGL unavailable: text-only hero */ }
    })
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 900 }) : setTimeout(go, 200)
    return () => {
      alive = false; api?.dispose(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll)
      'cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id)
    }
  }, [])

  const chapter = 'absolute inset-x-0 top-[calc(var(--header-height)+20px)] px-5 text-center transition-none will-change-[opacity,translate] lg:inset-x-auto lg:top-1/2 lg:start-[max(32px,calc((100vw-var(--container))/2))] lg:w-[min(460px,40vw)] lg:-translate-y-1/2 lg:px-0 lg:text-start'
  return (
    <section ref={section} className="relative h-[300svh]" aria-label="وارف: متاجر تُصمَّم لتبيع">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* studio backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_55%,#f6edcf,transparent_70%),linear-gradient(180deg,#fefbf2,#f8f1dc)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgb(215_198_118/0.18))]" aria-hidden="true" />
        <svg className="absolute inset-0 size-full opacity-[0.35] mix-blend-multiply" aria-hidden="true"><filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0.06 0" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg>

        <canvas ref={canvas} className={cn('absolute inset-0 size-full transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />

        {/* chapter 1 */}
        <div ref={(n) => (chapters.current[0] = n)} className={chapter}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] ring-1 ring-accent/40 backdrop-blur">
            <span className="flex gap-0.5 text-accent-text">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-3" fill="currentColor" strokeWidth={0} />)}</span>
            <span className="tabular font-semibold text-primary">5.0</span><span className="text-muted-foreground">· +200 طلب على سلة</span>
          </p>
          <h1 className="mt-5 text-balance font-display text-[2.1rem] font-semibold leading-[1.3] text-primary sm:text-display-lg lg:text-[3.25rem] lg:leading-[1.2]">متجرك في سلة،<br />بتصميم يبيع.</h1>
          <p className="mx-auto mt-4 max-w-[34ch] text-[16px] leading-8 text-muted-foreground lg:mx-0">متاجر نصممها بعناية، ونسلّمها جاهزة للبيع.</p>
          <div className="mt-7 flex justify-center gap-3 lg:justify-start">
            <Button asChild size="lg" className="px-7 font-medium"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-white/60 px-6 font-medium backdrop-blur"><Link to="/work">أعمالنا</Link></Button>
          </div>
        </div>

        {/* chapter 2 */}
        <div ref={(n) => (chapters.current[1] = n)} className={cn(chapter, 'opacity-0')}>
          <p className="text-[13px] font-medium tracking-wide text-accent-text"><span className="tabular">01</span> — التصميم</p>
          <h2 className="mt-3 text-balance font-display text-[1.9rem] font-semibold leading-[1.35] text-primary sm:text-display-md lg:text-[2.6rem]">هوية تشبهك،<br />ومتجر يشبه هويتك.</h2>
          <p className="mx-auto mt-4 max-w-[34ch] leading-8 text-muted-foreground lg:mx-0">بنرات، أقسام، وصفحات منتجات مصممة لعلامتك، مو قالب مكرر.</p>
        </div>

        {/* chapter 3 */}
        <div ref={(n) => (chapters.current[2] = n)} className={cn(chapter, 'opacity-0')}>
          <p className="text-[13px] font-medium tracking-wide text-accent-text"><span className="tabular">02</span> — التسليم</p>
          <h2 className="mt-3 text-balance font-display text-[1.9rem] font-semibold leading-[1.35] text-primary sm:text-display-md lg:text-[2.6rem]">جاهز للبيع<br />من يومين إلى 6 أيام.</h2>
          <p className="mx-auto mt-4 max-w-[34ch] leading-8 text-muted-foreground lg:mx-0">هذي متاجر سلّمناها لعملائنا: Velvet وGlisten ومروج اليسر.</p>
          <div className="mt-7 flex justify-center gap-3 lg:justify-start">
            <Button asChild size="lg" className="px-7 font-medium"><Link to="/p/salla-store-design">ابدأ متجرك<ArrowLeft className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-white/60 px-6 font-medium backdrop-blur"><Link to="/work">كل المتاجر</Link></Button>
          </div>
        </div>

        {/* progress rail */}
        <div ref={rail} className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 text-[11px] text-muted-foreground [--p:0]" aria-hidden="true">
          <MousePointer2 className="size-3.5 rotate-[-20deg]" />
          <span className="relative h-[3px] w-28 overflow-hidden rounded-full bg-primary/10"><span className="absolute inset-y-0 start-0 w-full origin-right scale-x-[var(--p)] rounded-full bg-accent" /></span>
          <span>مرّر للأسفل</span>
        </div>
      </div>
    </section>
  )
}
