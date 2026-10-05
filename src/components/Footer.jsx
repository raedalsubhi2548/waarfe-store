import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { useApp } from '../state.jsx'
import { WHATSAPP, waLink } from '../lib/format.js'

export const SOCIAL = [
  { name: 'إنستقرام', href: 'https://www.instagram.com/waarfe_' },
  { name: 'تيك توك', href: 'https://www.tiktok.com/@waarfe' },
  { name: 'إكس', href: 'https://x.com/waarfe1' },
  { name: 'يوتيوب', href: 'https://www.youtube.com/@Waarfe' },
]

export default function Footer() {
  const { categories } = useApp()
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Logo light />
          <p>نبني متجرك ونسوّقه ونجهّز أوراقه الرسمية، لين يصير جاهز يبيع بثقة.</p>
          <a className="btn btn-gold" href={waLink('السلام عليكم، أبي أستفسر عن خدمات وارف')} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} /> كلّمنا على واتساب
          </a>
        </div>
        <div>
          <h4>الخدمات</h4>
          <ul>{categories.map((c) => <li key={c.id}><Link to={`/c/${c.id}`}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h4>حسابك</h4>
          <ul>
            <li><Link to="/account">طلباتي</Link></li>
            <li><Link to="/account/wishlist">أمنياتي</Link></li>
            <li><Link to="/cart">السلة</Link></li>
            <li><Link to="/policies">السياسات والشروط</Link></li>
          </ul>
        </div>
        <div>
          <h4>تابعنا</h4>
          <ul>{SOCIAL.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.name}</a></li>)}</ul>
          <p className="foot-contact" dir="ltr">+{WHATSAPP}</p>
        </div>
      </div>
      <div className="wrap foot-legal">
        <span>© {new Date().getFullYear()} وارف. جميع الحقوق محفوظة.</span>
        <span>وثيقة العمل الحر: FL-164935115</span>
      </div>
    </footer>
  )
}
