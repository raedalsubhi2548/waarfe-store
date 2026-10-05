import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../state.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { effectivePrice } from '../lib/format.js'

const SORTS = [
  { id: 'featured', label: 'المقترح' },
  { id: 'low', label: 'الأقل سعراً' },
  { id: 'high', label: 'الأعلى سعراً' },
  { id: 'name', label: 'الاسم' },
]

export default function Shop() {
  const { categoryId } = useParams()
  const [params, setParams] = useSearchParams()
  const { categories, products, catalogReady } = useApp()
  const q = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const cat = categories.find((c) => c.id === categoryId)

  const list = useMemo(() => {
    let l = products
    if (categoryId) l = l.filter((p) => p.categoryId === categoryId)
    if (q) l = l.filter((p) => (p.name + ' ' + (p.summary || '') + ' ' + (p.description || '')).includes(q))
    const s = [...l]
    if (sort === 'low') s.sort((a, b) => effectivePrice(a) - effectivePrice(b))
    if (sort === 'high') s.sort((a, b) => effectivePrice(b) - effectivePrice(a))
    if (sort === 'name') s.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
    if (sort === 'featured') s.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return s
  }, [products, categoryId, q, sort])

  const set = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n, { replace: true }) }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="المسار"><Link to="/">الرئيسية</Link><Icon name="chevron" size={14} /><span>{cat ? cat.name : 'كل الخدمات'}</span></nav>
          <h1>{cat ? cat.name : q ? `نتائج «${q}»` : 'كل الخدمات'}</h1>
          {cat?.blurb && <p>{cat.blurb}</p>}
        </div>
      </section>
      <div className="wrap shop-layout">
        <aside className="shop-side" aria-label="الأقسام">
          <h2 className="side-title">الأقسام</h2>
          <ul className="side-cats">
            <li><Link to={'/shop' + (q ? `?q=${q}` : '')} className={!categoryId ? 'on' : ''}>كل الخدمات <i>{products.length}</i></Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link to={`/c/${c.id}`} className={categoryId === c.id ? 'on' : ''}><Icon name={c.icon} size={18} />{c.name}<i>{products.filter((p) => p.categoryId === c.id).length}</i></Link></li>
            ))}
          </ul>
        </aside>
        <div>
          <div className="shop-bar">
            <label className="field-inline search-inline">
              <Icon name="search" size={18} />
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="ابحث داخل الخدمات" aria-label="بحث" />
            </label>
            <label className="field-inline">
              <span>ترتيب</span>
              <select value={sort} onChange={(e) => set('sort', e.target.value)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <p className="muted result-count">{list.length} خدمة</p>
          <div className="grid grid-3">
            {!catalogReady && Array.from({ length: 6 }, (_, i) => <div key={i} className="pcard skeleton" />)}
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          {catalogReady && list.length === 0 && (
            <div className="empty">
              <p>ما فيه خدمة تطابق بحثك. امسح البحث أو اختر قسماً آخر.</p>
              <button className="btn btn-ghost" onClick={() => setParams({})}>مسح البحث</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
