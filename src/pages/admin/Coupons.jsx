import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import Icon from '../../components/Icon.jsx'
import { money, date } from '../../lib/format.js'

export default function Coupons() {
  const { notify } = useApp()
  const [list, setList] = useState(null)
  const [f, setF] = useState({ code: '', type: 'percent', value: '', expiresAt: '' })
  const load = () => api.listCoupons().then(setList).catch(() => setList([]))
  useEffect(() => { load() }, [])
  const add = async (e) => {
    e.preventDefault()
    try { await api.saveCoupon({ ...f, value: Number(f.value), active: true, expiresAt: f.expiresAt || null }); setF({ code: '', type: 'percent', value: '', expiresAt: '' }); load(); notify('أُضيف الكود') } catch (er) { notify(er.message, 'err') }
  }
  const toggle = async (c) => { await api.saveCoupon({ ...c, active: !c.active }); load() }
  const del = async (c) => { if (window.confirm(`حذف الكود ${c.code}؟`)) { await api.deleteCoupon(c.code); load() } }
  return (
    <>
      <header className="admin-head"><h1>كوبونات الخصم</h1></header>
      <form className="panel coupon-form" onSubmit={add}>
        <label className="field"><span>الكود</span><input required value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} dir="ltr" placeholder="RAMADAN" /></label>
        <label className="field"><span>النوع</span><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="percent">نسبة %</option><option value="fixed">مبلغ ثابت</option></select></label>
        <label className="field"><span>القيمة</span><input required type="number" min="1" max={f.type === 'percent' ? 100 : undefined} value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} dir="ltr" /></label>
        <label className="field"><span>ينتهي (اختياري)</span><input type="date" value={f.expiresAt} onChange={(e) => setF({ ...f, expiresAt: e.target.value })} /></label>
        <button className="btn btn-primary"><Icon name="plus" size={18} />أضف الكود</button>
      </form>
      {!list ? <div className="skeleton tall" /> : list.length === 0 ? <div className="panel"><p className="muted">ما فيه أكواد. أضف أول كود من فوق.</p></div> : (
        <div className="panel flush">
          <table className="table">
            <thead><tr><th>الكود</th><th>الخصم</th><th>ينتهي</th><th>الحالة</th><th><span className="sr">حذف</span></th></tr></thead>
            <tbody>{list.map((c) => (
              <tr key={c.code}>
                <td dir="ltr"><strong>{c.code}</strong></td>
                <td>{c.type === 'percent' ? `${c.value}%` : money(c.value)}</td>
                <td className="muted">{c.expiresAt ? date(c.expiresAt) : 'بدون'}</td>
                <td><button className={'switch' + (c.active ? ' on' : '')} onClick={() => toggle(c)} aria-pressed={c.active}><i />{c.active ? 'فعّال' : 'موقوف'}</button></td>
                <td><button className="icon-btn danger" onClick={() => del(c)} aria-label="حذف"><Icon name="trash" size={18} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  )
}
