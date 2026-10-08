import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Quote, MessageCircle } from 'lucide-react'
import { ALL_REVIEWS } from '@/data/reviews.js'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import StarsSvg from '@/components/brand/Stars.jsx'
const Stars = (p) => <StarsSvg size={16} {...p} />
import PageIntro from '@/components/site/PageIntro.jsx'

const FILTERS = [['all', 'الكل'], ['long', 'تجارب مفصّلة']]

export default function Reviews() {
  const [f, setF] = useState('all')
  const list = useMemo(() => ALL_REVIEWS.filter((r) => f === 'all' || r.text.length > 110), [f])
  return (
    <div className="container-w py-10 sm:py-14">
      <PageIntro crumb="آراء العملاء" title="آراء عملائنا" className="-mt-10 sm:-mt-14">
        <p className="mx-auto mt-4 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[15px] text-primary shadow-[0_12px_28px_-18px_rgb(27_43_68/0.6)] ring-1 ring-primary/10">
          <Stars className="text-primary" /><b className="tabular">5.0</b><span className="h-4 w-px bg-primary/20" /><span><b className="tabular">{ALL_REVIEWS.length}</b> رأي مكتوب من عملائنا</span>
        </p>
      </PageIntro>

      <div className="mb-6 flex justify-center gap-2 overflow-x-auto [scrollbar-width:none]" role="tablist">
        {FILTERS.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={f === id} onClick={() => setF(id)}
            className={cn('h-10 shrink-0 rounded-full px-4 text-sm font-semibold ring-1 transition-colors', f === id ? 'bg-primary text-on-inverse ring-primary' : 'text-primary ring-border hover:ring-primary')}>{l}</button>
        ))}
      </div>

      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {list.map((r, i) => (
          <li key={r.name + i} className="mb-3 break-inside-avoid sm:mb-4">
            <figure className="rounded-lg bg-surface p-3.5 shadow-hairline ring-1 ring-border sm:p-5">
              <div className="flex items-center justify-between"><Stars className="text-accent-text [&_svg]:size-3 sm:[&_svg]:size-4" /><Quote className="size-4 text-accent/60 sm:size-5" /></div>
              <blockquote className="mt-3 whitespace-pre-line text-sm leading-7 sm:text-base sm:leading-8">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3 text-xs sm:gap-3 sm:pt-4 sm:text-sm">
                <span className="grid size-8 shrink-0 sm:size-9 place-items-center rounded-full bg-sunken font-display font-semibold text-primary">{r.name.charAt(0)}</span>
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
