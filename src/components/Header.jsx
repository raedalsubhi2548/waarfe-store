import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { useApp } from '../state.jsx'
import { money, effectivePrice } from '../lib/format.js'

function Search({ onClose }) {
  const { products } = useApp()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const input = useRef()
  useEffect(() => { input.current?.focus() }, [])
  const results = useMemo(() => {
    const t = q.trim()
    if (!t) return []
    return products.filter((p) => (p.name + ' ' + (p.summary || '')).includes(t)).slice(0, 6)
  }, [q, products])
  return (
    <div className="search-wrap" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="drawer-scrim" onClick={onClose} />
      <div className="search-panel" role="dialog" aria-label="البحث">
        <form onSubmit={(e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); onClose() }} className="search-form">
          <Icon name="search" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث: متجر، حملة، دومين، سجل تجاري…" aria-label="كلمة البحث" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="إغلاق البحث"><Icon name="close" /></button>
        </form>
        {q && (
          <ul className="search-results">
            {results.length === 0 && <li className="muted pad">ما لقينا نتيجة لـ «{q}». جرّب كلمة أعم مثل «حملة» أو «تصميم».</li>}
            {results.map((p) => (
              <li key={p.id}>
                <Link to={`/p/${p.id}`} onClick={onClose}>
                  <img src={p.image} alt="" />
                  <span>{p.name}</span>
                  <strong>{money(effectivePrice(p))}</strong>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Header() {
  const { count, setCartOpen, user, categories, wishlist } = useApp()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  const onHome = loc.pathname === '/'
  useEffect(() => { setMenu(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const solid = !onHome || scrolled || menu

  return (
    <>
      <header className={'site-head' + (solid ? ' solid' : ' clear')}>
        <div className="wrap head-row">
          <button className="icon-btn only-mobile" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="القائمة">
            <Icon name={menu ? 'close' : 'menu'} />
          </button>
          <Logo light={!solid} />
          <nav className={'main-nav' + (menu ? ' open' : '')} aria-label="الرئيسية">
            <NavLink to="/" end>الرئيسية</NavLink>
            <NavLink to="/shop" end>كل الخدمات</NavLink>
            {categories.slice(0, 4).map((c) => <NavLink key={c.id} to={`/c/${c.id}`}>{c.name.replace(/^(ال)?خدمات\s/, '')}</NavLink>)}
            <NavLink to="/contact">تواصل معنا</NavLink>
          </nav>
          <div className="head-actions">
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="بحث"><Icon name="search" /></button>
            <Link className="icon-btn hide-xs" to="/account/wishlist" aria-label="الأمنيات">
              <Icon name="heart" />{wishlist.length > 0 && <i className="dot">{wishlist.length}</i>}
            </Link>
            <Link className="icon-btn" to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} aria-label={user ? 'حسابي' : 'تسجيل الدخول'}>
              <Icon name="user" />
            </Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`السلة، ${count} عناصر`}>
              <Icon name="bag" />{count > 0 && <i className="dot">{count}</i>}
            </button>
          </div>
        </div>
      </header>
      {search && <Search onClose={() => setSearch(false)} />}
    </>
  )
}
