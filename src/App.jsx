import { lazy as reactLazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// After a release an open tab may ask for page files that no longer exist: reload, at most once per 30 seconds.
const KEY = 'raed:chunk-reload'
const lazy = (load) => reactLazy(() => load().catch((err) => {
  let last
  try { last = Number(sessionStorage.getItem(KEY)) || 0 } catch { throw err }
  if (Date.now() - last > 30000) {
    try { sessionStorage.setItem(KEY, String(Date.now())) } catch { throw err }
    location.reload()
    return new Promise(() => {})
  }
  throw err
}))
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ADMIN_HOST, ADMIN_ORIGIN, LIVE_STORE } from './lib/host.js'
import { usePageViews } from './lib/analytics.js'
import { DirectionProvider } from '@radix-ui/react-direction'
import { AppProvider } from './state.jsx'
import Layout, { PageFallback } from './components/Layout.jsx'
import Toast from './components/Toast.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const Order = lazy(() => import('./pages/Order.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Policies = lazy(() => import('./pages/Policies.jsx'))
const Work = lazy(() => import('./pages/Work.jsx'))
const Reviews = lazy(() => import('./pages/Reviews.jsx'))
import NotFound from './pages/NotFound.jsx'
const AccountLayout = lazy(() => import('./pages/account/AccountLayout.jsx'))
const MyOrders = lazy(() => import('./pages/account/Orders.jsx'))
const Wishlist = lazy(() => import('./pages/account/Wishlist.jsx'))
const Profile = lazy(() => import('./pages/account/Profile.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const Overview = lazy(() => import('./pages/admin/Overview.jsx'))
const AdminOrders = lazy(() => import('./pages/admin/Orders.jsx'))
const Products = lazy(() => import('./pages/admin/Products.jsx'))
const ProductForm = lazy(() => import('./pages/admin/ProductForm.jsx'))
const Categories = lazy(() => import('./pages/admin/Categories.jsx'))
const Customers = lazy(() => import('./pages/admin/Customers.jsx'))
const Coupons = lazy(() => import('./pages/admin/Coupons.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))

function PageViews() { usePageViews(); return null }

// on admin.rraed.com everything except sign-in leads to the dashboard
function AdminHostGate() {
  const { pathname, search } = useLocation()
  // the store itself never shows the dashboard: it opens on admin.rraed.com
  if (LIVE_STORE && pathname.startsWith('/admin')) { location.replace(ADMIN_ORIGIN + pathname + search); return null }
  if (!ADMIN_HOST || pathname.startsWith('/admin')) return null
  return <Navigate to="/admin" replace />
}

// The router is passed in: BrowserRouter in the browser (main.jsx), StaticRouter when pages are pre-rendered (entry-server.jsx).
export default function App({ Router, routerProps = {}, initialCatalog }) {
  return (
    <DirectionProvider dir="rtl">
    <AppProvider initialCatalog={initialCatalog}>
      <ErrorBoundary>
      <Router {...routerProps}>
        <PageViews />
        <AdminHostGate />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="c/:categoryId" element={<Shop />} />
            <Route path="p/:id" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<Order />} />
            <Route path="login" element={<Login />} />
            <Route path="contact" element={<Contact />} />
            <Route path="policies" element={<Policies />} />
            <Route path="work" element={<Work />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<MyOrders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin/login" element={<Suspense fallback={<div className="min-h-dvh bg-[#0b1322]" />}><AdminLogin /></Suspense>} />
          <Route path="admin" element={<Suspense fallback={<PageFallback />}><AdminLayout /></Suspense>}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
          </Route>
        </Routes>
        <Toast />
      </Router>
      </ErrorBoundary>
    </AppProvider>
    </DirectionProvider>
  )
}
