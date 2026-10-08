import { cn } from '@/lib/utils'

// five gold stars as one small SVG (one element instead of five icons: lighter pages, faster hydration)
const D = [0, 1, 2, 3, 4].map((i) => `M${12 + i * 26} 2l3.09 6.26 6.91 1.01-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-1.01z`).join('')

export default function Stars({ size = 14, className }) {
  return (
    <span className={cn('flex', className)} role="img" aria-label="5 من 5">
      <svg width={(size * 128) / 24} height={size} viewBox="0 0 128 24" fill="#f5b301" aria-hidden="true"><path d={D} /></svg>
    </span>
  )
}
