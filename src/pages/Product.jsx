import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../state.jsx'
import Icon from '../components/Icon.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Qty } from '../components/CartDrawer.jsx'
import { money, effectivePrice, parseDescription, waLink } from '../lib/format.js'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { id } = useParams()
  const { byId, categories, products, addToCart, toggleWish, wishlist, catalogReady } = useApp()
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const p = byId[id]
  if (!p) return catalogReady ? <NotFound /> : <div className="page wrap pad-xl"><div className="skeleton tall" /></div>

  const cat = categories.find((c) => c.id === p.categoryId)
  const { intro, sections } = parseDescription(p.description)
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4)
  const wished = wishlist.includes(p.id)
  const onSale = p.salePrice && p.salePrice < p.price

  return (
    <div className="page">
      <div className="wrap">
        <nav className="crumbs pad-top" aria-label="المسار">
          <Link to="/">الرئيسية</Link><Icon name="chevron" size={14} />
          {cat && <><Link to={`/c/${cat.id}`}>{cat.name}</Link><Icon name="chevron" size={14} /></>}
          <span>{p.name}</span>
        </nav>
        <div className="pd-grid">
          <div className="pd-media">
            <img src={p.image} alt={p.name} />
            {p.badge && <span className="pcard-badge">{p.badge}</span>}
          </div>
          <div className="pd-info">
            <h1>{p.name}</h1>
            <p className="pd-summary">{p.summary}</p>
            <div className="pd-price">
              <strong>{money(effectivePrice(p))}</strong>
              {onSale && <s>{money(p.price)}</s>}
              {onSale && <span className="save">وفّر {money(p.price - p.salePrice)}</span>}
              {p.perUnit && <small>{p.perUnit}</small>}
            </div>
            <label className="field">
              <span>{p.digital ? 'ملاحظة (اختياري)' : 'وش تحتاج بالضبط؟ (اختياري)'}</span>
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={p.digital ? '' : 'اسم متجرك، رابطه، أو أي تفاصيل تساعدنا نبدأ أسرع'} />
            </label>
            <div className="pd-buy">
              {!p.digital && <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} />}
              <button className="btn btn-primary btn-lg grow" onClick={() => addToCart(p.id, qty, note)}>
                {`أضف للسلة (${money(effectivePrice(p) * qty)})`}
              </button>
              <button className={'icon-btn boxed' + (wished ? ' on' : '')} onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label="الأمنيات">
                <Icon name="heart" />
              </button>
            </div>
            <ul className="pd-assure">
              <li><Icon name="shield" size={18} />دفع آمن ومتابعة الطلب من حسابك</li>
              <li><Icon name={p.digital ? 'download' : 'clock'} size={18} />{p.digital ? 'تحميل فوري بعد الدفع' : 'نتواصل معك بعد الطلب مباشرة'}</li>
              <li><a href={waLink(`السلام عليكم، عندي سؤال عن: ${p.name}`)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} />اسأل عن الخدمة على واتساب</a></li>
            </ul>
          </div>
        </div>

        <section className="pd-details">
          <div className="pd-intro"><h2>عن الخدمة</h2><p>{intro}</p></div>
          <div className="pd-sections">
            {sections.map((s) => (
              <div key={s.title} className="pd-sec">
                <h3>{s.title}</h3>
                <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="section-tight">
            <h2 className="h-sec">من نفس القسم</h2>
            <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </section>
        )}
      </div>
    </div>
  )
}
