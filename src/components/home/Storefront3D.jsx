import { useEffect, useRef } from 'react'
import { Star, Check } from 'lucide-react'
import { pdfThumb, STORE_PDFS } from '@/data/work.js'

/**
 * A 3D storefront: three phones, each scrolling through a real store
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
      el.style.setProperty('--ry', `${-8 + cx * 12}deg`)
      el.style.setProperty('--rx', `${6 - cy * 7}deg`)
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

  const phones = [
    { pdf: STORE_PDFS[1], cls: 'start-[3%] top-[12%] w-[29%] [transform:translateZ(-40px)_rotateY(22deg)]', dur: '34s', dir: 'alternate' },
    { pdf: STORE_PDFS[2], cls: 'end-[3%] top-[12%] w-[29%] [transform:translateZ(-40px)_rotateY(-22deg)]', dur: '30s', dir: 'alternate-reverse' },
    { pdf: STORE_PDFS[0], cls: 'inset-x-0 mx-auto top-[2%] w-[36%] [transform:translateZ(70px)]', dur: '40s', dir: 'alternate' },
  ]
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-[600px] [perspective:1600px]" aria-label="متاجر صممتها وارف تعرض على جوالات" role="img">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(215_198_118/0.5),transparent)] blur-2xl" aria-hidden="true" />
      <div className="absolute inset-x-[16%] bottom-[2%] h-[9%] rounded-[50%] bg-primary/30 blur-2xl" aria-hidden="true" />

      <div ref={stage} className="absolute inset-0 [transform-style:preserve-3d] motion-safe:animate-[float_7s_ease-in-out_infinite]"
        style={{ '--rx': '6deg', '--ry': '-8deg', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}>
        {phones.map(({ pdf, cls, dur, dir }) => (
          <div key={pdf.id} className={`absolute ${cls}`}>
            <div className="rounded-[26px] bg-[#0b2a23] p-[5%] shadow-[0_40px_70px_-24px_rgb(9_56_46/0.75)] ring-1 ring-black/25">
              <div className="relative aspect-[9/19.5] overflow-hidden rounded-[20px] bg-surface [container-type:size]">
                <img src={pdfThumb(pdf.id, 500)} alt="" loading="eager" decoding="async" className="w-full motion-safe:animate-[screen-scroll_var(--d)_ease-in-out_infinite_var(--dir)]" style={{ '--d': dur, '--dir': dir }} />
                <span className="absolute top-[2.2%] left-1/2 h-[3%] w-[32%] -translate-x-1/2 rounded-full bg-[#0b2a23]" />
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(255_255_255/0.25),transparent_35%)]" />
              </div>
            </div>
            <p className="mt-3 text-center font-display text-xs font-bold text-primary/70">{pdf.name}</p>
          </div>
        ))}

        <div className="absolute start-[-1%] bottom-[14%] flex items-center gap-2 rounded-full bg-background/95 py-2 ps-2 pe-4 shadow-card ring-1 ring-border backdrop-blur [transform:translateZ(150px)]">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-accent"><Check className="size-4" strokeWidth={3} /></span>
          <span className="text-sm font-bold text-primary"><span className="tabular">+200</span> طلب منفّذ</span>
        </div>
        <div className="absolute end-[0%] bottom-[24%] flex items-center gap-2 rounded-full bg-primary py-2 ps-3 pe-4 text-on-inverse shadow-card [transform:translateZ(130px)]">
          <span className="flex gap-0.5 text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3.5" fill="currentColor" strokeWidth={0} />)}</span>
          <span className="tabular text-sm font-bold">5.0</span>
          <span className="text-xs opacity-80">في سلة</span>
        </div>
      </div>
    </div>
  )
}
