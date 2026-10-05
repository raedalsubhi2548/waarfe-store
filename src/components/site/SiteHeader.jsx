import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, Heart, User, ShoppingBag, MessageCircle, PackageSearch, Images } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import Icon from '@/components/Icon.jsx'
import Social from '@/components/Social.jsx'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { SearchDialog } from '@/components/site/SearchDialog.jsx'

const iconBtn = 'relative grid size-11 place-items-center rounded-full text-primary transition-colors hover:bg-sunken'

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

  const link = ({ isActive }) => cn('rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-sunken')

  return (
    <header className={cn('sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300', scrolled ? 'border-border shadow-hairline' : 'border-transparent')}>
      <div className="container-w flex h-[var(--header-height)] items-center gap-2">
        <button className={cn(iconBtn, 'lg:hidden')} onClick={() => setMenu(true)} aria-label="أقسام المتجر">
          <Menu className="size-6" />
        </button>

        <Link to="/" className="shrink-0" aria-label="وارف — الرئيسية">
          <img src="/logo.png" alt="وارف WAARFE" width="600" height="580" className="h-[52px] w-auto" />
        </Link>

        <nav className="ms-6 hidden flex-1 items-center gap-1 lg:flex" aria-label="الرئيسية">
          <NavLink to="/" end className={link}>الرئيسية</NavLink>
          <NavLink to="/shop" className={link}>كل الخدمات</NavLink>
          <NavLink to="/work" className={link}>أعمالنا</NavLink>
          <NavLink to="/account" className={link}>تتبّع طلبك</NavLink>
          <NavLink to="/contact" className={link}>تواصل</NavLink>
        </nav>

        <div className="ms-auto flex items-center gap-0.5">
          <button className={iconBtn} onClick={() => setSearch(true)} aria-label="بحث"><Search className="size-[21px]" /></button>
          <Link className={cn(iconBtn, 'hidden sm:grid')} to="/account/wishlist" aria-label={`الأمنيات (${wishlist.length})`}>
            <Heart className="size-[21px]" />
            {wishlist.length > 0 && <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-danger" />}
          </Link>
          <Link className={iconBtn} to={accountTo} aria-label={user ? 'حسابي' : 'تسجيل الدخول'}><User className="size-[21px]" /></Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`السلة، ${count} عناصر`}
            className="ms-1 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <ShoppingBag className="size-5 text-accent" />
            <span className="tabular text-sm font-bold">{count}</span>
          </button>
        </div>
      </div>

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
