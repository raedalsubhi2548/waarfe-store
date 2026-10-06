import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import { money, effectivePrice } from '@/lib/format.js'

const onMove = (e) => {
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  el.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`); el.style.setProperty('--ry', `${((x - 0.5) * 12).toFixed(2)}deg`)
}
const onLeave = (e) => { const s = e.currentTarget.style; s.setProperty('--rx', '0deg'); s.setProperty('--ry', '0deg') }

/**
 * The product as a collectible card: deep green, gold foil frame, the cover in an arch window,
 * tilts toward the pointer with a moving glint.
 */
export default function ServiceTicket({ p, className }) {
  const { addToCart, toggleWish, wishlist } = useApp()
  const wished = wishlist.includes(p.id)
  const sale = p.salePrice && p.salePrice < p.price
  return (
    <div className={cn('[perspective:900px]', className)}>
      <article onPointerMove={onMove} onPointerLeave={onLeave}
        className="group relative h-full rounded-[24px] bg-[linear-gradient(145deg,#f6e7a8,#b8973c_28%,#f3df93_52%,#9c7c2c_78%,#e8d384)] p-[1.5px] shadow-[0_2px_6px_rgb(9_56_46/0.12),0_30px_50px_-22px_rgb(9_56_46/0.7)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] [transform-style:preserve-3d] hover:shadow-[0_4px_10px_rgb(9_56_46/0.15),0_44px_70px_-26px_rgb(9_56_46/0.8)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[22.5px] bg-[radial-gradient(120%_80%_at_50%_0%,#125443,#09382e_55%,#062a22)] p-2.5 sm:p-3">
          {/* inner hairline + corner flourishes */}
          <span className="pointer-events-none absolute inset-[6px] rounded-[18px] border border-accent/25" aria-hidden="true" />
          {[['top-2.5 start-2.5', ''], ['top-2.5 end-2.5', '-scale-x-100']].map(([pos, flip]) => (
            <svg key={pos} viewBox="0 0 20 20" className={cn('pointer-events-none absolute size-4 text-accent/70', pos, flip)} aria-hidden="true"><path d="M2 18 V8 A6 6 0 0 1 8 2 H18" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="2" cy="18" r="1.3" fill="currentColor" /></svg>
          ))}

          {/* the cover in an arch window */}
          <Link to={`/p/${p.id}`} className="relative mx-auto mt-3 block w-[88%] overflow-hidden rounded-t-[999px] rounded-b-[14px] bg-[#0b3e33] ring-1 ring-accent/50">
            <img src={p.image} alt="" loading="lazy" decoding="async" width="500" height="500"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(transparent,#09382e)]" aria-hidden="true" />
          </Link>

          <button type="button" onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
            className={cn('absolute top-[22px] end-[22px] z-10 grid size-8 place-items-center rounded-full bg-[#062a22]/70 ring-1 ring-accent/40 backdrop-blur transition-colors', wished ? 'text-danger' : 'text-accent hover:text-white')}>
            <Heart className="size-[15px]" fill={wished ? 'currentColor' : 'none'} />
          </button>
          {(p.badge || sale) && (
            <span className="absolute top-[22px] start-[22px] z-10 rounded-full bg-[linear-gradient(135deg,#f3e3a1,#d7c676)] px-2.5 py-0.5 text-[10.5px] font-semibold text-primary shadow">{sale ? 'خصم' : p.badge}</span>
          )}

          <div className="relative flex flex-1 flex-col items-center px-1 pt-3 pb-1 text-center">
            <h3 className="line-clamp-2 min-h-[3.2rem] text-[14px] font-semibold leading-[1.6rem] text-on-inverse">
              <Link to={`/p/${p.id}`} className="after:absolute after:inset-0">{p.name}</Link>
            </h3>
            <svg viewBox="0 0 80 10" className="my-1.5 h-2.5 w-16 text-accent" aria-hidden="true"><path d="M0 5 H32 M48 5 H80" stroke="currentColor" strokeWidth=".8" /><path d="M40 1 L44 5 L40 9 L36 5 Z" fill="currentColor" /></svg>
            <p className="tabular leading-tight">
              <span className="text-[17px] font-semibold text-accent">{money(effectivePrice(p))}</span>
              {sale && <s className="ms-1.5 text-xs text-on-inverse/50">{money(p.price)}</s>}
            </p>
            {p.perUnit && <span className="mt-0.5 text-[11px] text-on-inverse/55">{p.perUnit}</span>}
            <button type="button" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}
              className="relative z-10 mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-accent/60 text-[13px] font-medium text-accent transition-colors duration-300 hover:bg-accent hover:text-primary">
              <Plus className="size-4" />أضف للسلة
            </button>
          </div>

          {/* moving glint */}
          <span className="pointer-events-none absolute inset-0 rounded-[22.5px] bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,0%),rgb(255_244_200/0.22),transparent_42%)] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
        </div>
      </article>
    </div>
  )
}
