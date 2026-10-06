import { useEffect, useRef } from 'react'

/** A soft green light that lazily follows the mouse across the page (desktop only, off for reduced motion). */
export default function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08
      el.style.transform = `translate(${x - 300}px, ${y - 300}px)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0
    }
    const mv = (e) => { tx = e.clientX; ty = e.clientY; el.style.opacity = '1'; if (!raf) raf = requestAnimationFrame(loop) }
    window.addEventListener('pointermove', mv, { passive: true })
    return () => { window.removeEventListener('pointermove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <span ref={ref} className="pointer-events-none fixed top-0 left-0 z-0 size-[600px] rounded-full bg-[radial-gradient(closest-side,rgb(47_138_109/0.10),transparent)] opacity-0 transition-opacity duration-700" aria-hidden="true" />
}
