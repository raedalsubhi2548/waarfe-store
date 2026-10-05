import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useApp } from '../state.jsx'
import { money, effectivePrice } from '../lib/format.js'

export function Qty({ value, onChange }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(value + 1)} aria-label="زيادة الكمية"><Icon name="plus" size={16} /></button>
      <span aria-live="polite">{value}</span>
      <button onClick={() => onChange(value - 1)} aria-label="تقليل الكمية"><Icon name="minus" size={16} /></button>
    </div>
  )
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, setQty, count } = useApp()
  const nav = useNavigate()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    if (cartOpen) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [cartOpen, setCartOpen])
  return (
    <div className={'drawer-wrap' + (cartOpen ? ' open' : '')} aria-hidden={!cartOpen}>
      <div className="drawer-scrim" onClick={() => setCartOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="السلة">
        <header className="drawer-head">
          <h2>السلة <span className="muted">({count})</span></h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="إغلاق"><Icon name="close" /></button>
        </header>
        {lines.length === 0 ? (
          <div className="drawer-empty">
            <Icon name="bag" size={40} stroke={1.2} />
            <p>سلتك فاضية. ابدأ بالخدمة اللي يحتاجها متجرك.</p>
            <Link to="/shop" className="btn btn-primary" onClick={() => setCartOpen(false)}>تصفّح الخدمات</Link>
          </div>
        ) : (
          <>
            <ul className="drawer-lines">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id}>
                  <img src={p.image} alt="" />
                  <div>
                    <Link to={`/p/${p.id}`} onClick={() => setCartOpen(false)} className="line-name">{p.name}</Link>
                    <span className="line-price">{money(effectivePrice(p) * qty)}</span>
                    <Qty value={qty} onChange={(q) => setQty(p.id, q)} />
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer-foot">
              <div className="row-between"><span>المجموع</span><strong>{money(subtotal)}</strong></div>
              <button className="btn btn-primary btn-block" onClick={() => { setCartOpen(false); nav('/checkout') }}>إتمام الطلب</button>
              <Link to="/cart" className="btn btn-ghost btn-block" onClick={() => setCartOpen(false)}>عرض السلة</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
