import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CartDrawer from './CartDrawer.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <a href="#main" className="skip">انتقل للمحتوى</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <CartDrawer />
    </>
  )
}
