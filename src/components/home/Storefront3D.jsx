import { useEffect, useRef } from 'react'
import { Star, Check } from 'lucide-react'
import { pdfThumb, STORE_PDFS } from '@/data/work.js'

/**
 * A 3D storefront: a laptop and a phone, each scrolling through a real store
 * Waarfe delivered (the PDF case files). Tilts toward the pointer / device.
 * Pure CSS 3D, no WebGL, so it stays light on phones.
 */
export default function Storefront3D() {
  const stage = useRef(null)
  useEffect(() => {
    const el = stage.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08
      el.style.setProperty('--ry', `${-16 + cx * 10}deg`)
      el.style.setProperty('--rx', `${8 - cy * 7}deg`)
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)))
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)))
      kick()
    }
    const onTilt = (e) => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); kick() }
    const onLeave = () => { tx = 0; ty = 0; kick() }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('deviceorientation', onTilt); document.removeEventListener('pointerleave', onLeave) }
  }, [])

  const [velvet, glisten] = STORE_PDFS
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-[620px] [perspective:1800px]" aria-label="متاجر صممتها وارف" role="img">
      {/* soft gold halo + floor shadow */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(215_198_118/0.45),transparent)] blur-2xl" aria-hidden="true" />
      <div className="absolute inset-x-[14%] bottom-[6%] h-[10%] rounded-[50%] bg-primary/25 blur-2xl" aria-hidden="true" />

      <div ref={stage} className="absolute inset-0 [transform-style:preserve-3d] motion-safe:animate-[float_7s_ease-in-out_infinite]"
        style={{ '--rx': '8deg', '--ry': '-16deg', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}>

        {/* Laptop */}
        <div className="absolute start-[4%] top-[8%] w-[80%] [transform-style:preserve-3d]">
          <div className="rounded-[14px] bg-[#0b2a23] p-[2.2%] shadow-[0_40px_80px_-30px_rgb(9_56_46/0.7)] ring-1 ring-black/20">
            <div className="screen relative aspect-[16/10] overflow-hidden rounded-[6px] bg-surface [container-type:size]">
              <img src={pdfThumb(velvet.id, 900)} alt="" loading="eager" decoding="async" className="w-full motion-safe:animate-[screen-scroll_38s_ease-in-out_infinite_alternate]" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.22),transparent_38%)]" />
            </div>
          </div>
          {/* hinge + deck */}
          <div className="-mx-[2%] h-[10px] rounded-b-[14px] bg-gradient-to-b from-[#d9d4c4] to-[#a8a294] shadow-[0_18px_30px_-12px_rgb(9_56_46/0.6)]" />
        </div>

        {/* Phone */}
        <div className="absolute end-[3%] bottom-[6%] w-[27%] [transform:translateZ(90px)]">
          <div className="rounded-[22px] bg-[#0b2a23] p-[5%] shadow-[0_30px_60px_-20px_rgb(9_56_46/0.75)] ring-1 ring-black/20">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[16px] bg-surface [container-type:size]">
              <img src={pdfThumb(glisten.id, 500)} alt="" loading="eager" decoding="async" className="w-full motion-safe:animate-[screen-scroll_30s_ease-in-out_infinite_alternate-reverse]" />
              <span className="absolute top-[2.5%] left-1/2 h-[3%] w-[34%] -translate-x-1/2 rounded-full bg-[#0b2a23]" />
            </div>
          </div>
        </div>

        {/* Floating chips (true facts only) */}
        <div className="absolute start-[-2%] bottom-[18%] flex items-center gap-2 rounded-full bg-background/95 py-2 ps-2 pe-4 shadow-card ring-1 ring-border backdrop-blur [transform:translateZ(140px)]">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-accent"><Check className="size-4" strokeWidth={3} /></span>
          <span className="text-sm font-bold text-primary"><span className="tabular">+200</span> طلب منفّذ</span>
        </div>
        <div className="absolute end-[10%] top-[2%] flex items-center gap-2 rounded-full bg-primary py-2 ps-3 pe-4 text-on-inverse shadow-card [transform:translateZ(120px)]">
          <span className="flex gap-0.5 text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>
          <span className="tabular text-sm font-bold">5.0</span>
          <span className="text-xs opacity-80">في سلة</span>
        </div>
      </div>
    </div>
  )
}
