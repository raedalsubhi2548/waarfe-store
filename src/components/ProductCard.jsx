import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useApp } from '../state.jsx'
import { money, effectivePrice } from '../lib/format.js'

export default function ProductCard({ p }) {
  const { addToCart, toggleWish, wishlist, categories } = useApp()
  const wished = wishlist.includes(p.id)
  const onSale = p.salePrice && p.salePrice < p.price
  const cat = categories.find((c) => c.id === p.categoryId)
  return (
    <article className="pcard">
      <Link to={`/p/${p.id}`} className="pcard-media">
        <img src={p.image} alt="" loading="lazy" />
        {p.badge && <span className="pcard-badge">{p.badge}</span>}
      </Link>
      <button
        className={'wish' + (wished ? ' on' : '')} onClick={() => toggleWish(p.id)}
        aria-pressed={wished} aria-label={wished ? 'إزالة من الأمنيات' : 'إضافة إلى الأمنيات'}
      ><Icon name="heart" size={18} /></button>
      <div className="pcard-body">
        {cat && <span className="pcard-cat">{cat.name}</span>}
        <h3><Link to={`/p/${p.id}`}>{p.name}</Link></h3>
        <div className="pcard-foot">
          <div className="price">
            <strong>{money(effectivePrice(p))}</strong>
            {onSale && <s>{money(p.price)}</s>}
            {p.perUnit && <small>{p.perUnit}</small>}
          </div>
          <button className="btn-add" onClick={() => addToCart(p.id)} aria-label={`أضف ${p.name} للسلة`}>
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
