import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, Heart, User, ShoppingBag, MessageCircle, PackageSearch, Images, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import Icon from '@/components/Icon.jsx'
import Social from '@/components/Social.jsx'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { SearchDialog } from '@/components/site/SearchDialog.jsx'

const iconBtn = 'relative grid size-11 place-items-center rounded-full text-primary transition-colors hover:bg-white/60'

/** A hairline of gold under the header that fills as you read the page. */
function ScrollLine() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; setP(h > 0 ? scrollY / h : 0) }) }
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-gradient-to-l from-accent via-[#f3e3a1] to-accent" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
}

export default function SiteHeader() {
  const { count, setCartOpen, user, categories, products, wishlist } = useApp()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => { setMenu(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const accountTo = user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'

  const home = loc.pathname === '/'
  const clear = home && !scrolled
  const link = ({ isActive }) => cn('relative px-2.5 py-2 text-[14.5px] font-medium transition-colors after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-x-100', isActive ? 'text-primary after:scale-x-100' : 'text-foreground/80 hover:text-primary')

  return (
    <header className={cn('sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500', clear ? 'bg-transparent' : 'bg-background/80 shadow-[0_10px_30px_-20px_rgb(9_56_46/0.35)] backdrop-blur-xl')}>
      <div className="container-w grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center gap-1">
          <button className={cn(iconBtn, 'lg:hidden')} onClick={() => setMenu(true)} aria-label="أقسام المتجر">
            <Menu className="size-6" />
          </button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="الرئيسية">
            <NavLink to="/shop" className={link}>كل الخدمات</NavLink>
            <NavLink to="/work" className={link}>أعمالنا</NavLink>
            <NavLink to="/reviews" className={link}>آراء العملاء</NavLink>
            <NavLink to="/contact" className={link}>تواصل</NavLink>
          </nav>
        </div>

        <Link to="/" className="group relative grid place-items-center" aria-label="وارف — الرئيسية">
          <span className={cn('absolute size-24 rounded-full bg-[radial-gradient(closest-side,rgb(254_251_242/0.95),transparent)] transition-opacity duration-500', clear ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
          <img src="/logo.png" alt="وارف WAARFE" width="600" height="580" className={cn('relative w-auto transition-[height] duration-500', clear ? 'h-[62px]' : 'h-[50px]')} />
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <button className={iconBtn} onClick={() => setSearch(true)} aria-label="بحث"><Search className="size-[21px]" /></button>
          <Link className={cn(iconBtn, 'hidden sm:grid')} to="/account/wishlist" aria-label={`الأمنيات (${wishlist.length})`}>
            <Heart className="size-[21px]" />
            {wishlist.length > 0 && <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-danger" />}
          </Link>
          <Link className={cn(iconBtn, 'hidden sm:grid')} to={accountTo} aria-label={user ? 'حسابي' : 'تسجيل الدخول'}><User className="size-[21px]" /></Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`السلة، ${count} عناصر`}
            className="ms-1 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-3.5 text-primary-foreground shadow-[0_8px_20px_-8px_rgb(9_56_46/0.6)] transition-colors hover:bg-primary-hover"
          >
            <ShoppingBag className="size-[18px] text-accent" />
            <span className="tabular text-sm font-semibold">{count}</span>
          </button>
        </div>
      </div>
      <ScrollLine />

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="start" className="overflow-y-auto p-5">
          <SheetTitle className="sr-only">أقسام المتجر</SheetTitle>
          <SheetDescription className="sr-only">تصفّح أقسام وارف وروابط حسابك</SheetDescription>
          <Link to="/" className="self-start pe-14"><img src="/logo.png" alt="وارف" width="600" height="580" className="h-14 w-auto" /></Link>
          <p className="mt-6 mb-2 text-xs font-bold text-muted-foreground">أقسام المتجر</p>
          <ul className="grid gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/c/${c.id}`} className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-surface p-2 pe-3 font-display font-semibold text-primary active:bg-sunken">
                  <span className="grid size-10 place-items-center rounded-sm bg-primary text-accent"><Icon name={c.icon} size={19} /></span>
                  <span className="flex-1">{c.name}</span>
                  <span className="tabular rounded-full bg-sunken px-2 text-xs font-bold text-accent-text">{products.filter((p) => p.categoryId === c.id).length}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-5 grid border-t border-border pt-3 text-[15px] font-semibold">
            <li><Link to="/shop" className="flex min-h-12 items-center gap-3 text-foreground"><Search className="size-5 text-primary" />كل الخدمات</Link></li>
            <li><Link to="/work" className="flex min-h-12 items-center gap-3 text-foreground"><Images className="size-5 text-primary" />أعمالنا</Link></li>
            <li><Link to="/reviews" className="flex min-h-12 items-center gap-3 text-foreground"><Star className="size-5 text-primary" />آراء العملاء</Link></li>
            <li><Link to="/account" className="flex min-h-12 items-center gap-3 text-foreground"><PackageSearch className="size-5 text-primary" />تتبّع طلبك</Link></li>
            <li><Link to="/account/wishlist" className="flex min-h-12 items-center gap-3 text-foreground"><Heart className="size-5 text-primary" />أمنياتي</Link></li>
            <li><Link to={accountTo} className="flex min-h-12 items-center gap-3 text-foreground"><User className="size-5 text-primary" />{user ? 'حسابي' : 'تسجيل الدخول'}</Link></li>
            <li><Link to="/contact" className="flex min-h-12 items-center gap-3 text-foreground"><MessageCircle className="size-5 text-primary" />تواصل معنا</Link></li>
          </ul>
          <Social className="mt-auto pt-6" />
        </SheetContent>
      </Sheet>

      <SearchDialog open={search} onOpenChange={setSearch} />
    </header>
  )
}
