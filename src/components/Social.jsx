import { siInstagram, siTiktok, siX, siYoutube, siWhatsapp } from 'simple-icons'
import { WHATSAPP } from '../lib/format.js'

export const SOCIAL = [
  { name: 'واتساب', href: `https://wa.me/${WHATSAPP}`, icon: siWhatsapp },
  { name: 'إنستقرام', href: 'https://www.instagram.com/waarfe_', icon: siInstagram },
  { name: 'تيك توك', href: 'https://www.tiktok.com/@waarfe', icon: siTiktok },
  { name: 'إكس', href: 'https://x.com/waarfe1', icon: siX },
  { name: 'يوتيوب', href: 'https://www.youtube.com/@Waarfe', icon: siYoutube },
]

export function BrandIcon({ icon, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon.path} /></svg>
}

export default function Social({ className = '' }) {
  return (
    <ul className={'social ' + className}>
      {SOCIAL.map((s) => (
        <li key={s.name}>
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name} style={{ '--brand': '#' + s.icon.hex }}>
            <BrandIcon icon={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  )
}
