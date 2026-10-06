import { Link } from 'react-router-dom'
import { Heart, Plus, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { money, effectivePrice } from '@/lib/format.js'

/**
 * Product as a cover on a shelf (same language as the e-book shelf we built for Dr. Alaa):
 * the cover sits on a tilted green bookcloth sheet, lifts on hover; name, price and «التفاصيل» below.
 */
export default function ServiceTicket({ p, className, rank }) {
  const { addToCart, toggleWish, wishlist } = useApp()
  const wished = wishlist.includes(p.id)
  const sale = p.salePrice && p.salePrice < p.price
  return (
    <article className={cn('group flex flex-col gap-3.5', className)}>
      <div className="relative">
        <div className="cloth absolute inset-x-2 top-3 -bottom-2 -rotate-2 rounded-[14px] opacity-80 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-[4deg]" aria-hidden="true" />
        <Link to={`/p/${p.id}`} className="relative block overflow-hidden rounded-[14px] bg-sunken shadow-[0_1px_2px_rgb(9_56_46/0.06),0_14px_30px_-10px_rgb(9_56_46/0.28)] ring-1 ring-black/5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1.5">
          <img src={p.image} alt="" loading="lazy" decoding="async" width="500" height="500" className="aspect-square w-full object-cover" />
          <span className="pointer-events-none absolute inset-y-0 start-0 w-3 bg-[linear-gradient(90deg,rgb(0_0_0/0.10),transparent)] rtl:bg-[linear-gradient(270deg,rgb(0_0_0/0.10),transparent)]" aria-hidden="true" />
          {(rank || p.badge || sale) && (
            <span className="absolute top-3 start-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-accent backdrop-blur">
              {sale ? 'خصم' : rank === 1 ? 'الأكثر طلباً' : p.badge}
            </span>
          )}
        </Link>
        <button type="button" onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
          className={cn('absolute top-3 end-3 grid size-9 place-items-center rounded-full bg-background/90 shadow-hairline backdrop-blur transition-[color,translate] duration-500 group-hover:-translate-y-1.5', wished ? 'text-danger' : 'text-primary hover:text-danger')}>
          <Heart className="size-4" fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-0.5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-7 text-foreground transition-colors group-hover:text-primary sm:text-base">
          <Link to={`/p/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="tabular leading-tight">
            <span className="font-semibold text-primary">{money(effectivePrice(p))}</span>
            {sale && <s className="ms-1.5 text-xs text-muted-foreground">{money(p.price)}</s>}
            {p.perUnit && <span className="block text-[11px] text-muted-foreground">{p.perUnit}</span>}
          </p>
          <div className="flex items-center gap-1">
            <Link to={`/p/${p.id}`} className="hidden items-center gap-1 text-[13px] font-medium text-accent-text sm:inline-flex">التفاصيل<ArrowLeft className="size-3.5" /></Link>
            <button type="button" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`} className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-accent transition-transform duration-200 active:scale-95 sm:ms-2">
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
