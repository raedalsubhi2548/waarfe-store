import { useEffect, useRef } from 'react'
import Phone from '@/components/home/Phone.jsx'
import { STORE_PDFS } from '@/data/work.js'

// Seven phones on a ring, three real stores at different points of each page.
const [V, G, M] = STORE_PDFS.map((s) => s.id)
const SLOTS = [[V, 3], [G, 3], [M, 3], [V, 30], [G, 28], [M, 42], [V, 58]]
const N = SLOTS.length

/**
 * The showroom: delivered stores on a slowly turning 3D ring with a reflective floor.
 * Auto-rotates; drag or swipe to spin it. Pauses off-screen and for reduced motion.
 */
export default function Showroom3D() {
  const wrap = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const el = wrap.current, r = ring.current
    if (!el || !r) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const AUTO = reduce ? 0 : 0.09
    let angle = -8, vel = AUTO, drag = false, lastX = 0, raf = 0, visible = true
    const paint = () => { r.style.transform = `rotateX(-9deg) rotateY(${angle}deg)` }
    const loop = () => {
      if (!drag) { vel += (AUTO - vel) * 0.025; angle += vel }
      paint()
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const down = (e) => { drag = true; lastX = e.clientX; el.setPointerCapture?.(e.pointerId) }
    const move = (e) => { if (!drag) return; const d = e.clientX - lastX; lastX = e.clientX; angle += d * 0.28; vel = d * 0.28 }
    const up = () => { drag = false }
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop) })
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    io.observe(el); paint()
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) }
  }, [])

  return (
    <div ref={wrap} className="relative mx-auto h-[calc(var(--w)*3.25)] w-full cursor-grab touch-pan-y select-none [--w:clamp(108px,24vw,170px)] [perspective:1600px] [perspective-origin:50%_30%] [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] active:cursor-grabbing"
      role="img" aria-label="متاجر سلة صممتها وارف تدور في معرض ثلاثي الأبعاد">
      {/* stage floor: concentric gold rings seen in perspective */}
      <div className="pointer-events-none absolute inset-x-[-10%] top-[calc(var(--w)*2.7)] h-[calc(var(--w)*2.4)] [transform:rotateX(78deg)] [transform-origin:50%_0] bg-[repeating-radial-gradient(circle_at_50%_0,rgb(215_198_118/0.22)_0_1px,transparent_1px_34px)] [mask-image:radial-gradient(ellipse_at_50%_0,black_10%,transparent_65%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-[15%] top-[calc(var(--w)*2.45)] h-[calc(var(--w)*0.8)] bg-[radial-gradient(closest-side,rgb(215_198_118/0.35),transparent)]" aria-hidden="true" />

      <div ref={ring} className="absolute top-[calc(var(--w)*0.45)] left-1/2 h-[calc(var(--w)*2.17)] w-[var(--w)] [transform-style:preserve-3d]" style={{ marginLeft: 'calc(var(--w) / -2)' }}>
        {SLOTS.map(([id, at], i) => (
          <div key={i} className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `rotateY(${(360 / N) * i}deg) translateZ(calc(var(--w) * 2.05))` }}>
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Phone pdfId={id} at={at} drift={6} size={360} eager={i < 3} />
            </div>
            {/* back of the phone */}
            <div className="absolute inset-0 grid place-items-center rounded-[clamp(18px,13%,30px)] bg-gradient-to-br from-[#0f3a30] to-[#071d18] ring-1 ring-accent/25 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="absolute top-[5%] start-[8%] grid size-[22%] place-items-center rounded-[28%] bg-black/30 ring-1 ring-accent/30"><span className="size-[40%] rounded-full bg-black/60 ring-2 ring-accent/40" /></span>
              <span className="grid size-[46%] place-items-center rounded-full bg-background p-[9%] shadow-[0_0_40px_rgb(215_198_118/0.25)]"><img src="/logo.png" alt="" className="w-full" /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
