import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './lib/api.js'
import { unitPrice, chosenOptions, cleanSelection } from './lib/format.js'

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

  const sameUser = (a, b) => a === b || (!!a && !!b && a.id === b.id && a.role === b.role && a.name === b.name && a.phone === b.phone && a.email === b.email)
  const applyUser = useCallback((u) => { setUser((prev) => (sameUser(prev, u) ? prev : u)); setAuthReady(true) }, [])

  useEffect(() => {
    refreshCatalog().catch(() => setCatalogReady(true))
    let alive = true, gotEvent = false
    api.currentUser().then((u) => { if (alive && !gotEvent) applyUser(u) }, () => alive && setAuthReady(true))
    const off = api.onAuth((u) => { gotEvent = true; if (alive) applyUser(u) })
    return () => { alive = false; off() }
  }, [refreshCatalog, applyUser])

  useEffect(() => {
    let alive = true
    api.getWishlist().then((w) => { if (alive) setWishlistState(Array.isArray(w) ? w : []) }).catch(() => {})
    return () => { alive = false }
  }, [user?.id])
  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* ignore */ } }, [cart])

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])

  // cart lines store only id + chosen options + qty + note; prices always come from the live catalog.
  // The same service with different options is its own line (key = id + options).
  const lineKey = (productId, options = []) => [productId, ...[...options].sort()].join('|')
  const lines = useMemo(() => cart.map((l) => {
    const product = byId[l.productId]
    if (!product) return null
    const options = cleanSelection(product, l.options)
    return { ...l, key: l.key || lineKey(l.productId, l.options), options, product, chosen: chosenOptions(product, options), unit: unitPrice(product, options) }
  }).filter(Boolean), [cart, byId])
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)

  const keyOf = (l) => l.key || lineKey(l.productId, l.options)
  const addToCart = (productId, qty = 1, note = '', options = []) => {
    const key = lineKey(productId, options)
    setCart((c) => {
      const i = c.findIndex((l) => keyOf(l) === key)
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], key, qty: n[i].qty + qty, note: note || n[i].note }; return n }
      return [...c, { key, productId, options: [...options].sort(), qty, note }]
    })
    setCartOpen(true)
  }
  const setQty = (key, qty) => setCart((c) => (qty <= 0 ? c.filter((l) => keyOf(l) !== key) : c.map((l) => (keyOf(l) === key ? { ...l, qty } : l))))
  const setNote = (key, note) => setCart((c) => c.map((l) => (keyOf(l) === key ? { ...l, note } : l)))
  const clearCart = () => setCart([])

  const toggleWish = async (productId) => {
    const has = wishlist.includes(productId)
    const next = has ? wishlist.filter((x) => x !== productId) : [...wishlist, productId]
    setWishlistState(next)
    notify(has ? 'أُزيلت من أمنياتك' : 'أُضيفت إلى أمنياتك')
    try { await api.setWishlist(next) } catch (e) { notify(e.message, 'err') }
  }

  const value = {
    user, authReady, applyUser, categories, products, byId, catalogReady, refreshCatalog,
    lines, subtotal, count, addToCart, setQty, setNote, clearCart, cartOpen, setCartOpen,
    wishlist, toggleWish, toast, notify,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
