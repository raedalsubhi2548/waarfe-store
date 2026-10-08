import { Link } from 'react-router-dom'
import { Receipt, Heart, UserRound, PackageSearch, LogOut, LayoutDashboard, Package, Tags, Users, TicketPercent, LogIn, UserPlus, ChevronLeft } from 'lucide-react'
import { api } from '@/lib/api.js'
import { useApp } from '@/state.jsx'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const CUSTOMER = [
  { to: '/account', icon: Receipt, label: 'طلباتي' },
  { to: '/account/wishlist', icon: Heart, label: 'أمنياتي', count: 'wish' },
  { to: '/account/profile', icon: UserRound, label: 'بياناتي' },
]
const ADMIN = [
  { to: '/admin', icon: LayoutDashboard, label: 'نظرة عامة' },
  { to: '/admin/orders', icon: Receipt, label: 'الطلبات' },
  { to: '/admin/products', icon: Package, label: 'المنتجات' },
  { to: '/admin/categories', icon: Tags, label: 'التصنيفات' },
  { to: '/admin/customers', icon: Users, label: 'العملاء' },
  { to: '/admin/coupons', icon: TicketPercent, label: 'كوبونات الخصم' },
]

function Row({ to, icon: I, label, badge }) {
  return (
    <li>
      <Link to={to} className="flex min-h-13 items-center gap-3 rounded-md px-2 py-3 text-[15px] font-semibold text-foreground active:bg-sunken">
        <span className="grid size-9 place-items-center rounded-full bg-sunken text-primary"><I className="size-[18px]" /></span>
        <span className="flex-1">{label}</span>
        {badge > 0 && <span className="tabular rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">{badge}</span>}
        <ChevronLeft className="size-4 text-muted-foreground" />
      </Link>
    </li>
  )
}

/** The customer's (or owner's) own corner on phones: account, orders, wishlist, details — apart from the store menu. */
export default function AccountSheet({ open, onOpenChange }) {
  const { user, wishlist } = useApp()
  const isAdmin = user?.role === 'admin'
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="start" className="overflow-y-auto p-5">
        <SheetTitle className="sr-only">حسابي</SheetTitle>
        <SheetDescription className="sr-only">طلباتك وأمنياتك وبياناتك</SheetDescription>
        <p className="flex h-12 items-center self-start pe-14 font-display text-2xl font-semibold text-primary">حسابي</p>

        {user ? (
          <>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-inverse p-4 text-on-inverse">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent font-display text-xl font-semibold text-accent-foreground">{(user.name || user.email || '؟').trim().charAt(0)}</span>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold">أهلاً {user.name || ''}</p>
                <p className="truncate text-sm text-on-inverse/70" dir="ltr">{user.email}</p>
              </div>
            </div>

            {isAdmin && (
              <>
                <p className="mt-6 mb-1 text-xs font-bold text-muted-foreground">لوحة التحكم</p>
                <ul className="grid">{ADMIN.map((r) => <Row key={r.to} {...r} />)}</ul>
              </>
            )}

            <p className="mt-6 mb-1 text-xs font-bold text-muted-foreground">{isAdmin ? 'حسابي كعميل' : 'حسابي'}</p>
            <ul className="grid">{CUSTOMER.map((r) => <Row key={r.to} {...r} badge={r.count === 'wish' ? wishlist.length : 0} />)}</ul>

            <button onClick={() => { onOpenChange(false); api.signOut() }} className="mt-4 flex min-h-12 items-center gap-3 rounded-md px-2 text-[15px] font-semibold text-danger active:bg-danger-soft">
              <span className="grid size-9 place-items-center rounded-full bg-danger-soft"><LogOut className="size-[18px]" /></span>خروج
            </button>
          </>
        ) : (
          <>
            <div className="mt-4 rounded-xl bg-inverse p-5 text-on-inverse">
              <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"><UserRound className="size-6" /></span>
              <p className="mt-3 font-display text-xl font-semibold">حسابك في منصة رائد</p>
              <p className="mt-1 text-sm leading-6 text-on-inverse/75">سجّل دخولك وتابع طلباتك وأمنياتك من مكان واحد.</p>
            </div>
            <div className="mt-5 grid gap-2">
              <Button asChild size="lg"><Link to="/login"><LogIn />تسجيل الدخول</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/login?mode=up"><UserPlus />حساب جديد</Link></Button>
            </div>
            <ul className="mt-6 grid border-t border-border pt-3">
              <Row to="/login?next=/account" icon={PackageSearch} label="تتبّع طلبك" />
              <Row to="/login?next=/account/wishlist" icon={Heart} label="أمنياتي" badge={wishlist.length} />
            </ul>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
