import { Link } from 'react-router-dom'
import { useApp } from '../state.jsx'
import Icon from '../components/Icon.jsx'
import { Qty } from '../components/CartDrawer.jsx'
import { money, effectivePrice } from '../lib/format.js'

export default function Cart() {
  const { lines, subtotal, setQty, setNote } = useApp()
  return (
    <div className="page wrap pad-top">
      <h1 className="h-page">السلة</h1>
      {lines.length === 0 ? (
        <div className="empty big">
          <Icon name="bag" size={44} stroke={1.2} />
          <p>سلتك فاضية. ابدأ بالخدمة اللي يحتاجها متجرك.</p>
          <Link to="/shop" className="btn btn-primary">تصفّح الخدمات</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <ul className="cart-lines">
            {lines.map(({ product: p, qty, note }) => (
              <li key={p.id}>
                <img src={p.image} alt="" />
                <div className="cl-main">
                  <Link to={`/p/${p.id}`} className="line-name">{p.name}</Link>
                  <span className="muted">{money(effectivePrice(p))} {p.perUnit || ''}</span>
                  <input className="note-input" value={note || ''} onChange={(e) => setNote(p.id, e.target.value)} placeholder="ملاحظة على هذه الخدمة (اختياري)" aria-label={`ملاحظة على ${p.name}`} />
                </div>
                <Qty value={qty} onChange={(q) => setQty(p.id, q)} />
                <strong className="cl-total">{money(effectivePrice(p) * qty)}</strong>
                <button className="icon-btn" onClick={() => setQty(p.id, 0)} aria-label={`حذف ${p.name}`}><Icon name="trash" size={18} /></button>
              </li>
            ))}
          </ul>
          <aside className="summary">
            <h2>ملخص الطلب</h2>
            <div className="row-between"><span>المجموع</span><strong>{money(subtotal)}</strong></div>
            <p className="muted small">كود الخصم وطريقة الدفع في الخطوة التالية.</p>
            <Link to="/checkout" className="btn btn-primary btn-block btn-lg">إتمام الطلب</Link>
            <Link to="/shop" className="btn btn-ghost btn-block">أكمل التسوّق</Link>
          </aside>
        </div>
      )}
    </div>
  )
}
