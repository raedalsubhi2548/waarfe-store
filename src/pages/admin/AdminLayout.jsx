import { NavLink, Navigate, Outlet, Link } from 'react-router-dom'
import { useApp } from '../../state.jsx'
import { api, isDemo } from '../../lib/api.js'
import Icon from '../../components/Icon.jsx'
import { Mark } from '../../components/Logo.jsx'

const NAV = [
  { to: '/admin', end: true, icon: 'grid', label: 'نظرة عامة' },
  { to: '/admin/orders', icon: 'receipt', label: 'الطلبات' },
  { to: '/admin/products', icon: 'box', label: 'المنتجات' },
  { to: '/admin/categories', icon: 'tag', label: 'التصنيفات' },
  { to: '/admin/customers', icon: 'users', label: 'العملاء' },
  { to: '/admin/coupons', icon: 'spark', label: 'كوبونات الخصم' },
]

export default function AdminLayout() {
  const { user, authReady } = useApp()
  if (!authReady) return null
  if (!user) return <Navigate to="/login?next=/admin" replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/admin" className="admin-brand"><Mark size={28} /><span>وارف</span><small>لوحة التحكم</small></Link>
        <nav>{NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end}><Icon name={n.icon} size={19} />{n.label}</NavLink>)}</nav>
        <div className="admin-side-foot">
          <Link to="/" target="_blank"><Icon name="external" size={18} />عرض المتجر</Link>
          <button onClick={() => api.signOut()}><Icon name="logout" size={18} />خروج</button>
        </div>
      </aside>
      <section className="admin-main">
        {isDemo && <p className="note-demo">وضع العرض: التعديلات محفوظة في هذا المتصفح فقط. اربط Supabase من الإعدادات عشان تصير حقيقية لكل العملاء.</p>}
        <Outlet />
      </section>
    </div>
  )
}
