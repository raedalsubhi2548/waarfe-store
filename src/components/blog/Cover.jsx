// An article's cover, drawn in code: the store's navy, a soft light, and the category's line drawing.
import LineArt from '@/components/home/LineArt.jsx'
import { BLOG_CATEGORIES } from '@/data/blog/index.js'
import { cn } from '@/lib/utils'

const GLOW = {
  design: 'radial-gradient(70% 90% at 85% 10%, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)',
  marketing: 'radial-gradient(70% 90% at 15% 15%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)',
  legal: 'radial-gradient(80% 90% at 50% 0%, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%)',
}

export default function Cover({ post, big, className }) {
  const cat = BLOG_CATEGORIES[post.category]
  return (
    <div className={cn('relative isolate overflow-hidden bg-[linear-gradient(150deg,var(--p-green-900),color-mix(in_srgb,var(--p-green-900)_78%,black))]', className)}>
      <span className="absolute inset-0 -z-10" style={{ background: GLOW[post.category] }} aria-hidden="true" />
      <span className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(var(--accent)_1px,transparent_1px),linear-gradient(90deg,var(--accent)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
      <LineArt name={cat?.icon} className={cn('absolute', big ? 'bottom-6 left-6 size-36 sm:size-44' : 'bottom-4 left-4 size-20 sm:size-24')} />
      <span className={cn('absolute top-4 start-4 rounded-full bg-white/10 px-3 py-1 font-semibold text-white/85 backdrop-blur', big ? 'text-[13px]' : 'text-[11.5px]')}>{cat?.name}</span>
    </div>
  )
}
