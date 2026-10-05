import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './site/SiteHeader.jsx'
import SiteFooter from './site/SiteFooter.jsx'
import CartDrawer from './CartDrawer.jsx'

export function PageFallback() {
  return <div className="container-w py-16"><div className="h-80 animate-pulse rounded-xl bg-sunken" /></div>
}

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <a href="#main" className="skip">انتقل للمحتوى</a>
      <SiteHeader />
      <main id="main"><Suspense fallback={<PageFallback />}><Outlet /></Suspense></main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
