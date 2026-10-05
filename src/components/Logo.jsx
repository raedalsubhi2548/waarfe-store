import { Link } from 'react-router-dom'

// Wordmark + canopy mark. Drop the official logo at public/logo.svg and set VITE_LOGO_URL=/logo.svg to use it instead.
const LOGO = import.meta.env.VITE_LOGO_URL

export function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="mark">
      <path d="M20 35V15" />
      <path d="M20 23c-5.5-1.5-9.5-6-10-12 6 .3 10 4.6 10 10" />
      <path d="M20 19.5c4.5-1.4 8-5 8.6-10.6-5.6.2-8.6 4-8.6 9" />
    </svg>
  )
}

export default function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className={'logo' + (light ? ' logo-light' : '')} aria-label="وارف — الرئيسية">
      {LOGO ? <img src={LOGO} alt="وارف" height="38" /> : (<><Mark /><span>وارف</span></>)}
    </Link>
  )
}
