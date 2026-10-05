import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './state.jsx'
import Layout from './components/Layout.jsx'
import Toast from './components/Toast.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Order from './pages/Order.jsx'
import Login from './pages/Login.jsx'
import Contact from './pages/Contact.jsx'
import Policies from './pages/Policies.jsx'
import NotFound from './pages/NotFound.jsx'
import AccountLayout from './pages/account/AccountLayout.jsx'
import MyOrders from './pages/account/Orders.jsx'
import Wishlist from './pages/account/Wishlist.jsx'
import Profile from './pages/account/Profile.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Overview from './pages/admin/Overview.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import Products from './pages/admin/Products.jsx'
import ProductForm from './pages/admin/ProductForm.jsx'
import Categories from './pages/admin/Categories.jsx'
import Customers from './pages/admin/Customers.jsx'
import Coupons from './pages/admin/Coupons.jsx'

export default function App() {
  return (
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
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<MyOrders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
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
  )
}
