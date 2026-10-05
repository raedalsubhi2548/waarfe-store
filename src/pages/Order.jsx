import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useApp } from '../state.jsx'
import Icon from '../components/Icon.jsx'
import { ORDER_STATUSES } from '../data/seed.js'
import { money, dateTime, waLink } from '../lib/format.js'

const BANK_INFO = import.meta.env.VITE_BANK_INFO || ''
export const statusLabel = (s) => ORDER_STATUSES.find((x) => x.id === s)?.label || s
const FLOW = ['pending', 'paid', 'in_progress', 'review', 'completed']

export function StatusTrack({ status }) {
  if (status === 'cancelled') return <p className="pill pill-cancelled">ملغي</p>
  const at = FLOW.indexOf(status)
  return (
    <ol className="track">
      {FLOW.map((s, i) => <li key={s} className={i < at ? 'done' : i === at ? 'now' : ''}><i />{statusLabel(s)}</li>)}
    </ol>
  )
}

function DownloadButton({ orderId, productId }) {
  const { notify } = useApp()
  const [busy, setBusy] = useState(false)
  const go = async () => {
    setBusy(true)
    try { window.open(await api.downloadUrl(orderId, productId), '_blank', 'noopener') } catch (e) { notify(e.message, 'err') } finally { setBusy(false) }
  }
  return <button className="btn btn-gold dl-btn" onClick={go} disabled={busy}><Icon name="download" size={16} />{busy ? 'لحظة…' : 'تحميل الملف'}</button>
}

export default function Order() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { user, authReady } = useApp()
  const [order, setOrder] = useState(undefined)
  const [verifying, setVerifying] = useState(false)
  const isNew = params.get('new') || params.get('tap_id')

  useEffect(() => {
    if (!authReady) return
    let alive = true
    const load = () => api.getOrder(id).then((o) => alive && setOrder(o)).catch(() => alive && setOrder(null))
    const tap = params.get('tap_id')
    if (tap && api.verifyPayment) { setVerifying(true); api.verifyPayment(id, tap).finally(() => { setVerifying(false); load() }) } else load()
    return () => { alive = false }
  }, [id, authReady, user?.id, params])

  if (order === undefined || verifying) return <div className="page wrap pad-xl center-page"><p className="muted">{verifying ? 'نتأكد من عملية الدفع…' : 'جاري التحميل…'}</p></div>
  if (!order) return <div className="page wrap center-page"><h1>ما لقينا الطلب</h1><p className="muted">تأكد إنك مسجّل دخول بنفس الحساب اللي طلبت فيه.</p><Link className="btn btn-primary" to="/account">طلباتي</Link></div>

  const paid = order.status !== 'pending' && order.status !== 'cancelled'
  return (
    <div className="page wrap pad-top order-page">
      {isNew && (
        <div className={'order-banner' + (paid ? '' : ' wait')}>
          <span className="ob-icon"><Icon name={paid ? 'check' : 'clock'} size={28} /></span>
          <div>
            <h1>{paid ? 'وصلنا طلبك' : 'استلمنا طلبك وبانتظار الدفع'}</h1>
            <p>رقم الطلب #{order.number}. {paid ? 'بنتواصل معك قريباً لبدء التنفيذ.' : order.paymentMethod === 'bank' ? 'حوّل المبلغ وأرسل الإيصال، ونبدأ مباشرة.' : 'ما اكتملت عملية الدفع. تقدر تتواصل معنا لإكمالها.'}</p>
          </div>
        </div>
      )}
      {!isNew && <h1 className="h-page">طلب #{order.number}</h1>}

      <div className="order-grid">
        <div className="panel">
          <h2 className="panel-h">حالة الطلب</h2>
          <StatusTrack status={order.status} />
          {order.status === 'pending' && order.paymentMethod === 'bank' && (
            <div className="bank-box">
              <h3>التحويل البنكي</h3>
              {BANK_INFO ? <p className="pre">{BANK_INFO}</p> : <p>بنرسل لك بيانات الحساب على واتساب.</p>}
              <a className="btn btn-primary" href={waLink(`السلام عليكم، طلبي رقم #${order.number} بقيمة ${money(order.total)}، أبي أرسل إيصال التحويل`)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} />أرسل الإيصال على واتساب
              </a>
            </div>
          )}
          <h3 className="sub-h">السجل</h3>
          <ul className="history">
            {[...(order.history || [])].reverse().map((h, i) => (
              <li key={i}><strong>{statusLabel(h.status)}</strong><span className="muted">{dateTime(h.at)}</span>{h.note && <p>{h.note}</p>}</li>
            ))}
          </ul>
        </div>
        <aside className="summary">
          <h2>تفاصيل الطلب</h2>
          <ul className="sum-lines">
            {order.items.map((it) => (
              <li key={it.productId}>
                <img src={it.image} alt="" />
                <span>{it.name}{it.qty > 1 && <em> × {it.qty}</em>}{it.note && <small className="muted block">{it.note}</small>}
                  {it.digital && paid && <DownloadButton orderId={order.id} productId={it.productId} />}</span>
                <strong>{money(it.price * it.qty)}</strong>
              </li>
            ))}
          </ul>
          {order.discount > 0 && <div className="row-between good"><span>خصم {order.coupon}</span><span>− {money(order.discount)}</span></div>}
          <div className="row-between total"><span>الإجمالي</span><strong>{money(order.total)}</strong></div>
          <p className="muted small">{order.paymentMethod === 'card' ? 'الدفع: بطاقة / Apple Pay' : 'الدفع: تحويل بنكي'} — {dateTime(order.createdAt)}</p>
          <Link to="/account" className="btn btn-ghost btn-block">كل طلباتي</Link>
        </aside>
      </div>
    </div>
  )
}
