import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import Icon from '../../components/Icon.jsx'

const ICONS = ['pen', 'megaphone', 'key', 'seal', 'book', 'spark', 'box', 'tag', 'card', 'shield']

function Row({ c, count, onSaved }) {
  const { notify } = useApp()
  const [f, setF] = useState(c)
  const dirty = JSON.stringify(f) !== JSON.stringify(c)
  const save = async () => { try { await api.saveCategory({ ...f, sort: Number(f.sort) }); notify('تم حفظ التصنيف'); onSaved() } catch (e) { notify(e.message, 'err') } }
  const del = async () => { if (!window.confirm(`حذف تصنيف «${c.name}»؟`)) return; try { await api.deleteCategory(c.id); notify('تم حذف التصنيف'); onSaved() } catch (e) { notify(e.message, 'err') } }
  return (
    <li className="cat-row">
      <select value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} aria-label="الأيقونة" className="icon-select">{ICONS.map((i) => <option key={i} value={i}>{i}</option>)}</select>
      <Icon name={f.icon} />
      <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="الاسم" />
      <input value={f.blurb || ''} onChange={(e) => setF({ ...f, blurb: e.target.value })} aria-label="الوصف" className="grow" />
      <input type="number" value={f.sort} onChange={(e) => setF({ ...f, sort: e.target.value })} aria-label="الترتيب" className="w-num" dir="ltr" />
      <span className="muted small">{count} منتج</span>
      <button className="btn btn-primary" onClick={save} disabled={!dirty}>حفظ</button>
      <button className="icon-btn danger" onClick={del} aria-label="حذف"><Icon name="trash" size={18} /></button>
    </li>
  )
}

export default function Categories() {
  const { categories, products, refreshCatalog, notify } = useApp()
  const [name, setName] = useState('')
  const add = async (e) => {
    e.preventDefault()
    try { await api.saveCategory({ id: 'cat-' + Date.now().toString(36), name, blurb: '', icon: 'spark', sort: categories.length + 1 }); setName(''); refreshCatalog(); notify('أُضيف التصنيف') } catch (er) { notify(er.message, 'err') }
  }
  return (
    <>
      <header className="admin-head"><h1>التصنيفات</h1></header>
      <form className="panel row-gap" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم تصنيف جديد" required aria-label="اسم التصنيف" className="grow" />
        <button className="btn btn-primary"><Icon name="plus" size={18} />أضف</button>
      </form>
      <ul className="panel cat-list">
        {categories.map((c) => <Row key={c.id + c.name + c.sort + c.icon} c={c} count={products.filter((p) => p.categoryId === c.id).length} onSaved={refreshCatalog} />)}
      </ul>
    </>
  )
}
