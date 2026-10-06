import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import Icon from '@/components/Icon.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'

const ART = {
  'design-services': 'waarfe-cat-design.webp',
  'marketing-services': 'waarfe-cat-marketing.webp',
  subscriptions: 'waarfe-cat-subscriptions.webp',
  'government-services': 'waarfe-cat-government.webp',
  'digital-products': 'waarfe-cat-digital.webp',
}

/** Pick a door (category) and its shelf deals itself out below — the whole store in one place. */
export default function CategoryExplorer() {
  const { categories, products, catalogReady } = useApp()
  const [active, setActive] = useState('design-services')
  const cat = categories.find((c) => c.id === active) || categories[0]
  const items = cat ? products.filter((p) => p.categoryId === cat.id).slice(0, 8) : []
  return (
    <section className="relative py-16 sm:py-20" aria-labelledby="explore-title">
      <div className="container-w text-center">
        <p className="text-[13.5px] font-medium text-primary/60">تجوّل في المتجر</p>
        <h2 id="explore-title" className="mt-1 font-display text-[1.75rem] font-bold leading-[1.45] text-primary sm:text-display-md">اختر باب وادخل</h2>
      </div>

      <div role="tablist" aria-label="أقسام المتجر" className="container-w mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] sm:mx-auto sm:grid sm:max-w-[1000px] sm:grid-cols-5 sm:gap-5 sm:overflow-visible">
        {categories.map((c) => {
          const on = c.id === cat?.id
          const n = products.filter((p) => p.categoryId === c.id).length
          return (
            <button key={c.id} role="tab" aria-selected={on} onClick={() => setActive(c.id)}
              className="group w-[124px] shrink-0 snap-start text-center sm:w-auto">
              <span className={cn('relative block rounded-t-[999px] rounded-b-[18px] bg-[#fffdf7] p-[5px] ring-1 transition-[translate,box-shadow,ring-color] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]',
                on ? '-translate-y-2 shadow-[0_30px_44px_-22px_rgb(9_56_46/0.8)] ring-primary/60' : 'shadow-[0_18px_30px_-22px_rgb(9_56_46/0.6)] ring-primary/[0.07] group-hover:-translate-y-1')}>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[14px] bg-[#062a22]">
                  {ART[c.id]
                    ? <img src={`/brand/ai/${ART[c.id]}`} alt="" loading="lazy" decoding="async" className={cn('size-full object-cover transition-[scale,filter] duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)]', on ? 'scale-[1.08]' : 'saturate-[.75] group-hover:scale-105 group-hover:saturate-100')} />
                    : <span className="grid size-full place-items-center text-on-inverse"><Icon name={c.icon} size={28} /></span>}
                  <span className={cn('absolute inset-0 bg-[#062a22] transition-opacity duration-500', on ? 'opacity-0' : 'opacity-20')} />
                </span>
              </span>
              <span className={cn('mt-3 block text-[15px] font-semibold transition-colors', on ? 'text-primary' : 'text-primary/70')}>{c.name}</span>
              <span className="tabular text-[12.5px] text-muted-foreground">{n} خدمات</span>
              <span className={cn('mx-auto mt-1.5 block h-1 rounded-full bg-primary transition-[width,opacity] duration-500', on ? 'w-8 opacity-100' : 'w-0 opacity-0')} />
            </button>
          )
        })}
      </div>

      <div className="container-w mt-8" role="tabpanel" aria-label={cat?.name}>
        {catalogReady && (
          <ul key={cat?.id} className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {items.map((p, i) => (
              <li key={p.id} className="motion-safe:animate-[deal-in_700ms_cubic-bezier(.34,1.56,.64,1)_both]" style={{ animationDelay: `${i * 80}ms` }}>
                <ServiceTicket p={p} className="h-full" />
              </li>
            ))}
          </ul>
        )}
        {cat && (
          <div className="mt-10 text-center">
            <Link to={`/c/${cat.id}`} className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-[14px] font-medium text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary hover:text-on-inverse">
              كل {cat.name}<ArrowLeft className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
