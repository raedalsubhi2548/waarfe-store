import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView.js'

// Hand-drawn gold line illustrations (original artwork) that draw themselves into view.
const ART = {
  store: [
    'M60 22 C55 14 57 7 60 2 C63 7 65 14 60 22',
    'M20 42 L29 24 H91 L100 42',
    'M20 42 q10 11 20 0 q10 11 20 0 q10 11 20 0 q10 11 20 0',
    'M26 48 V100 H94 V48',
    'M50 100 V74 Q60 66 70 74 V100',
    'M32 58 H46 V70 H32 Z',
    'M74 58 H88 V70 H74 Z',
    'M10 100 H110',
  ],
  landing: [
    'M18 24 H102 Q108 24 108 30 V86 Q108 92 102 92 H18 Q12 92 12 86 V30 Q12 24 18 24 Z',
    'M12 36 H108',
    'M20 30 h0.1 M27 30 h0.1 M34 30 h0.1',
    'M24 48 H68',
    'M24 57 H56',
    'M24 68 H50 Q54 68 54 72 Q54 76 50 76 H24 Q20 76 20 72 Q20 68 24 68',
    'M62 104 C78 100 88 86 96 62',
    'M90 64 L96 61 L98 67',
  ],
  analytics: [
    'M14 100 H106',
    'M26 100 V78', 'M42 100 V66', 'M58 100 V72', 'M74 100 V54',
    'M22 68 L40 54 L56 60 L76 36 L96 24',
    'M89 23 L96 24 L95 31',
    'M88 78 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0',
    'M97 87 L106 96',
  ],
  shield: [
    'M60 14 L96 28 V58 C96 80 80 96 60 106 C40 96 24 80 24 58 V28 Z',
    'M44 60 L56 72 L78 48',
  ],
  chat: [
    'M20 30 Q20 22 28 22 H92 Q100 22 100 30 V70 Q100 78 92 78 H52 L34 94 V78 H28 Q20 78 20 70 Z',
    'M38 44 H82', 'M38 56 H70',
  ],
  clock: [
    'M60 60 m-42 0 a42 42 0 1 0 84 0 a42 42 0 1 0 -84 0',
    'M60 34 V60 L76 70',
  ],
}

export default function LineArt({ name, className, delay = 0, tone = 'gold' }) {
  const [ref, on] = useInView()
  const paths = ART[name] || []
  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" className={cn('overflow-visible', className)} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength="1" stroke={tone === 'gold' ? 'var(--accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1) ${delay + i * 0.12}s` }} />
      ))}
    </svg>
  )
}
