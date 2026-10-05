// Live backend: Supabase (auth + Postgres + storage). Schema in supabase/schema.sql.
import { createClient } from '@supabase/supabase-js'

// accept the URL with or without a trailing /rest/v1/ (common copy-paste from the dashboard)
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const sb = url && key ? createClient(url, key) : null

// --- row <-> object mapping (DB is snake_case, UI is camelCase) ---
const product = (r) => r && ({
  id: r.id, name: r.name, price: Number(r.price), salePrice: r.sale_price == null ? null : Number(r.sale_price),
  categoryId: r.category_id, image: r.image, badge: r.badge, featured: r.featured, sort: r.sort,
  summary: r.summary, description: r.description, active: r.active, digital: r.digital, perUnit: r.per_unit,
  createdAt: r.created_at,
})
const productRow = (p) => ({
  id: p.id, name: p.name, price: p.price, sale_price: p.salePrice || null, category_id: p.categoryId,
  image: p.image, badge: p.badge || null, featured: !!p.featured, sort: p.sort ?? 0, summary: p.summary,
  description: p.description, active: p.active !== false, digital: !!p.digital, per_unit: p.perUnit || null,
})
const order = (r) => r && ({
  id: r.id, number: r.number, userId: r.user_id, customer: r.customer, items: r.items,
  subtotal: Number(r.subtotal), discount: Number(r.discount), coupon: r.coupon, total: Number(r.total),
  status: r.status, notes: r.notes, paymentMethod: r.payment_method, history: r.history || [], createdAt: r.created_at,
})
const coupon = (r) => ({ code: r.code, type: r.type, value: Number(r.value), active: r.active, expiresAt: r.expires_at })

function check({ data, error }) { if (error) throw new Error(error.message); return data }

let cachedUser = null
async function loadProfile(authUser) {
  if (!authUser) return (cachedUser = null)
  const { data } = await sb.from('profiles').select('*').eq('id', authUser.id).maybeSingle()
  cachedUser = {
    id: authUser.id, email: authUser.email,
    name: data?.name || authUser.user_metadata?.name || '', phone: data?.phone || '',
    role: data?.role || 'customer', createdAt: data?.created_at || authUser.created_at,
  }
  return cachedUser
}

function translateAuthError(msg) {
  if (/Invalid login/i.test(msg)) return 'البريد أو كلمة المرور غير صحيحة'
  if (/already registered/i.test(msg)) return 'هذا البريد مسجّل مسبقاً، سجّل دخولك بدلاً من ذلك'
  if (/Email not confirmed/i.test(msg)) return 'فعّل بريدك من الرسالة اللي وصلتك ثم سجّل دخولك'
  if (/Password should be/i.test(msg)) return 'كلمة المرور لازم تكون 6 أحرف على الأقل'
  return msg
}

export const supa = {
  mode: 'live',
  ready: Promise.resolve(),

  async currentUser() {
    const { data } = await sb.auth.getSession()
    return loadProfile(data.session?.user)
  },
  onAuth(fn) {
    const { data } = sb.auth.onAuthStateChange(async (_e, session) => fn(await loadProfile(session?.user)))
    return () => data.subscription.unsubscribe()
  },
  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw new Error(translateAuthError(error.message))
    return loadProfile(data.user)
  },
  async signUp({ name, email, phone, password }) {
    const { data, error } = await sb.auth.signUp({
      email: email.trim(), password, options: { data: { name, phone }, emailRedirectTo: location.origin + '/account' },
    })
    if (error) throw new Error(translateAuthError(error.message))
    if (!data.session) throw new Error('أرسلنا لك رابط تفعيل على بريدك. فعّله ثم سجّل دخولك.')
    return loadProfile(data.user)
  },
  async signOut() { await sb.auth.signOut() },
  async updateProfile(patch) {
    const me = cachedUser; if (!me) throw new Error('سجّل دخولك أولاً')
    check(await sb.from('profiles').update({ name: patch.name, phone: patch.phone }).eq('id', me.id))
    return loadProfile((await sb.auth.getUser()).data.user)
  },

  async getCategories() { return check(await sb.from('categories').select('*').order('sort')) },
  async getProducts({ includeHidden = false } = {}) {
    let q = sb.from('products').select('*')
    if (!includeHidden) q = q.eq('active', true)
    return check(await q).map(product)
  },
  async getProduct(id) {
    const p = product(check(await sb.from('products').select('*').eq('id', id).maybeSingle()))
    if (p && cachedUser?.role === 'admin') {
      const { data } = await sb.from('product_files').select('path').eq('product_id', id).maybeSingle()
      p.fileUrl = data?.path || ''
    }
    return p
  },
  async saveProduct(p) {
    const row = productRow({ ...p, id: p.id || 'p-' + Date.now().toString(36) })
    check(await sb.from('products').upsert(row))
    if (p.fileUrl !== undefined) check(await sb.rpc('set_product_file', { p_product: row.id, p_path: p.fileUrl || '' }))
    return product(row)
  },
  async deleteProduct(id) { check(await sb.from('products').delete().eq('id', id)) },
  async saveCategory(c) {
    check(await sb.from('categories').upsert({ id: c.id || 'c-' + Date.now().toString(36), name: c.name, blurb: c.blurb, icon: c.icon || 'spark', sort: c.sort ?? 99 }))
  },
  async deleteCategory(id) {
    const { count } = await sb.from('products').select('id', { count: 'exact', head: true }).eq('category_id', id)
    if (count) throw new Error('انقل منتجات هذا التصنيف أولاً ثم احذفه')
    check(await sb.from('categories').delete().eq('id', id))
  },
  async uploadImage(file) {
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '')}`
    check(await sb.storage.from('products').upload(path, file, { upsert: false }))
    return sb.storage.from('products').getPublicUrl(path).data.publicUrl
  },

  // Prices are recomputed in the database (place_order) — the browser never sets the total.
  async createOrder({ items, customer, notes, coupon: code, paymentMethod }) {
    const id = check(await sb.rpc('place_order', {
      p_items: items.map((i) => ({ product_id: i.productId, qty: i.qty })),
      p_customer: customer, p_notes: notes || '', p_coupon: code || null, p_payment_method: paymentMethod,
    }))
    return order(check(await sb.from('orders').select('*').eq('id', id).single()))
  },
  async myOrders() {
    const me = cachedUser; if (!me) throw new Error('سجّل دخولك أولاً')
    return check(await sb.from('orders').select('*').eq('user_id', me.id).order('created_at', { ascending: false })).map(order)
  },
  async getOrder(id) { return order(check(await sb.from('orders').select('*').eq('id', id).maybeSingle())) },
  async allOrders() { return check(await sb.from('orders').select('*').order('created_at', { ascending: false })).map(order) },
  async updateOrderStatus(id, status, note) {
    check(await sb.rpc('set_order_status', { p_order: id, p_status: status, p_note: note || '' }))
  },

  async getWishlist() {
    const me = cachedUser
    if (!me) { try { return JSON.parse(localStorage.getItem('waarfe:wish:guest') || '[]') } catch { return [] } }
    return check(await sb.from('wishlists').select('product_id').eq('user_id', me.id)).map((r) => r.product_id)
  },
  async setWishlist(ids) {
    const me = cachedUser
    if (!me) { try { localStorage.setItem('waarfe:wish:guest', JSON.stringify(ids)) } catch { /* ignore */ } return }
    check(await sb.from('wishlists').delete().eq('user_id', me.id))
    if (ids.length) check(await sb.from('wishlists').insert(ids.map((product_id) => ({ user_id: me.id, product_id }))))
  },

  async listCustomers() { return check(await sb.rpc('admin_customers')) },
  async listCoupons() { return check(await sb.from('coupons').select('*')).map(coupon) },
  async saveCoupon(c) {
    check(await sb.from('coupons').upsert({ code: c.code.toUpperCase(), type: c.type, value: c.value, active: c.active, expires_at: c.expiresAt || null }))
  },
  async deleteCoupon(code) { check(await sb.from('coupons').delete().eq('code', code)) },
  async validateCoupon(code) {
    const r = check(await sb.rpc('check_coupon', { p_code: code.trim().toUpperCase() }))
    if (!r) throw new Error('الكود غير صالح أو منتهي')
    return coupon(r)
  },

  // Card / Apple Pay / mada through Tap — the charge is created server-side (api/tap-charge.js).
  async startPayment(o) {
    const { data } = await sb.auth.getSession()
    const res = await fetch('/api/tap-charge', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + data.session?.access_token },
      body: JSON.stringify({ orderId: o.id }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || 'تعذّر بدء الدفع، حاول مرة ثانية')
    return { redirect: body.url, order: o }
  },
  async downloadUrl(orderId, productId) {
    const { data } = await sb.auth.getSession()
    const res = await fetch(`/api/download?order=${encodeURIComponent(orderId)}&product=${encodeURIComponent(productId)}`, {
      headers: { authorization: 'Bearer ' + data.session?.access_token },
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || 'تعذّر التحميل')
    return body.url
  },
  async verifyPayment(orderId, tapId) {
    const res = await fetch(`/api/tap-verify?order=${encodeURIComponent(orderId)}&tap_id=${encodeURIComponent(tapId)}`)
    return res.json().catch(() => ({}))
  },
}
