import { Suspense, useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './site/SiteHeader.jsx'
import SiteFooter from './site/SiteFooter.jsx'
import CartDrawer from './CartDrawer.jsx'
import { useApp } from '../state.jsx'
import { useSeo } from '../lib/useSeo.js'
import { FAQ } from '../data/content.js'
import { ALL_REVIEWS } from '../data/reviews.js'

export function PageFallback() {
  return <div className="container-w py-16"><div className="h-80 animate-pulse rounded-xl bg-sunken" /></div>
}

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const { products, categories, catalogReady } = useApp()
  const seoData = useMemo(() => ({ products, categories, faq: FAQ, reviews: ALL_REVIEWS }), [products, categories])
  useSeo(catalogReady || !/^\/(p|c)\//.test(pathname) ? pathname.replace(/\/$/, '') || '/' : null, seoData)
  return (
    <>
      <a href="#main" className="skip">انتقل للمحتوى</a>
      <SiteHeader />
      <main id="main" className="site-main"><Suspense fallback={<PageFallback />}><Outlet /></Suspense></main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
