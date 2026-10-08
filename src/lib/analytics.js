// Google Analytics 4 (G-CX5HXTP046). Loaded from a file, not an inline <script>, so the strict CSP stays on.
// Page views are sent on every route change (the store is a single-page app); admin pages are left out.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const GA_ID = 'G-CX5HXTP046'
const on = typeof window !== 'undefined' && location.hostname === 'rraed.com'

if (on) {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
  const s = Object.assign(document.createElement('script'), { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` })
  document.head.appendChild(s)
}

export const track = (name, params = {}) => { if (on) window.gtag('event', name, params) }

const item = (l) => ({ item_id: l.productId || l.product?.id, item_name: l.name || l.product?.name, price: Number(l.unit ?? l.price) || 0, quantity: l.qty || 1 })
export const trackAddToCart = (p, qty, unit) => track('add_to_cart', { currency: 'SAR', value: unit * qty, items: [{ item_id: p.id, item_name: p.name, price: unit, quantity: qty }] })
export const trackBeginCheckout = (lines, value) => track('begin_checkout', { currency: 'SAR', value, items: lines.map(item) })
export const trackPurchase = (order) => {
  // once per order, even if the return page is reloaded
  const k = 'raed:ga-purchase:' + order.id
  try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1') } catch { /* ignore */ }
  track('purchase', { transaction_id: String(order.number), currency: 'SAR', value: Number(order.total) || 0, items: (order.items || []).map(item) })
}

/** Sends a page_view for each page the visitor opens. */
export function usePageViews() {
  const loc = useLocation()
  useEffect(() => {
    if (!on || loc.pathname.startsWith('/admin')) return
    // let the page set its <title> first
    const t = setTimeout(() => track('page_view', { page_location: location.href, page_path: loc.pathname + loc.search, page_title: document.title }), 50)
    return () => clearTimeout(t)
  }, [loc.pathname, loc.search])
}
