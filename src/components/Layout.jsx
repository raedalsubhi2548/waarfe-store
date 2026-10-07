import { Suspense, useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './site/SiteHeader.jsx'
import SiteFooter from './site/SiteFooter.jsx'
import CartDrawer from './CartDrawer.jsx'
import Vine from './brand/Vine.jsx'
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
      <main id="main" className="site-main relative isolate overflow-x-clip">
        {pathname !== '/' && pathname !== '/build' && (
          <>
            {/* inner pages share the homepage's picture: one soft backdrop and one continuous line from header to footer */}
            <Vine />
            <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_420px_at_50%_0%,rgb(27_43_68/0.07),transparent),radial-gradient(45%_30%_at_100%_40%,rgb(27_43_68/0.05),transparent),radial-gradient(45%_30%_at_0%_75%,rgb(195_206_221/0.14),transparent)]" aria-hidden="true" />
          </>
        )}
        <Suspense fallback={<PageFallback />}><Outlet /></Suspense>
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
