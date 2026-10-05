import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { money, date } from '../../lib/format.js'
import { statusLabel } from '../Order.jsx'

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api.myOrders().then(setOrders).catch((e) => setErr(e.message)) }, [])
  if (err) return <p className="err">{err}</p>
  if (!orders) return <div className="skeleton tall" />
  if (!orders.length) return (
    <div className="empty big"><p>ما عندك طلبات للحين. أول خطوة لمتجرك تبدأ من هنا.</p><Link className="btn btn-primary" to="/shop">تصفّح الخدمات</Link></div>
  )
  const active = orders.filter((o) => !['completed', 'cancelled'].includes(o.status)).length
  return (
    <>
      <div className="acc-stats">
        <div><strong>{orders.length}</strong><span>كل الطلبات</span></div>
        <div><strong>{active}</strong><span>قيد المتابعة</span></div>
        <div><strong>{money(orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0))}</strong><span>إجمالي مشترياتك</span></div>
      </div>
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to={`/order/${o.id}`}>
              <div className="ol-thumbs">{o.items.slice(0, 3).map((it) => <img key={it.productId} src={it.image} alt="" />)}</div>
              <div className="ol-main">
                <strong>طلب #{o.number}</strong>
                <span className="muted">{o.items.map((i) => i.name).join('، ')}</span>
              </div>
              <span className={`pill pill-${o.status}`}>{statusLabel(o.status)}</span>
              <div className="ol-end"><strong>{money(o.total)}</strong><span className="muted small">{date(o.createdAt)}</span></div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
