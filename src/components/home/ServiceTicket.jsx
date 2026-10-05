import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { money, effectivePrice } from '@/lib/format.js'
import { Badge } from '@/components/ui/badge'

/** A service as a ticket stub: image, perforation, name, price, add. */
export default function ServiceTicket({ p, className, rank }) {
  const { addToCart, toggleWish, wishlist } = useApp()
  const wished = wishlist.includes(p.id)
  const sale = p.salePrice && p.salePrice < p.price
  return (
    <article className={cn('group relative flex flex-col rounded-[var(--ticket-radius)] bg-surface shadow-hairline ring-1 ring-border transition-shadow duration-300 hover:shadow-card', className)}>
      <Link to={`/p/${p.id}`} className="relative block overflow-hidden rounded-t-[var(--ticket-radius)] bg-sunken">
        <img src={p.image} alt="" loading="lazy" decoding="async" width="500" height="500" className="aspect-square w-full object-cover transition-transform duration-700 ease-emphasized group-hover:scale-[1.03]" />
        {rank ? (
          <span className="absolute top-3 start-3 flex items-center gap-1 rounded-full bg-primary py-1 ps-1 pe-2.5 text-xs font-bold text-on-inverse shadow-hairline">
            <span className="tabular grid size-5 place-items-center rounded-full bg-accent text-[11px] text-accent-foreground">{rank}</span>
            {rank === 1 ? 'الأكثر طلباً' : 'مطلوب'}
          </span>
        ) : p.badge && <Badge variant="green" className="absolute top-3 start-3">{p.badge}</Badge>}
      </Link>
      <button
        type="button"
        onClick={() => toggleWish(p.id)}
        aria-pressed={wished}
        aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
        className={cn('absolute top-3 end-3 grid size-10 place-items-center rounded-full bg-surface/90 backdrop-blur transition-colors', wished ? 'text-danger' : 'text-primary hover:text-danger')}
      >
        <Heart className="size-[18px]" fill={wished ? 'currentColor' : 'none'} />
      </button>

      <div className="relative h-px" aria-hidden="true">
        <span className="absolute -start-2.5 -top-2.5 size-5 rounded-full bg-[var(--notch,var(--background))]" />
        <span className="absolute -end-2.5 -top-2.5 size-5 rounded-full bg-[var(--notch,var(--background))]" />
        <span className="absolute inset-x-4 top-0 border-t-2 border-dashed border-border-strong" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-[15px] font-semibold leading-7 text-foreground">
          <Link to={`/p/${p.id}`} className="hover:text-primary hover:underline hover:underline-offset-4">{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="tabular leading-tight">
            <span className="font-display text-lg font-bold text-primary">{money(effectivePrice(p))}</span>
            {sale && <s className="ms-2 text-xs text-muted-foreground">{money(p.price)}</s>}
            {p.perUnit && <span className="block text-xs text-muted-foreground">{p.perUnit}</span>}
          </p>
          <button
            type="button"
            onClick={() => addToCart(p.id)}
            aria-label={`أضف ${p.name} للسلة`}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-accent transition-[background-color,transform] duration-200 hover:bg-primary-hover active:scale-95"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </article>
  )
}
