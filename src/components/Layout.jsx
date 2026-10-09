import { Suspense, useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './site/SiteHeader.jsx'
import SiteFooter from './site/SiteFooter.jsx'
import CartDrawer from './CartDrawer.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import Vine from './brand/Vine.jsx'
import { ThemeStyle, AnnouncementBar } from './site/StoreTheme.jsx'
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
  const { products, categories, catalogReady, settings } = useApp()
  // the store name/description (store designer) is part of every title, so a change re-applies the head
  const seoData = useMemo(() => ({ products, categories, faq: FAQ, reviews: ALL_REVIEWS, store: settings.store }), [products, categories, settings.store])
  const home = pathname === '/' || pathname === '/admin/preview' // the store designer previews the home page there
  // single-segment paths may be a category or a service: wait for the catalog before naming the page
  useSeo(pathname === '/admin/preview' ? null : catalogReady || /^\/(shop|work|reviews|blog|contact|policies|cart|checkout|login|account|order)(\/|$)/.test(pathname) || pathname === '/' ? pathname.replace(/\/$/, '') || '/' : null, seoData)
  return (
    <>
      <ThemeStyle />
      <a href="#main" className="skip">انتقل للمحتوى</a>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="site-main relative isolate overflow-x-clip">
        {!home && settings.background.decor && (
          <>
            {/* inner pages share the homepage's picture: one soft backdrop and one continuous line from header to footer */}
            <Vine />
            <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_420px_at_50%_0%,color-mix(in_srgb,var(--p-green-900)_7%,transparent),transparent),radial-gradient(45%_30%_at_100%_40%,color-mix(in_srgb,var(--p-green-900)_5%,transparent),transparent),radial-gradient(45%_30%_at_0%_75%,color-mix(in_srgb,var(--p-gold-400)_14%,transparent),transparent)]" aria-hidden="true" />
          </>
        )}
        <ErrorBoundary resetKey={pathname}><Suspense fallback={<PageFallback />}><Outlet /></Suspense></ErrorBoundary>
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  )
}
