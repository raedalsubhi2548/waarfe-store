import { Suspense, useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, Package, Tags, Users, TicketPercent, ExternalLink, LogOut, Menu, Plus } from 'lucide-react'
import { useApp } from '@/state.jsx'
import { api, isDemo } from '@/lib/api.js'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/kit.jsx'
import { ConfirmProvider } from '@/components/admin/ui.jsx'

const NAV = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'نظرة عامة' },
  { to: '/admin/orders', icon: Receipt, label: 'الطلبات', badge: 'orders' },
  { to: '/admin/products', icon: Package, label: 'المنتجات' },
  { to: '/admin/categories', icon: Tags, label: 'التصنيفات' },
  { to: '/admin/customers', icon: Users, label: 'العملاء' },
  { to: '/admin/coupons', icon: TicketPercent, label: 'كوبونات الخصم' },
]

function Nav({ pending, onNavigate }) {
  return (
    <nav className="grid gap-1" aria-label="لوحة التحكم">
      {NAV.map(({ to, end, icon: I, label, badge }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate}
          className={({ isActive }) => cn('group flex h-11 items-center gap-3 rounded-md px-3 text-[15px] font-semibold transition-colors',
            isActive ? 'bg-primary text-on-inverse shadow-hairline' : 'text-foreground/80 hover:bg-sunken hover:text-primary')}>
          {({ isActive }) => (<>
            <I className={cn('size-[18px]', isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-primary')} />
            <span className="flex-1">{label}</span>
            {badge && pending > 0 && <span className={cn('tabular min-w-6 rounded-full px-1.5 text-center text-xs font-bold leading-6', isActive ? 'bg-accent text-accent-foreground' : 'bg-accent/30 text-accent-text')}>{pending}</span>}
          </>)}
        </NavLink>
      ))}
    </nav>
  )
}

function SideFoot({ user }) {
  return (
    <div className="grid gap-1 border-t border-border pt-4">
      <Link to="/" target="_blank" className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-sunken hover:text-primary"><ExternalLink className="size-4" />عرض المتجر</Link>
      <button onClick={() => api.signOut()} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-danger-soft hover:text-danger"><LogOut className="size-4" />خروج</button>
      <div className="mt-2 flex items-center gap-3 rounded-md bg-sunken p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display font-semibold text-accent">{(user.name || user.email).charAt(0)}</span>
        <div className="min-w-0"><p className="truncate text-sm font-bold text-primary">{user.name || 'المدير'}</p><p className="truncate text-xs text-muted-foreground" dir="ltr">{user.email}</p></div>
      </div>
    </div>
  )
}

const Brand = () => (
  <Link to="/admin" className="flex items-center gap-3">
    <img src="/logo.png" alt="وارف" className="h-10 w-auto" />
    <span className="rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-bold text-accent-text">لوحة التحكم</span>
  </Link>
)

export default function AdminLayout() {
  const { user, authReady } = useApp()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [pending, setPending] = useState(0)
  const isAdmin = user?.role === 'admin'
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    if (!isAdmin) return
    api.allOrders().then((o) => setPending(o.filter((x) => ['paid', 'in_progress', 'review'].includes(x.status)).length)).catch(() => {})
  }, [isAdmin, pathname])

  if (!authReady) return <div className="p-8"><Skeleton className="h-96" /></div>
  if (!user) return <Navigate to="/login?next=/admin" replace />
  if (!isAdmin) return <Navigate to="/account" replace />

  return (
    <ConfirmProvider>
      <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-e border-border bg-surface p-5 lg:flex">
          <Brand />
          <div className="flex-1 overflow-y-auto"><Nav pending={pending} /></div>
          <SideFoot user={user} />
        </aside>

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setMenu(true)} className="grid size-11 place-items-center rounded-full text-primary hover:bg-sunken" aria-label="القائمة"><Menu className="size-6" /></button>
          <Brand />
          <Link to="/admin/products/new" className="grid size-11 place-items-center rounded-full bg-primary text-accent" aria-label="منتج جديد"><Plus className="size-5" /></Link>
        </header>
        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetContent side="start" className="gap-6 bg-surface p-5">
            <SheetTitle className="sr-only">قائمة لوحة التحكم</SheetTitle>
            <Brand />
            <div className="flex-1 overflow-y-auto"><Nav pending={pending} onNavigate={() => setMenu(false)} /></div>
            <SideFoot user={user} />
          </SheetContent>
        </Sheet>

        <main id="main" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">
            {isDemo && <p className="mb-6 rounded-md border-2 border-dashed border-accent bg-accent/10 px-4 py-3 text-sm leading-7"><strong>وضع العرض:</strong> التعديلات محفوظة في هذا المتصفح فقط.</p>}
            <Suspense fallback={<Skeleton className="h-96" />}><Outlet /></Suspense>
          </div>
        </main>
      </div>
    </ConfirmProvider>
  )
}
