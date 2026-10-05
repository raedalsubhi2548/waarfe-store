import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../state.jsx'
import { api } from '../../lib/api.js'
import Icon from '../../components/Icon.jsx'

export default function AccountLayout() {
  const { user, authReady } = useApp()
  const { pathname } = useLocation()
  const guestOk = pathname.endsWith('/wishlist')
  if (!authReady) return <div className="page wrap pad-xl"><div className="skeleton tall" /></div>
  if (!user && !guestOk) return <Navigate to={`/login?next=${pathname}`} replace />
  return (
    <div className="page wrap pad-top account">
      <header className="acc-head">
        <div>
          <h1 className="h-page">{user ? `أهلاً ${user.name || ''}` : 'أمنياتي'}</h1>
          {user && <p className="muted" dir="ltr">{user.email}</p>}
        </div>
        {user?.role === 'admin' && <NavLink to="/admin" className="btn btn-gold">لوحة التحكم</NavLink>}
      </header>
      {user && (
        <nav className="acc-tabs" aria-label="حسابي">
          <NavLink to="/account" end><Icon name="receipt" size={18} />طلباتي</NavLink>
          <NavLink to="/account/wishlist"><Icon name="heart" size={18} />أمنياتي</NavLink>
          <NavLink to="/account/profile"><Icon name="user" size={18} />بياناتي</NavLink>
          <button onClick={() => api.signOut()}><Icon name="logout" size={18} />خروج</button>
        </nav>
      )}
      <Outlet />
    </div>
  )
}
