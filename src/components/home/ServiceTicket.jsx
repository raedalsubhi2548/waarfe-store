import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { money, effectivePrice } from '@/lib/format.js'

/** Slim product card: framed cover melting into the card, clear soft shadow, gold hairline. */
export default function ServiceTicket({ p, className }) {
  const { addToCart, toggleWish, wishlist } = useApp()
  const wished = wishlist.includes(p.id)
  const sale = p.salePrice && p.salePrice < p.price
  return (
    <article className={cn('group relative flex flex-col rounded-[22px] bg-[linear-gradient(180deg,#ffffff,#fbf6e7)] p-2 shadow-[0_2px_6px_rgb(9_56_46/0.07),0_26px_46px_-20px_rgb(9_56_46/0.5)] ring-1 ring-accent/25 transition-[translate,box-shadow,ring-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[0_4px_10px_rgb(9_56_46/0.08),0_40px_60px_-24px_rgb(9_56_46/0.6)] hover:ring-accent/70 sm:p-2.5', className)}>
      <div className="relative">
        <Link to={`/p/${p.id}`} className="block overflow-hidden rounded-[16px] bg-sunken">
          <img src={p.image} alt="" loading="lazy" decoding="async" width="500" height="500"
            className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]" />
        </Link>
        {(p.badge || sale) && (
          <span className="absolute top-2.5 start-2.5 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10.5px] font-semibold text-accent backdrop-blur">{sale ? 'خصم' : p.badge}</span>
        )}
        <button type="button" onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
          className={cn('absolute top-2.5 end-2.5 grid size-8 place-items-center rounded-full bg-white/90 shadow-hairline backdrop-blur transition-colors', wished ? 'text-danger' : 'text-primary hover:text-danger')}>
          <Heart className="size-[15px]" fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center px-1.5 pt-3 pb-1.5 text-center">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-[14px] font-semibold leading-[1.65rem] text-foreground transition-colors group-hover:text-primary">
          <Link to={`/p/${p.id}`}>{p.name}</Link>
        </h3>
        <span className="my-2 h-px w-8 bg-accent transition-[width] duration-500 group-hover:w-14" aria-hidden="true" />
        <p className="tabular leading-tight">
          <span className="font-semibold text-primary">{money(effectivePrice(p))}</span>
          {sale && <s className="ms-1.5 text-xs text-muted-foreground">{money(p.price)}</s>}
        </p>
        {p.perUnit && <span className="mt-0.5 text-[11px] text-muted-foreground">{p.perUnit}</span>}
        <button type="button" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}
          className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-primary/15 text-[13px] font-medium text-primary transition-colors duration-300 hover:bg-primary hover:text-on-inverse">
          <Plus className="size-4" />أضف للسلة
        </button>
      </div>
    </article>
  )
}
