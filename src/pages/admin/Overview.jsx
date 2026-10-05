import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import { money, num, dateTime } from '../../lib/format.js'
import { statusLabel } from '../Order.jsx'

const DAYS = 14
const isRevenue = (o) => !['pending', 'cancelled'].includes(o.status)

function SalesChart({ orders }) {
  const days = useMemo(() => {
    const out = []
    const today = new Date(); today.setHours(0, 0, 0, 0)
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      const next = new Date(d); next.setDate(d.getDate() + 1)
      const v = orders.filter((o) => isRevenue(o) && new Date(o.createdAt) >= d && new Date(o.createdAt) < next).reduce((s, o) => s + o.total, 0)
      out.push({ d, v })
    }
    return out
  }, [orders])
  const max = Math.max(...days.map((x) => x.v), 1)
  const W = 640, H = 180, bw = W / DAYS
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label={`المبيعات آخر ${DAYS} يوم`}>
        <line x1="0" x2={W} y1={H} y2={H} className="axis" />
        {days.map((x, i) => {
          const h = (x.v / max) * (H - 16)
          return (
            <g key={i}>
              <rect x={W - (i + 1) * bw + 6} y={H - h} width={bw - 12} height={Math.max(h, x.v ? 2 : 0)} rx="4" className="bar"><title>{x.d.toLocaleDateString('ar-SA-u-nu-latn-ca-gregory')}: {money(x.v)}</title></rect>
              {i % 2 === 0 && <text x={W - (i + 0.5) * bw} y={H + 18} textAnchor="middle" className="tick">{x.d.getDate()}/{x.d.getMonth() + 1}</text>}
            </g>
          )
        })}
      </svg>
      <figcaption className="muted small">المبيعات المدفوعة آخر {DAYS} يوم — أعلى يوم {money(max === 1 ? 0 : max)}</figcaption>
    </figure>
  )
}

export default function Overview() {
  const { products } = useApp()
  const [orders, setOrders] = useState(null)
  const [customers, setCustomers] = useState([])
  useEffect(() => {
    api.allOrders().then(setOrders).catch(() => setOrders([]))
    api.listCustomers().then(setCustomers).catch(() => {})
  }, [])
  if (!orders) return <div className="skeleton tall" />

  const revenue = orders.filter(isRevenue).reduce((s, o) => s + o.total, 0)
  const open = orders.filter((o) => ['paid', 'in_progress', 'review'].includes(o.status))
  const awaiting = orders.filter((o) => o.status === 'pending')
  const top = Object.values(orders.filter(isRevenue).flatMap((o) => o.items).reduce((m, it) => {
    m[it.productId] = m[it.productId] || { name: it.name, qty: 0, total: 0 }
    m[it.productId].qty += it.qty; m[it.productId].total += it.price * it.qty; return m
  }, {})).sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <>
      <header className="admin-head"><h1>نظرة عامة</h1><Link to="/admin/products/new" className="btn btn-primary">منتج جديد</Link></header>
      <div className="kpis">
        <div className="kpi"><span>المبيعات</span><strong>{money(revenue)}</strong></div>
        <div className="kpi"><span>طلبات تحتاج تنفيذ</span><strong>{num(open.length)}</strong></div>
        <div className="kpi"><span>بانتظار الدفع</span><strong>{num(awaiting.length)}</strong></div>
        <div className="kpi"><span>العملاء</span><strong>{num(customers.length)}</strong></div>
        <div className="kpi"><span>المنتجات المعروضة</span><strong>{num(products.length)}</strong></div>
      </div>
      <div className="admin-2col">
        <section className="panel"><h2 className="panel-h">المبيعات</h2><SalesChart orders={orders} /></section>
        <section className="panel">
          <h2 className="panel-h">الأكثر مبيعاً</h2>
          {top.length === 0 ? <p className="muted">تظهر هنا بعد أول طلب مدفوع.</p> : (
            <ol className="top-list">{top.map((t) => <li key={t.name}><span>{t.name}</span><em>{t.qty}×</em><strong>{money(t.total)}</strong></li>)}</ol>
          )}
        </section>
      </div>
      <section className="panel">
        <div className="row-between"><h2 className="panel-h">أحدث الطلبات</h2><Link to="/admin/orders" className="link-u">كل الطلبات</Link></div>
        {orders.length === 0 ? <p className="muted">ما فيه طلبات للحين.</p> : (
          <table className="table">
            <thead><tr><th>الطلب</th><th>العميل</th><th>الحالة</th><th>الإجمالي</th><th>التاريخ</th></tr></thead>
            <tbody>{orders.slice(0, 6).map((o) => (
              <tr key={o.id}>
                <td><Link to={`/admin/orders?open=${o.id}`} className="link-u">#{o.number}</Link></td>
                <td>{o.customer?.name}</td>
                <td><span className={`pill pill-${o.status}`}>{statusLabel(o.status)}</span></td>
                <td>{money(o.total)}</td>
                <td className="muted">{dateTime(o.createdAt)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </section>
    </>
  )
}
