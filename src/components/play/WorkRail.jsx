import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Move } from 'lucide-react'
import { WORK } from '@/data/work.js'

const lh3 = (id, w) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
const PICKS = [8, 15, 2, 25, 32, 10, 21, 37, 4, 30, 12, 18, 1, 23, 40, 16]

/** Our work on a rail you can grab and throw; tap a piece to open it big. */
export default function WorkRail() {
  const rail = useRef(null)
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0, v: 0, t: 0 })
  const [open, setOpen] = useState(null)

  const down = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = rail.current
    drag.current = { on: true, x: e.clientX, left: r.scrollLeft, moved: 0, v: 0, t: performance.now() }
    r.style.scrollSnapType = 'none'
  }
  const move = (e) => {
    const d = drag.current; if (!d.on) return
    const dx = e.clientX - d.x
    const now = performance.now()
    d.v = (rail.current.scrollLeft - (d.left - dx)) / Math.max(1, now - d.t); d.t = now
    d.moved = Math.max(d.moved, Math.abs(dx))
    rail.current.scrollLeft = d.left - dx
  }
  const up = () => {
    const d = drag.current; if (!d.on) return
    d.on = false
    const r = rail.current
    r.scrollBy({ left: -d.v * 220, behavior: 'smooth' })
    setTimeout(() => { r.style.scrollSnapType = '' }, 450)
  }
  // tilt pieces slightly by their distance from the centre while the rail moves
  useEffect(() => {
    const r = rail.current; if (!r) return
    let raf = 0
    const tick = () => {
      raf = 0
      const mid = r.getBoundingClientRect().left + r.clientWidth / 2
      for (const el of r.children) {
        const b = el.getBoundingClientRect()
        const off = (b.left + b.width / 2 - mid) / r.clientWidth
        el.style.setProperty('--rot', `${(Math.max(-1, Math.min(1, off)) * -22).toFixed(2)}deg`)
        el.style.setProperty('--sc', (1 - Math.min(1, Math.abs(off)) * 0.12).toFixed(3))
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick(); r.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { r.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  useEffect(() => {
    if (open == null) return
    const k = (e) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowLeft') setOpen((x) => (x + 1) % PICKS.length); if (e.key === 'ArrowRight') setOpen((x) => (x - 1 + PICKS.length) % PICKS.length) }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open])

  return (
    <section className="relative py-16 sm:py-20" aria-labelledby="rail-title">
      <div className="container-w mb-6 flex flex-col items-center gap-1 text-center">
        <p className="text-[13.5px] font-medium text-primary/60">من مكتب وارف</p>
        <h2 id="rail-title" className="font-display text-[1.75rem] font-bold leading-[1.45] text-primary sm:text-display-md">بنرات وتصاميم سوشال ميديا</h2>
        <p className="mt-1 inline-flex items-center gap-2 text-[14px] text-muted-foreground"><Move className="size-4" />امسك المعرض واسحبه، واضغط على أي تصميم يكبر</p>
      </div>

      <ul ref={rail} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        className="flex cursor-grab snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[max(16px,calc((100vw-var(--container))/2))] py-10 [scrollbar-width:none] active:cursor-grabbing [perspective:1400px]">
        {PICKS.map((n, k) => (
          <li key={n} className="shrink-0 snap-center transition-transform duration-200 ease-out [transform:rotateY(var(--rot,0deg))_scale(var(--sc,1))]">
            <button type="button" onClick={() => drag.current.moved < 6 && setOpen(k)} aria-label={`كبّر تصميم ${k + 1}`}
              className="group block overflow-hidden rounded-[20px] bg-[#fffdf7] p-1.5 shadow-[0_1px_2px_rgb(9_56_46/0.06),0_30px_50px_-30px_rgb(9_56_46/0.7)] ring-1 ring-primary/[0.06]">
              <img src={lh3(WORK[n], 700)} alt={`من أعمال وارف ${k + 1}`} loading="lazy" decoding="async" draggable="false"
                className="block h-[220px] w-auto min-w-[200px] rounded-[15px] bg-sunken object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-[300px] sm:min-w-[260px]" />
            </button>
          </li>
        ))}
      </ul>

      <div className="text-center">
        <Link to="/work?tab=banners" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-[14px] font-medium text-on-inverse shadow-[0_14px_28px_-14px_rgb(9_56_46/0.8)] transition-colors hover:bg-primary-hover">
          شوف كل التصاميم ({WORK.length})<ArrowLeft className="size-4" />
        </Link>
      </div>

      {open != null && (
        <div role="dialog" aria-modal="true" aria-label="معاينة التصميم" className="fixed inset-0 z-[80] grid place-items-center bg-[#041d17]/90 p-4 backdrop-blur-sm motion-safe:animate-[fade-in_200ms_ease-out]" onClick={() => setOpen(null)}>
          <img src={lh3(WORK[PICKS[open]], 1600)} alt={`من أعمال وارف ${open + 1}`} className="max-h-[82vh] max-w-full rounded-2xl shadow-2xl motion-safe:animate-[pop-in_400ms_cubic-bezier(.34,1.56,.64,1)]" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={() => setOpen(null)} aria-label="إغلاق" className="absolute top-5 end-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen((x) => (x - 1 + PICKS.length) % PICKS.length) }} aria-label="السابق" className="absolute top-1/2 right-4 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen((x) => (x + 1) % PICKS.length) }} aria-label="التالي" className="absolute top-1/2 left-4 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft /></button>
        </div>
      )}
    </section>
  )
}
