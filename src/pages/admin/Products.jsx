import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import Icon from '../../components/Icon.jsx'
import { money, effectivePrice } from '../../lib/format.js'

export default function Products() {
  const { categories, refreshCatalog, notify } = useApp()
  const [list, setList] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const load = () => api.getProducts({ includeHidden: true }).then((l) => setList(l.sort((a, b) => (a.categoryId || '').localeCompare(b.categoryId || '') || (a.sort ?? 0) - (b.sort ?? 0))))
  useEffect(() => { load() }, [])

  const shown = useMemo(() => (list || []).filter((p) => (!cat || p.categoryId === cat) && (!q || p.name.includes(q))), [list, q, cat])
  const toggle = async (p) => {
    try { await api.saveProduct({ ...p, active: !p.active }); await load(); refreshCatalog(); notify(p.active ? 'أُخفي المنتج من المتجر' : 'المنتج ظاهر في المتجر') } catch (e) { notify(e.message, 'err') }
  }
  const remove = async (p) => {
    if (!window.confirm(`حذف «${p.name}» نهائياً؟`)) return
    try { await api.deleteProduct(p.id); await load(); refreshCatalog(); notify('تم حذف المنتج') } catch (e) { notify(e.message, 'err') }
  }

  return (
    <>
      <header className="admin-head"><h1>المنتجات</h1><Link to="/admin/products/new" className="btn btn-primary"><Icon name="plus" size={18} />منتج جديد</Link></header>
      <div className="admin-filters">
        <label className="field-inline search-inline"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم" aria-label="بحث" /></label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="التصنيف">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {!list ? <div className="skeleton tall" /> : (
        <div className="panel flush">
          <table className="table products-table">
            <thead><tr><th>المنتج</th><th>التصنيف</th><th>السعر</th><th>الحالة</th><th><span className="sr">إجراءات</span></th></tr></thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className={p.active ? '' : 'dim'}>
                  <td><div className="t-prod"><img src={p.image} alt="" /><div><strong>{p.name}</strong>{p.badge && <small className="tag-gold">{p.badge}</small>}</div></div></td>
                  <td>{categories.find((c) => c.id === p.categoryId)?.name || '—'}</td>
                  <td>{money(effectivePrice(p))}{p.salePrice ? <s className="muted small"> {money(p.price)}</s> : null}</td>
                  <td><button className={'switch' + (p.active ? ' on' : '')} onClick={() => toggle(p)} aria-pressed={p.active}><i />{p.active ? 'ظاهر' : 'مخفي'}</button></td>
                  <td className="t-actions">
                    <Link to={`/p/${p.id}`} target="_blank" className="icon-btn" aria-label="عرض في المتجر"><Icon name="eye" size={18} /></Link>
                    <Link to={`/admin/products/${p.id}`} className="icon-btn" aria-label="تعديل"><Icon name="edit" size={18} /></Link>
                    <button className="icon-btn danger" onClick={() => remove(p)} aria-label="حذف"><Icon name="trash" size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 && <p className="muted pad">ما فيه منتجات بهذا البحث.</p>}
        </div>
      )}
    </>
  )
}
