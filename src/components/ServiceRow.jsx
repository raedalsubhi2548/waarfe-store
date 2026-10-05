import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useApp } from '../state.jsx'
import { money, effectivePrice } from '../lib/format.js'

// A service shown as a line in a price list — name, one-line summary, price, add.
export default function ServiceRow({ p, showCategory = false }) {
  const { addToCart, toggleWish, wishlist, categories } = useApp()
  const wished = wishlist.includes(p.id)
  const onSale = p.salePrice && p.salePrice < p.price
  const cat = showCategory && categories.find((c) => c.id === p.categoryId)
  return (
    <li className="srow">
      <Link to={`/p/${p.id}`} className="srow-thumb" tabIndex={-1} aria-hidden="true"><img src={p.image} alt="" loading="lazy" /></Link>
      <div className="srow-main">
        <div className="srow-title">
          <Link to={`/p/${p.id}`}>{p.name}</Link>
          {p.badge && <span className="srow-badge">{p.badge}</span>}
        </div>
        <p className="srow-sum">{cat ? <em>{cat.name}</em> : null}{p.summary}</p>
      </div>
      <div className="srow-price">
        <strong>{money(effectivePrice(p))}</strong>
        {onSale && <s>{money(p.price)}</s>}
        {p.perUnit && <small>{p.perUnit}</small>}
      </div>
      <div className="srow-act">
        <button className={'icon-btn' + (wished ? ' on' : '')} onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}><Icon name="heart" size={19} /></button>
        <button className="btn-add" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}><Icon name="plus" size={18} /></button>
      </div>
    </li>
  )
}
