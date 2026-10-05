import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Social from './Social.jsx'
import { useApp } from '../state.jsx'
import { WHATSAPP, waLink } from '../lib/format.js'

export default function Footer() {
  const { categories } = useApp()
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/logo.png" alt="وارف" className="foot-logo" width="600" height="580" />
            <p>نبني متجرك ونسوّقه ونجهّز أوراقه الرسمية.</p>
          </div>
          <a className="foot-wa" href={waLink('السلام عليكم، أبي أستفسر عن خدمات وارف')} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={22} />
            <span><small>كلّمنا على واتساب</small><b dir="ltr">0{WHATSAPP.slice(3)}</b></span>
          </a>
        </div>

        <div className="foot-cols">
          <nav aria-label="الأقسام">
            <h4>الأقسام</h4>
            <ul>{categories.map((c) => <li key={c.id}><Link to={`/c/${c.id}`}><Icon name={c.icon} size={15} />{c.name.replace(/^(ال)?خدمات\s/, '')}</Link></li>)}</ul>
          </nav>
          <nav aria-label="حسابك">
            <h4>حسابك</h4>
            <ul>
              <li><Link to="/account"><Icon name="receipt" size={15} />طلباتي</Link></li>
              <li><Link to="/account/wishlist"><Icon name="heart" size={15} />أمنياتي</Link></li>
              <li><Link to="/cart"><Icon name="bag" size={15} />السلة</Link></li>
              <li><Link to="/policies"><Icon name="shield" size={15} />السياسات</Link></li>
            </ul>
          </nav>
          <div className="foot-pay">
            <h4>الدفع</h4>
            <ul className="pay-chips">
              <li>مدى</li><li>Apple Pay</li><li>Visa</li><li>Mastercard</li><li>تحويل بنكي</li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <Social className="foot-social" />
          <p className="foot-legal">© {new Date().getFullYear()} وارف · وثيقة العمل الحر FL-164935115</p>
        </div>
      </div>
    </footer>
  )
}
