import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './lib/api.js'
import { effectivePrice } from './lib/format.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const CART_KEY = 'raed:cart'
const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] } }

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [catalogReady, setCatalogReady] = useState(false)
  const [cart, setCart] = useState(loadCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlist, setWishlistState] = useState([])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  const notify = useCallback((text, kind = 'ok') => {
    clearTimeout(toastTimer.current)
    setToast({ text, kind, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const refreshCatalog = useCallback(async () => {
    const [c, p] = await Promise.all([api.getCategories(), api.getProducts()])
    setCategories(c); setProducts(p.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))); setCatalogReady(true)
  }, [])

  useEffect(() => {
    refreshCatalog().catch(() => setCatalogReady(true))
    api.currentUser().then((u) => { setUser(u); setAuthReady(true) }).catch(() => setAuthReady(true))
    return api.onAuth((u) => setUser(u))
  }, [refreshCatalog])

  useEffect(() => { api.getWishlist().then(setWishlistState).catch(() => {}) }, [user?.id])
  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* ignore */ } }, [cart])

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])

  // cart lines store only id + qty + note; prices always come from the live catalog
  const lines = useMemo(() => cart.map((l) => ({ ...l, product: byId[l.productId] })).filter((l) => l.product), [cart, byId])
  const subtotal = lines.reduce((s, l) => s + effectivePrice(l.product) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)

  const addToCart = (productId, qty = 1, note = '') => {
    setCart((c) => {
      const i = c.findIndex((l) => l.productId === productId)
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + qty, note: note || n[i].note }; return n }
      return [...c, { productId, qty, note }]
    })
    setCartOpen(true)
  }
  const setQty = (productId, qty) => setCart((c) => (qty <= 0 ? c.filter((l) => l.productId !== productId) : c.map((l) => (l.productId === productId ? { ...l, qty } : l))))
  const setNote = (productId, note) => setCart((c) => c.map((l) => (l.productId === productId ? { ...l, note } : l)))
  const clearCart = () => setCart([])

  const toggleWish = async (productId) => {
    const has = wishlist.includes(productId)
    const next = has ? wishlist.filter((x) => x !== productId) : [...wishlist, productId]
    setWishlistState(next)
    notify(has ? 'أُزيلت من أمنياتك' : 'أُضيفت إلى أمنياتك')
    try { await api.setWishlist(next) } catch (e) { notify(e.message, 'err') }
  }

  const value = {
    user, authReady, categories, products, byId, catalogReady, refreshCatalog,
    lines, subtotal, count, addToCart, setQty, setNote, clearCart, cartOpen, setCartOpen,
    wishlist, toggleWish, toast, notify,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
