import { SOCIAL, BrandIcon } from '../components/Social.jsx'
import Icon from '../components/Icon.jsx'
import { WHATSAPP, waLink } from '../lib/format.js'

export default function Contact() {
  return (
    <div className="page">
      <section className="page-hero"><div className="wrap"><h1>تواصل معنا</h1><p>أسرع طريقة نوصل لك فيها: واتساب. نرد عليك بنفس اليوم.</p></div></section>
      <div className="wrap contact-grid">
        <a className="contact-card main" href={waLink('السلام عليكم')} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={32} />
          <strong>واتساب</strong>
          <span dir="ltr">+{WHATSAPP}</span>
        </a>
        {SOCIAL.filter((s) => s.name !== 'واتساب').map((s) => (
          <a key={s.href} className="contact-card" href={s.href} target="_blank" rel="noreferrer">
            <span className="brand-ic" style={{ color: '#' + s.icon.hex }}><BrandIcon icon={s.icon} size={24} /></span><strong>{s.name}</strong><span dir="ltr">{s.href.replace(/^https:\/\/(www\.)?/, '')}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
