import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

export default function App() {
  return (
    <DirectionProvider dir="rtl">
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppProvider>
    </DirectionProvider>
  )
}
