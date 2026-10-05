import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Quote, MessageCircle } from 'lucide-react'
import { ALL_REVIEWS } from '@/data/reviews.js'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'

const Stars = ({ className }) => <span className={cn('flex gap-0.5', className)} aria-label="5 من 5">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-4" fill="currentColor" strokeWidth={0} />)}</span>
const FILTERS = [['all', 'الكل'], ['long', 'تجارب مفصّلة']]

export default function Reviews() {
  const [f, setF] = useState('all')
  const list = useMemo(() => ALL_REVIEWS.filter((r) => f === 'all' || r.text.length > 110), [f])
  return (
    <div className="container-w py-10 sm:py-14">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="المسار"><Link to="/" className="hover:underline">الرئيسية</Link> / <span>آراء العملاء</span></nav>
      <header className="relative mb-10 overflow-hidden rounded-xl bg-inverse p-6 text-on-inverse sm:p-10">
        <span className="pointer-events-none absolute -top-20 -end-20 size-64 rounded-full border-[24px] border-accent/10" aria-hidden="true" />
        <Stars className="text-accent" />
        <h1 className="mt-3 font-display text-display-sm font-bold sm:text-display-md">آراء عملائنا</h1>
        <p className="mt-2 max-w-xl leading-8 text-on-inverse/80"><span className="tabular">{ALL_REVIEWS.length}</span> رأي مكتوب، منشورة كلها في متجرنا على سلة بتقييم <span className="tabular">5.0</span>.</p>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto [scrollbar-width:none]" role="tablist">
        {FILTERS.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={f === id} onClick={() => setF(id)}
            className={cn('h-10 shrink-0 rounded-full px-4 text-sm font-semibold ring-1 transition-colors', f === id ? 'bg-primary text-on-inverse ring-primary' : 'text-primary ring-border hover:ring-primary')}>{l}</button>
        ))}
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {list.map((r, i) => (
          <li key={r.name + i} className="mb-4 break-inside-avoid">
            <figure className="rounded-lg bg-surface p-5 shadow-hairline ring-1 ring-border">
              <div className="flex items-center justify-between"><Stars className="text-accent-text" /><Quote className="size-5 text-accent/60" /></div>
              <blockquote className="mt-3 whitespace-pre-line leading-8">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunken font-display font-bold text-primary">{r.name.charAt(0)}</span>
                <span><b className="block text-primary">{r.name}</b>{r.city && <span className="text-muted-foreground">{r.city}</span>}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-sunken p-6 text-center">
        <p className="font-semibold text-primary">ودك تكون التجربة الجاية؟</p>
        <Button asChild><Link to="/p/salla-store-design">صمّم متجري</Link></Button>
        <Button asChild variant="outline"><a href={waLink('السلام عليكم، شفت آراء عملائكم وأبي أبدأ')} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />واتساب</a></Button>
      </div>
    </div>
  )
}
