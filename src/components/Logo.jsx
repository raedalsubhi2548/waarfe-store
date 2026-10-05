import { Link } from 'react-router-dom'

// Official Waarfe logo (public/logo.png). Green-only brand: always shown on a light ground.
export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={'logo ' + className} aria-label="وارف — الرئيسية">
      <img src="/logo.png" alt="وارف WAARFE" width="600" height="580" />
    </Link>
  )
}

// Small leaf mark used as a decorative glyph (drawn, not the logo).
export function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="mark">
      <path d="M20 35V15" />
      <path d="M20 23c-5.5-1.5-9.5-6-10-12 6 .3 10 4.6 10 10" />
      <path d="M20 19.5c4.5-1.4 8-5 8.6-10.6-5.6.2-8.6 4-8.6 9" />
    </svg>
  )
}
