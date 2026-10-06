import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { WORK } from '@/data/work.js'

const lh3 = (id, w) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
// [index in WORK, aspect ratio]
const PIECES = [[8, 1.79], [15, 1], [2, 2.35], [25, 1.79], [32, 1], [10, 2.35], [21, 1.79], [37, 1], [4, 2.35], [30, 1.79]]

/** A gallery wall: framed banners under soft spotlights. Swipe on phones, arrows on desktop. */
export default function GalleryWall() {
  const row = useRef(null)
  const nudge = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f0dc,#efe4c4)] py-14 sm:py-20" aria-label="معرض أعمال وارف">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,#e2d3a8,#d6c491)] shadow-[0_-1px_0_rgb(9_56_46/0.12)]" aria-hidden="true" />
      <div className="container-w relative mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[13px] font-medium text-accent-text"><span className="h-px w-6 bg-accent" />المعرض</p>
          <h2 className="font-display text-[1.6rem] font-semibold text-primary sm:text-display-md">بنرات وتصاميم سوشال ميديا</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => nudge(1)} className="grid size-11 place-items-center rounded-full bg-white/70 text-primary ring-1 ring-accent/40 hover:bg-white" aria-label="السابق"><ChevronRight className="size-5" /></button>
          <button onClick={() => nudge(-1)} className="grid size-11 place-items-center rounded-full bg-white/70 text-primary ring-1 ring-accent/40 hover:bg-white" aria-label="التالي"><ChevronLeft className="size-5" /></button>
        </div>
      </div>

      <ul ref={row} className="relative flex snap-x snap-mandatory items-end gap-8 overflow-x-auto px-[max(16px,calc((100vw-var(--container))/2))] pb-6 [scrollbar-width:none] sm:gap-12">
        {PIECES.map(([i, ar], k) => (
          <li key={k} className="relative shrink-0 snap-center pt-14">
            <span className="pointer-events-none absolute -top-2 left-1/2 h-[calc(100%+30px)] w-[150%] -translate-x-1/2 bg-[radial-gradient(50%_70%_at_50%_0%,rgb(255_250_230/0.95),transparent_70%)]" aria-hidden="true" />
            <span className="absolute top-2 left-1/2 h-3 w-14 -translate-x-1/2 rounded-b-full bg-[linear-gradient(180deg,#2b2b2b,#555)] shadow-[0_6px_20px_rgb(255_240_200/0.9)]" aria-hidden="true" />
            <Link to="/work?tab=banners" className="group relative block">
              <figure className="rounded-[3px] bg-[linear-gradient(135deg,#f3e3a1,#b99a3e_35%,#f1dd94_55%,#a8862f_80%,#e9d283)] p-[6px] shadow-[0_26px_44px_-20px_rgb(40_30_10/0.5),0_8px_14px_-6px_rgb(40_30_10/0.3)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1.5">
                <div className="bg-[#fffdf6] p-[clamp(8px,1.2vw,14px)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">
                  <img src={lh3(WORK[i], 700)} alt={`من أعمال وارف ${k + 1}`} loading="lazy" decoding="async" className="block h-[clamp(150px,30vw,280px)] w-auto bg-sunken object-cover" style={{ aspectRatio: ar }} />
                </div>
              </figure>
            </Link>
          </li>
        ))}
      </ul>
      <div className="container-w relative mt-6 text-center">
        <Link to="/work?tab=banners" className="group inline-flex h-10 items-center gap-2 text-sm font-medium text-primary"><span className="border-b border-accent pb-0.5">كل التصاميم ({WORK.length})</span><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></Link>
      </div>
    </section>
  )
}
