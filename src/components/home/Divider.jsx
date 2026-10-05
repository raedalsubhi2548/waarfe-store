import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Waarfe section divider. «وارف» = lush, spreading shade: a sprig sprouts from the
 * centre and its gold line grows outward with small leaf buds along the way.
 * Draws once when scrolled into view.
 */
export default function Divider({ className, tone = 'light' }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setOn(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const gold = 'var(--accent)'
  const green = tone === 'dark' ? 'var(--accent)' : 'var(--primary)'
  const leaf = 'M0 0 C -5 -7 -5 -15 0 -22 C 5 -15 5 -7 0 0 Z'
  const bud = 'M0 0 C -2.4 -3.4 -2.4 -7 0 -10 C 2.4 -7 2.4 -3.4 0 0 Z'
  return (
    <div ref={ref} className={cn('container-w', className)} role="separator" aria-hidden="true" data-on={on || undefined}>
      <svg viewBox="0 0 800 56" className="group/div mx-auto block h-12 w-full max-w-3xl overflow-visible sm:h-14" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="dv-r" x1="0" x2="1"><stop offset="0" stopColor={gold} /><stop offset="1" stopColor={gold} stopOpacity="0" /></linearGradient>
          <linearGradient id="dv-l" x1="1" x2="0"><stop offset="0" stopColor={gold} /><stop offset="1" stopColor={gold} stopOpacity="0" /></linearGradient>
        </defs>
        {/* lines grow from the centre outward */}
        <path d="M368 40 H16" stroke="url(#dv-l)" strokeWidth="1.5" fill="none" pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] delay-300 duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-data-[on]/div:[stroke-dashoffset:0] [[data-on]_&]:[stroke-dashoffset:0]" />
        <path d="M432 40 H784" stroke="url(#dv-r)" strokeWidth="1.5" fill="none" pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] delay-300 duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] [[data-on]_&]:[stroke-dashoffset:0]" />
        {/* buds along the branch */}
        {[300, 230, 160].map((x, k) => [x, 800 - x].map((xx, s) => (
          <path key={`${k}${s}`} d={bud} fill={gold} transform={`translate(${xx} 40) rotate(${s ? 50 : -50})`}
            className="origin-[0_0] scale-0 opacity-0 transition-[scale,opacity] duration-500 [transform-box:fill-box] [[data-on]_&]:scale-100 [[data-on]_&]:opacity-80"
            style={{ transitionDelay: `${700 + k * 220}ms`, transformOrigin: '50% 100%' }} />
        )))}
        {/* the sprig */}
        <g transform="translate(400 44)">
          <path d={leaf} fill="none" stroke={gold} strokeWidth="1.6" transform="rotate(-52)" className="origin-bottom scale-0 transition-[scale] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] [transform-box:fill-box] [[data-on]_&]:scale-100" style={{ transitionDelay: '150ms' }} />
          <path d={leaf} fill="none" stroke={gold} strokeWidth="1.6" transform="rotate(52)" className="origin-bottom scale-0 transition-[scale] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] [transform-box:fill-box] [[data-on]_&]:scale-100" style={{ transitionDelay: '150ms' }} />
          <path d={leaf} fill={green} transform="scale(1.15)" className="origin-bottom scale-0 transition-[scale] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] [transform-box:fill-box] [[data-on]_&]:scale-100" />
          <circle r="2.6" cy="-4" cx="-30" fill={gold} className="opacity-0 transition-opacity delay-500 duration-500 [[data-on]_&]:opacity-100" />
          <circle r="2.6" cy="-4" cx="30" fill={gold} className="opacity-0 transition-opacity delay-500 duration-500 [[data-on]_&]:opacity-100" />
        </g>
      </svg>
    </div>
  )
}
