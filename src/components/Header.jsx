import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import Social from './Social.jsx'
import { useApp } from '../state.jsx'
import { money, effectivePrice } from '../lib/format.js'

const short = (name) => name.replace(/^(ال)?خدمات\s/, '')

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
      <div className="scrim" onClick={onClose} />
      <div className="search-panel" role="dialog" aria-label="البحث">
        <form onSubmit={(e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); onClose() }} className="search-form">
          <Icon name="search" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث: متجر، حملة، دومين، سجل تجاري" aria-label="كلمة البحث" />
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

function MobileMenu({ onClose }) {
  const { categories, products, user } = useApp()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="menu-wrap">
      <div className="scrim" onClick={onClose} />
      <aside className="menu-sheet" role="dialog" aria-modal="true" aria-label="أقسام المتجر">
        <header className="menu-head">
          <Logo className="logo-sm" />
          <button className="icon-btn" onClick={onClose} aria-label="إغلاق"><Icon name="close" /></button>
        </header>
        <p className="menu-label">أقسام المتجر</p>
        <ul className="menu-cats">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/c/${c.id}`} onClick={onClose}>
                <span className="mc-icon"><Icon name={c.icon} size={20} /></span>
                <span className="mc-name">{c.name}</span>
                <span className="mc-count">{products.filter((p) => p.categoryId === c.id).length}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="menu-links">
          <li><Link to="/shop" onClick={onClose}><Icon name="grid" size={18} />كل الخدمات</Link></li>
          <li><Link to={user ? '/account' : '/login'} onClick={onClose}><Icon name="user" size={18} />{user ? 'حسابي وطلباتي' : 'تسجيل الدخول'}</Link></li>
          <li><Link to="/account/wishlist" onClick={onClose}><Icon name="heart" size={18} />أمنياتي</Link></li>
          <li><Link to="/contact" onClick={onClose}><Icon name="whatsapp" size={18} />تواصل معنا</Link></li>
        </ul>
        <Social className="menu-social" />
      </aside>
    </div>
  )
}

export default function Header() {
  const { count, setCartOpen, user, categories, wishlist } = useApp()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const loc = useLocation()
  useEffect(() => { setMenu(false) }, [loc.pathname, loc.search])

  return (
    <>
      <header className="site-head">
        <div className="wrap head-row">
          <button className="icon-btn only-mobile" onClick={() => setMenu(true)} aria-expanded={menu} aria-label="أقسام المتجر">
            <Icon name="menu" />
          </button>
          <Logo />
          <nav className="main-nav" aria-label="الرئيسية">
            <NavLink to="/" end>الرئيسية</NavLink>
            {categories.map((c) => <NavLink key={c.id} to={`/c/${c.id}`}>{short(c.name)}</NavLink>)}
            <NavLink to="/contact">تواصل</NavLink>
          </nav>
          <div className="head-actions">
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="بحث"><Icon name="search" /></button>
            <Link className="icon-btn hide-xs" to="/account/wishlist" aria-label="الأمنيات">
              <Icon name="heart" />{wishlist.length > 0 && <i className="dot">{wishlist.length}</i>}
            </Link>
            <Link className="icon-btn" to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} aria-label={user ? 'حسابي' : 'تسجيل الدخول'}>
              <Icon name="user" />
            </Link>
            <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)} aria-label={`السلة، ${count} عناصر`}>
              <Icon name="bag" />{count > 0 && <i className="dot">{count}</i>}
            </button>
          </div>
        </div>
      </header>
      {menu && <MobileMenu onClose={() => setMenu(false)} />}
      {search && <Search onClose={() => setSearch(false)} />}
    </>
  )
}
