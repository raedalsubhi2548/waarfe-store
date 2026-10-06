import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { WORK } from '@/data/work.js'

const lh3 = (id, w) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
// [index in WORK, aspect ratio]
const PIECES = [[8, 1.79], [15, 1], [2, 2.35], [25, 1.79], [32, 1], [10, 2.35], [21, 1.79], [37, 1], [4, 2.35], [30, 1.79]]

/** A museum wall: framed banners under spotlights, slid sideways by vertical scroll. */
export default function GalleryWall() {
  const section = useRef(null)
  const track = useRef(null)
  useEffect(() => {
    let raf = 0
    const paint = () => {
      raf = 0
      const s = section.current, t = track.current
      if (!s || !t) return
      const r = s.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)))
      const max = Math.max(0, t.scrollWidth - t.parentElement.clientWidth)
      t.style.transform = `translate3d(${(p * max).toFixed(1)}px,0,0)` // RTL: the wall moves right
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(paint) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); paint()
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section ref={section} className="relative h-[280svh]" aria-label="معرض أعمال وارف">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,#f7f0dc,#efe4c4)]">
        {/* wall texture + baseboard */}
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,rgb(9_56_46/0.025)_0_1px,transparent_1px_120px)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-[linear-gradient(180deg,#e2d3a8,#d6c491)] shadow-[0_-1px_0_rgb(9_56_46/0.15)]" aria-hidden="true" />

        <div className="container-w relative z-10 mb-6 flex items-end justify-between gap-4 pt-[var(--header-height)] sm:mb-10">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[13px] font-medium text-accent-text"><span className="h-px w-6 bg-accent" />المعرض</p>
            <h2 className="font-display text-[1.6rem] font-semibold text-primary sm:text-display-md">بنرات وتصاميم سوشال ميديا</h2>
          </div>
          <Link to="/work?tab=banners" className="group hidden h-10 items-center gap-2 text-sm font-medium text-primary sm:inline-flex"><span className="border-b border-accent pb-0.5">كل التصاميم ({WORK.length})</span><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></Link>
        </div>

        <div className="relative z-10 overflow-visible">
          <ul ref={track} className="flex w-max items-end gap-10 px-[8vw] will-change-transform sm:gap-16">
            {PIECES.map(([i, ar], k) => (
              <li key={k} className="relative shrink-0 pt-16">
                {/* spotlight */}
                <span className="pointer-events-none absolute -top-2 left-1/2 h-[calc(100%+40px)] w-[150%] -translate-x-1/2 bg-[radial-gradient(50%_70%_at_50%_0%,rgb(255_250_230/0.95),transparent_70%)]" aria-hidden="true" />
                <span className="absolute top-2 left-1/2 h-3 w-16 -translate-x-1/2 rounded-b-full bg-[linear-gradient(180deg,#2b2b2b,#555)] shadow-[0_6px_20px_rgb(255_240_200/0.9)]" aria-hidden="true" />
                <Link to="/work?tab=banners" className="group relative block">
                  <figure className="rounded-[3px] bg-[linear-gradient(135deg,#f3e3a1,#b99a3e_35%,#f1dd94_55%,#a8862f_80%,#e9d283)] p-[7px] shadow-[0_30px_50px_-20px_rgb(40_30_10/0.55),0_8px_14px_-6px_rgb(40_30_10/0.35)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2">
                    <div className="bg-[#fffdf6] p-[clamp(8px,1.4vw,16px)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">
                      <img src={lh3(WORK[i], 800)} alt={`من أعمال وارف ${k + 1}`} loading="lazy" decoding="async" className="block h-[clamp(150px,34svh,330px)] w-auto bg-sunken object-cover" style={{ aspectRatio: ar }} />
                    </div>
                  </figure>
                  <figcaption className="mx-auto mt-4 w-fit rounded-sm bg-[#fffdf6] px-3 py-1 text-[11px] text-muted-foreground shadow-hairline">من أعمال وارف · <span className="tabular">{String(k + 1).padStart(2, '0')}</span></figcaption>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/work?tab=banners" className="relative z-10 mx-auto mt-8 inline-flex h-10 items-center gap-2 text-sm font-medium text-primary sm:hidden"><span className="border-b border-accent pb-0.5">كل التصاميم</span><ArrowLeft className="size-4" /></Link>
      </div>
    </section>
  )
}
