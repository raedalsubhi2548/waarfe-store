import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'
import { money, date } from '../../lib/format.js'
import Icon from '../../components/Icon.jsx'

export default function Customers() {
  const [list, setList] = useState(null)
  const [q, setQ] = useState('')
  useEffect(() => { api.listCustomers().then(setList).catch(() => setList([])) }, [])
  const shown = (list || []).filter((c) => !q || (c.name + c.email + (c.phone || '')).includes(q))
  return (
    <>
      <header className="admin-head"><h1>العملاء</h1></header>
      <div className="admin-filters"><label className="field-inline search-inline"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="الاسم، البريد، أو الجوال" aria-label="بحث" /></label></div>
      {!list ? <div className="skeleton tall" /> : shown.length === 0 ? <div className="panel"><p className="muted">ما فيه عملاء مسجّلين للحين.</p></div> : (
        <div className="panel flush">
          <table className="table">
            <thead><tr><th>العميل</th><th>الجوال</th><th>الطلبات</th><th>إجمالي المشتريات</th><th>تاريخ التسجيل</th></tr></thead>
            <tbody>{shown.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong><div className="muted small" dir="ltr">{c.email}</div></td>
                <td dir="ltr">{c.phone ? <a className="link-u" href={`https://wa.me/${c.phone.replace(/\D/g, '').replace(/^0/, '966')}`} target="_blank" rel="noreferrer">{c.phone}</a> : '—'}</td>
                <td>{c.orders}</td>
                <td>{money(c.spent)}</td>
                <td className="muted">{date(c.createdAt)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  )
}
