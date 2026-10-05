import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import Icon from '../../components/Icon.jsx'
import { ORDER_STATUSES } from '../../data/seed.js'
import { money, dateTime } from '../../lib/format.js'
import { statusLabel, StatusTrack } from '../Order.jsx'

function OrderPanel({ order, onClose, onSaved }) {
  const { notify } = useApp()
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const phone = (order.customer?.phone || '').replace(/\D/g, '').replace(/^0/, '966')
  const save = async () => {
    setBusy(true)
    try { await api.updateOrderStatus(order.id, status, note); notify('تم تحديث حالة الطلب'); setNote(''); onSaved() } catch (e) { notify(e.message, 'err') } finally { setBusy(false) }
  }
  return (
    <div className="drawer-wrap open">
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer wide" role="dialog" aria-modal="true" aria-label={`طلب ${order.number}`}>
        <header className="drawer-head"><h2>طلب #{order.number}</h2><button className="icon-btn" onClick={onClose} aria-label="إغلاق"><Icon name="close" /></button></header>
        <div className="drawer-body stack">
          <StatusTrack status={order.status} />
          <section className="panel tight">
            <h3 className="sub-h">العميل</h3>
            <p><strong>{order.customer?.name}</strong></p>
            <p className="muted" dir="ltr">{order.customer?.email}</p>
            <p className="muted" dir="ltr">{order.customer?.phone}</p>
            {phone && <a className="btn btn-ghost" href={`https://wa.me/${phone}?text=${encodeURIComponent(`السلام عليكم ${order.customer?.name || ''}، معك وارف بخصوص طلبك رقم #${order.number}`)}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} />راسل العميل</a>}
          </section>
          <section className="panel tight">
            <h3 className="sub-h">الخدمات</h3>
            <ul className="sum-lines">
              {order.items.map((it) => <li key={it.productId}><img src={it.image} alt="" /><span>{it.name}{it.qty > 1 && <em> × {it.qty}</em>}{it.note && <small className="muted block">{it.note}</small>}</span><strong>{money(it.price * it.qty)}</strong></li>)}
            </ul>
            {order.notes && <p className="note-box">{order.notes}</p>}
            {order.discount > 0 && <div className="row-between good"><span>خصم {order.coupon}</span><span>− {money(order.discount)}</span></div>}
            <div className="row-between total"><span>الإجمالي</span><strong>{money(order.total)}</strong></div>
            <p className="muted small">{order.paymentMethod === 'card' ? 'بطاقة / Apple Pay' : 'تحويل بنكي'}</p>
          </section>
          <section className="panel tight stack">
            <h3 className="sub-h">تحديث الحالة</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="الحالة">{ORDER_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="ملاحظة تظهر للعميل في سجل الطلب (اختياري)" aria-label="ملاحظة" />
            <button className="btn btn-primary" onClick={save} disabled={busy || (status === order.status && !note)}>{busy ? 'جاري الحفظ…' : 'حفظ الحالة'}</button>
          </section>
          <ul className="history">{[...(order.history || [])].reverse().map((h, i) => <li key={i}><strong>{statusLabel(h.status)}</strong><span className="muted">{dateTime(h.at)}</span>{h.note && <p>{h.note}</p>}</li>)}</ul>
        </div>
      </aside>
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState('')
  const [q, setQ] = useState('')
  const load = () => api.allOrders().then(setOrders).catch(() => setOrders([]))
  useEffect(() => { load() }, [])
  const openId = params.get('open')
  const open = orders?.find((o) => o.id === openId)
  const shown = useMemo(() => (orders || []).filter((o) => (!filter || o.status === filter) && (!q || String(o.number).includes(q) || (o.customer?.name || '').includes(q) || (o.customer?.phone || '').includes(q))), [orders, filter, q])

  return (
    <>
      <header className="admin-head"><h1>الطلبات</h1></header>
      <div className="tabs small" role="tablist">
        <button role="tab" aria-selected={!filter} onClick={() => setFilter('')}>الكل <i>{orders?.length || 0}</i></button>
        {ORDER_STATUSES.map((s) => <button key={s.id} role="tab" aria-selected={filter === s.id} onClick={() => setFilter(s.id)}>{s.label} <i>{(orders || []).filter((o) => o.status === s.id).length}</i></button>)}
      </div>
      <div className="admin-filters"><label className="field-inline search-inline"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="رقم الطلب، اسم العميل، أو الجوال" aria-label="بحث" /></label></div>
      {!orders ? <div className="skeleton tall" /> : shown.length === 0 ? <div className="panel"><p className="muted">ما فيه طلبات هنا.</p></div> : (
        <div className="panel flush">
          <table className="table">
            <thead><tr><th>الطلب</th><th>العميل</th><th>الخدمات</th><th>الحالة</th><th>الإجمالي</th><th>التاريخ</th></tr></thead>
            <tbody>{shown.map((o) => (
              <tr key={o.id} className="clickable" onClick={() => setParams({ open: o.id })} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setParams({ open: o.id })}>
                <td><strong>#{o.number}</strong></td>
                <td>{o.customer?.name}<div className="muted small" dir="ltr">{o.customer?.phone}</div></td>
                <td className="clip">{o.items.map((i) => i.name).join('، ')}</td>
                <td><span className={`pill pill-${o.status}`}>{statusLabel(o.status)}</span></td>
                <td>{money(o.total)}</td>
                <td className="muted">{dateTime(o.createdAt)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {open && <OrderPanel key={open.id + open.status} order={open} onClose={() => setParams({})} onSaved={load} />}
    </>
  )
}
