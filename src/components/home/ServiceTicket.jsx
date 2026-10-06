import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { money, effectivePrice } from '@/lib/format.js'

/** A small, soft product card: cream paper, hairline gold edge, gentle lift on hover. */
export default function ServiceTicket({ p, className }) {
  const { addToCart, toggleWish, wishlist } = useApp()
  const wished = wishlist.includes(p.id)
  const sale = p.salePrice && p.salePrice < p.price
  return (
    <article className={cn('group relative flex h-full flex-col rounded-[20px] bg-surface p-2 shadow-[0_1px_2px_rgb(9_56_46/0.06),0_14px_30px_-20px_rgb(9_56_46/0.45)] ring-1 ring-accent/30 transition-[translate,box-shadow,ring-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(9_56_46/0.06),0_26px_44px_-22px_rgb(9_56_46/0.5)] hover:ring-accent/70', className)}>
      <Link to={`/p/${p.id}`} className="relative block overflow-hidden rounded-[14px] bg-sunken">
        <img src={p.image} alt="" loading="lazy" decoding="async" width="500" height="500"
          className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]" />
      </Link>
      <button type="button" onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
        className={cn('absolute top-4 end-4 z-10 grid size-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors', wished ? 'text-danger' : 'text-primary/70 hover:text-primary')}>
        <Heart className="size-[15px]" fill={wished ? 'currentColor' : 'none'} />
      </button>
      {(p.badge || sale) && (
        <span className="absolute top-4 start-4 z-10 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium leading-none text-accent">{sale ? 'خصم' : p.badge}</span>
      )}
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <h3 className="line-clamp-2 min-h-[2.9rem] text-[14px] font-semibold leading-[1.45rem] text-primary">
          <Link to={`/p/${p.id}`} className="after:absolute after:inset-0">{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="tabular leading-tight">
            <span className="text-[16px] font-bold text-accent-text">{money(effectivePrice(p))}</span>
            {sale && <s className="ms-1.5 text-xs text-muted-foreground">{money(p.price)}</s>}
            {p.perUnit && <span className="block text-[11px] text-muted-foreground">{p.perUnit}</span>}
          </p>
          <button type="button" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}
            className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-primary text-accent shadow-[0_8px_16px_-8px_rgb(9_56_46/0.7)] transition-[background-color,scale] duration-300 hover:scale-105 hover:bg-primary-hover active:scale-95">
            <Plus className="size-[18px]" />
          </button>
        </div>
      </div>
    </article>
  )
}
